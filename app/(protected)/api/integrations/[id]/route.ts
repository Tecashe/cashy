
// ============================================
// API Route: /api/integrations/[id]/route.ts
// ============================================
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/clerk"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()

    const integration = await prisma.integration.delete({
      where: {
        id: params.id,
        userId: userId,
      },
    })

    // Disconnect MCP server
    try {
      const { mcpManager } = await import("@/lib/mcp-server-manager")
      await mcpManager.disconnect(integration.id)
    } catch (error) {
      console.error("Failed to disconnect MCP server:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}