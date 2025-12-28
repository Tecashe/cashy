import { prisma } from "./db"
import { decrypt } from "./encrypt"


export class CalendlyService {
  private apiKey: string
  private userUri: string

  constructor(apiKey: string, userUri: string) {
    this.apiKey = apiKey
    this.userUri = userUri
  }

  /**
   * Get available time slots for a date range
   */
  async getAvailability(
    eventTypeUri: string,
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    try {
      // Get event type details
      const eventTypeResponse = await fetch(`https://api.calendly.com${eventTypeUri}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      const eventType = await eventTypeResponse.json()

      // Get availability
      const availabilityResponse = await fetch(
        `https://api.calendly.com/event_type_available_times?event_type=${eventTypeUri}&start_time=${startDate}&end_time=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      const availability = await availabilityResponse.json()

      return availability.collection?.map((slot: any) => slot.start_time) || []
    } catch (error) {
      console.error("[Calendly] Error fetching availability:", error)
      return []
    }
  }

  /**
   * Schedule a meeting
   */
  async scheduleMeeting(params: {
    eventTypeUri: string
    startTime: string
    email: string
    name: string
    notes?: string
  }): Promise<{ success: boolean; scheduledEvent?: any; error?: string }> {
    try {
      const response = await fetch("https://api.calendly.com/scheduled_events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: params.eventTypeUri,
          start_time: params.startTime,
          invitee: {
            email: params.email,
            name: params.name,
          },
          ...(params.notes && { notes: params.notes }),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.message || "Failed to schedule meeting",
        }
      }

      const scheduledEvent = await response.json()

      return {
        success: true,
        scheduledEvent: scheduledEvent.resource,
      }
    } catch (error) {
      console.error("[Calendly] Error scheduling meeting:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(eventUri: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.calendly.com${eventUri}/cancellation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason || "Cancelled via AI assistant",
        }),
      })

      return response.ok
    } catch (error) {
      console.error("[Calendly] Error cancelling meeting:", error)
      return false
    }
  }

  /**
   * Get event types
   */
  async getEventTypes(): Promise<any[]> {
    try {
      const response = await fetch(`https://api.calendly.com/event_types?user=${this.userUri}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      const data = await response.json()
      return data.collection || []
    } catch (error) {
      console.error("[Calendly] Error fetching event types:", error)
      return []
    }
  }
}

// ============================================
// AI Tool: book_appointment implementation
// Add to your AI response handler
// ============================================

async function executeCalendlyBooking(input: any, context: any, userId: string) {
  // Get Calendly integration
  const integration = await prisma.integration.findFirst({
    where: {
      userId,
      type: "calendly",
      isActive: true,
    },
  })

  if (!integration) {
    return {
      success: false,
      error: "Calendly not connected",
    }
  }

  const config = integration.config as any
  const apiKey = decrypt(config.encrypted)
  const calendly = new CalendlyService(apiKey, config.userUri)

  // Get event types
  const eventTypes = await calendly.getEventTypes()

  // Find matching event type (or use default)
  let eventType = eventTypes[0] // Default to first
  if (input.service) {
    const match = eventTypes.find(
      (et: any) => et.name.toLowerCase().includes(input.service.toLowerCase())
    )
    if (match) eventType = match
  }

  // Check availability for requested date
  const requestedDate = new Date(input.date)
  const startDate = requestedDate.toISOString()
  const endDate = new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000).toISOString()

  const availableSlots = await calendly.getAvailability(eventType.uri, startDate, endDate)

  // Check if requested time is available
  const requestedTime = `${input.date}T${input.time}:00`
  const isAvailable = availableSlots.some(
    (slot) => new Date(slot).toISOString().slice(0, 16) === requestedTime.slice(0, 16)
  )

  if (!isAvailable) {
    return {
      success: false,
      reason: "Time slot not available",
      alternative_slots: availableSlots.slice(0, 3).map((slot) => {
        const date = new Date(slot)
        return {
          date: date.toISOString().split("T")[0],
          time: date.toTimeString().slice(0, 5),
        }
      }),
    }
  }

  // Get customer info from conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: context.conversationId },
  })

  // Book the meeting
  const result = await calendly.scheduleMeeting({
    eventTypeUri: eventType.uri,
    startTime: requestedTime,
    email: conversation?.customerEmail || `${context.senderId}@instagram.temporary`,
    name: context.participantName,
    notes: `Booked via Instagram DM automation`,
  })

  if (result.success) {
    // Save appointment to database
    await prisma.appointment.create({
      data: {
        userId,
        conversationId: context.conversationId,
        customerName: context.participantName,
        customerUsername: context.participantUsername,
        service: input.service || eventType.name,
        date: new Date(requestedTime),
        durationMinutes: eventType.duration || 30,
        status: "confirmed",
        googleCalendarEventId: result.scheduledEvent?.uri,
      },
    })

    return {
      success: true,
      appointment_id: result.scheduledEvent?.uri,
      service: eventType.name,
      date: input.date,
      time: input.time,
      meeting_url: result.scheduledEvent?.location?.join_url,
      confirmation_message: `✅ Your ${eventType.name} is confirmed for ${input.date} at ${input.time}. You'll receive a calendar invite shortly.`,
    }
  }

  return result
}