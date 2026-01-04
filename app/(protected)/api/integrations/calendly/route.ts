// // app/api/integrations/calendly/route.ts

// import { NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { encrypt, decrypt } from "@/lib/encrypt"

// // POST: Connect Calendly
// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const { apiKey, calendlyUrl } = await request.json()

//     // Test the API key by fetching user info
//     const testResponse = await fetch("https://api.calendly.com/users/me", {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     })

//     if (!testResponse.ok) {
//       return NextResponse.json({ error: "Invalid Calendly API key" }, { status: 400 })
//     }

//     const calendlyUser = await testResponse.json()

//     // Fetch event types
//     const eventTypesResponse = await fetch(
//       `https://api.calendly.com/event_types?user=${calendlyUser.resource.uri}`,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     )

//     const eventTypesData = await eventTypesResponse.json()

//     // Store integration
//     await prisma.integration.upsert({
//       where: {
//         userId_type: {
//           userId: user.id,
//           type: "calendly",
//         },
//       },
//       create: {
//         userId: user.id,
//         type: "calendly",
//         name: "Calendly",
//         isActive: true,
//         config: {
//           encrypted: encrypt(apiKey),
//           calendlyUrl,
//           userUri: calendlyUser.resource.uri,
//         },
//       },
//       update: {
//         isActive: true,
//         config: {
//           encrypted: encrypt(apiKey),
//           calendlyUrl,
//           userUri: calendlyUser.resource.uri,
//         },
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       eventTypes: eventTypesData.collection || [],
//     })
//   } catch (error) {
//     console.error("[Calendly] Connection error:", error)
//     return NextResponse.json({ error: "Failed to connect Calendly" }, { status: 500 })
//   }
// }

// // DELETE: Disconnect Calendly
// export async function DELETE(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     await prisma.integration.deleteMany({
//       where: {
//         userId: user.id,
//         type: "calendly",
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[Calendly] Disconnect error:", error)
//     return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { encrypt } from "@/lib/encrypt"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { apiKey, calendlyUrl } = await request.json()

    // Test the API key
    const testResponse = await fetch("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!testResponse.ok) {
      return NextResponse.json({ error: "Invalid Calendly API key" }, { status: 400 })
    }

    const calendlyUser = await testResponse.json()

    // Fetch event types
    const eventTypesResponse = await fetch(
      `https://api.calendly.com/event_types?user=${calendlyUser.resource.uri}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    const eventTypesData = await eventTypesResponse.json()

    // ✅ FIXED: Use where with unique constraint
    await prisma.integration.upsert({
      where: {
        userId_type: { // Use the composite unique key
          userId: user.id,
          type: "calendly",
        },
      },
      create: {
        userId: user.id,
        type: "calendly",
        name: "Calendly",
        isActive: true,
        config: {
          encrypted: encrypt(apiKey),
          calendlyUrl,
          userUri: calendlyUser.resource.uri,
        },
      },
      update: {
        isActive: true,
        config: {
          encrypted: encrypt(apiKey),
          calendlyUrl,
          userUri: calendlyUser.resource.uri,
        },
      },
    })

    return NextResponse.json({
      success: true,
      eventTypes: eventTypesData.collection || [],
    })
  } catch (error) {
    console.error("[Calendly] Connection error:", error)
    return NextResponse.json({ error: "Failed to connect Calendly" }, { status: 500 })
  }
}
