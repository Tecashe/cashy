export function replaceTemplateVariables(
  template: string,
  conversation: {
    participantName: string
    lastMessageText?: string | null
    lastMessageAt?: Date | null
  },
) {
  let result = template

  // Extract first name from full name
  const firstName = conversation.participantName.split(" ")[0]
  result = result.replace(/{firstName}/g, firstName)

  // Last product mentioned (simple extraction)
  if (conversation.lastMessageText) {
    const productMatch = conversation.lastMessageText.match(/\b(\w+\s+\w+)\b/)
    result = result.replace(/{lastProduct}/g, productMatch?.[1] || "our product")
  }

  // Days since contact
  if (conversation.lastMessageAt) {
    const days = Math.floor((Date.now() - conversation.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24))
    result = result.replace(/{daysSinceContact}/g, days.toString())
  }

  // Time of day
  const hour = new Date().getHours()
  let greeting = "Good morning"
  if (hour >= 12 && hour < 17) greeting = "Good afternoon"
  if (hour >= 17) greeting = "Good evening"
  result = result.replace(/{timeOfDay}/g, greeting)

  return result
}
