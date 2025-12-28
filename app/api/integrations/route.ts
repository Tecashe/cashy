import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/clerk"
import { encrypt, decrypt } from "@/lib/encrypt"

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const integrations = await prisma.integration.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return encrypted config to client
      },
    })

    return NextResponse.json({ integrations })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const { type, name, credentials } = await request.json()

    // Encrypt sensitive credentials
    const encryptedConfig = encrypt(JSON.stringify(credentials))

    const integration = await prisma.integration.create({
      data: {
        userId,
        type,
        name,
        isActive: true,
        config: encryptedConfig,
      },
    })

    // Initialize MCP server for this integration
    try {
      const { mcpManager } = await import("@/lib/mcp-server-manager")
      await mcpManager.initializeServers(userId)
    } catch (error) {
      console.error("Failed to initialize MCP server:", error)
    }

    return NextResponse.json({ 
      integration: {
        id: integration.id,
        type: integration.type,
        name: integration.name,
        isActive: integration.isActive,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}