// // lib/mcp-server-manager.ts
// // This is the REVOLUTIONARY part - MCP servers give AI superpowers

// import { Client } from "@modelcontextprotocol/sdk/client/index.js"
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

// interface MCPServer {
//   id: string
//   name: string
//   command: string
//   args: string[]
//   env?: Record<string, string>
//   tools: MCPTool[]
// }

// interface MCPTool {
//   name: string
//   description: string
//   inputSchema: any
// }

// export class MCPServerManager {
//   private servers: Map<string, { client: Client; transport: StdioClientTransport }> = new Map()
//   private availableTools: Map<string, MCPTool & { serverId: string }> = new Map()

//   // Initialize MCP servers for a user
//   async initializeServers(userId: string): Promise<void> {
//     // Get user's connected integrations from database
//     const integrations = await prisma.integration.findMany({
//       where: { userId, isActive: true },
//     })

//     for (const integration of integrations) {
//       await this.connectServer(integration)
//     }
//   }

//   private async connectServer(integration: any): Promise<void> {
//     try {
//       const serverConfig = this.getServerConfig(integration.type, integration.config)
      
//       const transport = new StdioClientTransport({
//         command: serverConfig.command,
//         args: serverConfig.args,
//         env: serverConfig.env,
//       })

//       const client = new Client(
//         {
//           name: `instagram-automation-${integration.userId}`,
//           version: "1.0.0",
//         },
//         {
//           capabilities: {
//             tools: {},
//             resources: {},
//           },
//         }
//       )

//       await client.connect(transport)

//       // Get available tools from this server
//       const { tools } = await client.listTools()

//       // Store server and tools
//       this.servers.set(integration.id, { client, transport })
      
//       tools.forEach((tool) => {
//         this.availableTools.set(`${integration.id}:${tool.name}`, {
//           ...tool,
//           serverId: integration.id,
//         })
//       })

//       console.log(`[MCP] Connected to ${integration.type} - ${tools.length} tools available`)
//     } catch (error) {
//       console.error(`[MCP] Failed to connect ${integration.type}:`, error)
//     }
//   }

//   private getServerConfig(type: string, config: any): MCPServer {
//     // These are the GAME CHANGERS - each server gives AI new superpowers
//     const configs: Record<string, MCPServer> = {
//       stripe: {
//         id: "stripe",
//         name: "Stripe Payment Processing",
//         command: "npx",
//         args: ["-y", "@stripe/mcp-server"],
//         env: {
//           STRIPE_SECRET_KEY: config.secretKey,
//         },
//         tools: [], // Auto-discovered
//       },
      
//       shopify: {
//         id: "shopify",
//         name: "Shopify Store",
//         command: "npx",
//         args: ["-y", "@shopify/mcp-server"],
//         env: {
//           SHOPIFY_STORE_URL: config.storeUrl,
//           SHOPIFY_ACCESS_TOKEN: config.accessToken,
//         },
//         tools: [],
//       },

//       google_calendar: {
//         id: "google_calendar",
//         name: "Google Calendar",
//         command: "npx",
//         args: ["-y", "@google/calendar-mcp"],
//         env: {
//           GOOGLE_CALENDAR_CREDENTIALS: JSON.stringify(config.credentials),
//         },
//         tools: [],
//       },

//       hubspot: {
//         id: "hubspot",
//         name: "HubSpot CRM",
//         command: "npx",
//         args: ["-y", "@hubspot/mcp-server"],
//         env: {
//           HUBSPOT_API_KEY: config.apiKey,
//         },
//         tools: [],
//       },

//       postgres: {
//         id: "postgres",
//         name: "Database Access",
//         command: "npx",
//         args: ["-y", "@modelcontextprotocol/server-postgres"],
//         env: {
//           POSTGRES_CONNECTION_STRING: config.connectionString,
//         },
//         tools: [],
//       },

//       slack: {
//         id: "slack",
//         name: "Slack Notifications",
//         command: "npx",
//         args: ["-y", "@slack/mcp-server"],
//         env: {
//           SLACK_BOT_TOKEN: config.botToken,
//         },
//         tools: [],
//       },
//     }

//     return configs[type] || configs.postgres
//   }

//   // Call an MCP tool
//   async callTool(serverId: string, toolName: string, args: any): Promise<any> {
//     const serverConnection = this.servers.get(serverId)
//     if (!serverConnection) {
//       throw new Error(`Server ${serverId} not connected`)
//     }

//     const { client } = serverConnection

//     console.log(`[MCP] Calling tool: ${toolName}`, args)

//     const result = await client.callTool({
//       name: toolName,
//       arguments: args,
//     })

//     return result
//   }

//   // Get all available tools for Claude
//   getToolsForClaude(userId: string): any[] {
//     const tools: any[] = []

//     for (const [key, tool] of this.availableTools.entries()) {
//       tools.push({
//         name: tool.name,
//         description: tool.description,
//         input_schema: tool.inputSchema,
//       })
//     }

//     return tools
//   }

//   async disconnect(serverId: string): Promise<void> {
//     const serverConnection = this.servers.get(serverId)
//     if (serverConnection) {
//       await serverConnection.transport.close()
//       this.servers.delete(serverId)
//     }
//   }

//   async disconnectAll(): Promise<void> {
//     for (const [serverId] of this.servers) {
//       await this.disconnect(serverId)
//     }
//   }
// }

// // Singleton instance
// export const mcpManager = new MCPServerManager()


// // ============================================
// // Enhanced AI Response Handler with MCP + Commerce
// // ============================================

// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "./db"

// export class EnhancedAIHandler {
//   private anthropic: Anthropic
//   private mcpManager: MCPServerManager

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.mcpManager = mcpManager
//   }

//   async generateCommerceResponse(
//     config: any,
//     context: any,
//     userId: string
//   ): Promise<{
//     response: string
//     actions: any[]
//     metadata: any
//   }> {
//     // Initialize MCP servers for this user
//     await this.mcpManager.initializeServers(userId)

//     // Get all available tools (MCP + built-in)
//     const mcpTools = this.mcpManager.getToolsForClaude(userId)
//     const builtInTools = this.getBuiltInTools()
//     const allTools = [...mcpTools, ...builtInTools]

//     console.log(`[AI] Available tools: ${allTools.length}`)

//     // Build enhanced system prompt
//     const systemPrompt = this.buildCommercePrompt(config, context, allTools)

//     // Prepare conversation
//     const messages = this.prepareMessages(config, context)

//     // Multi-turn conversation with tool use
//     let conversationMessages = [...messages]
//     const executedActions: any[] = []
//     let finalResponse = ""
//     let turnCount = 0
//     const maxTurns = 10 // Prevent infinite loops

//     while (turnCount < maxTurns) {
//       turnCount++

//       const response = await this.anthropic.messages.create({
//         model: config.model || "claude-sonnet-4-20250514",
//         max_tokens: config.maxTokens || 2000,
//         temperature: config.temperature || 0.7,
//         system: systemPrompt,
//         messages: conversationMessages,
//         tools: allTools,
//       })

//       // Check if response is final or needs tool use
//       const textContent = response.content.find((block) => block.type === "text")
//       if (textContent?.type === "text") {
//         finalResponse = textContent.text
//       }

//       const toolUses = response.content.filter((block) => block.type === "tool_use")

//       if (toolUses.length === 0) {
//         // No more tools to use, we're done
//         break
//       }

//       // Execute all tool uses
//       const toolResults: any[] = []

//       for (const toolUse of toolUses) {
//         if (toolUse.type !== "tool_use") continue

//         console.log(`[AI] Executing tool: ${toolUse.name}`, toolUse.input)

//         try {
//           const result = await this.executeTool(
//             toolUse.name,
//             toolUse.input,
//             context,
//             userId
//           )

//           toolResults.push({
//             type: "tool_result",
//             tool_use_id: toolUse.id,
//             content: JSON.stringify(result),
//           })

//           executedActions.push({
//             tool: toolUse.name,
//             input: toolUse.input,
//             result,
//           })
//         } catch (error: any) {
//           console.error(`[AI] Tool execution failed:`, error)
//           toolResults.push({
//             type: "tool_result",
//             tool_use_id: toolUse.id,
//             content: JSON.stringify({ error: error.message }),
//             is_error: true,
//           })
//         }
//       }

//       // Add assistant's response and tool results to conversation
//       conversationMessages.push(
//         { role: "assistant", content: response.content },
//         { role: "user", content: toolResults }
//       )
//     }

//     return {
//       response: finalResponse,
//       actions: executedActions,
//       metadata: {
//         turns: turnCount,
//         toolsUsed: executedActions.map((a) => a.tool),
//       },
//     }
//   }

//   private buildCommercePrompt(config: any, context: any, tools: any[]): string {
//     return `You are an advanced AI sales and customer service assistant with access to powerful tools.

// Your capabilities:
// ${tools.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

// Customer Context:
// - Name: ${context.participantName}
// - Username: @${context.participantUsername}
// - Previous orders: ${context.orderHistory?.length || 0}
// - Tags: ${context.userTags?.join(", ") || "None"}

// Your role:
// 1. Help customers browse and purchase products
// 2. Process payments securely
// 3. Book appointments when requested
// 4. Update CRM records automatically
// 5. Answer questions using the knowledge base
// 6. Create support tickets for complex issues
// 7. Send order confirmations and tracking info

// Guidelines:
// - Be conversational and helpful
// - Always confirm before processing payments
// - Use tools proactively to help customers
// - Provide product recommendations based on history
// - Keep responses concise (2-4 sentences)
// ${config.tone ? `- Tone: ${config.tone}` : ""}
// ${config.customInstructions || ""}

// When showing products, use the carousel format for multiple items.
// When processing payments, always get explicit confirmation first.
// When booking appointments, check availability before confirming.`
//   }

//   private getBuiltInTools(): any[] {
//     return [
//       {
//         name: "send_product_carousel",
//         description: "Display multiple products as an interactive carousel in the chat",
//         input_schema: {
//           type: "object",
//           properties: {
//             products: {
//               type: "array",
//               description: "Array of products to display",
//               items: {
//                 type: "object",
//                 properties: {
//                   id: { type: "string" },
//                   name: { type: "string" },
//                   price: { type: "number" },
//                   image_url: { type: "string" },
//                   description: { type: "string" },
//                 },
//               },
//             },
//           },
//           required: ["products"],
//         },
//       },
//       {
//         name: "create_payment_link",
//         description: "Generate a secure payment link for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             amount: { type: "number", description: "Amount in cents" },
//             currency: { type: "string", description: "Currency code (USD, EUR, etc.)" },
//             description: { type: "string", description: "Payment description" },
//             items: {
//               type: "array",
//               description: "Line items",
//               items: {
//                 type: "object",
//                 properties: {
//                   name: { type: "string" },
//                   amount: { type: "number" },
//                   quantity: { type: "number" },
//                 },
//               },
//             },
//           },
//           required: ["amount", "currency", "description"],
//         },
//       },
//       {
//         name: "check_product_availability",
//         description: "Check if a product is in stock",
//         input_schema: {
//           type: "object",
//           properties: {
//             product_id: { type: "string" },
//           },
//           required: ["product_id"],
//         },
//       },
//       {
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Filter by category" },
//             max_results: { type: "number", description: "Max number of results" },
//           },
//           required: ["query"],
//         },
//       },
//       {
//         name: "get_order_status",
//         description: "Look up a customer's order status",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string" },
//           },
//           required: ["order_id"],
//         },
//       },
//       {
//         name: "book_appointment",
//         description: "Schedule an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             service: { type: "string", description: "Type of service" },
//             date: { type: "string", description: "Date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Time (HH:MM)" },
//             duration_minutes: { type: "number", description: "Duration in minutes" },
//           },
//           required: ["service", "date", "time"],
//         },
//       },
//       {
//         name: "update_customer_profile",
//         description: "Update customer information in CRM",
//         input_schema: {
//           type: "object",
//           properties: {
//             email: { type: "string" },
//             phone: { type: "string" },
//             preferences: { type: "object" },
//             tags: { type: "array", items: { type: "string" } },
//           },
//         },
//       },
//       {
//         name: "create_support_ticket",
//         description: "Create a support ticket for complex issues",
//         input_schema: {
//           type: "object",
//           properties: {
//             subject: { type: "string" },
//             description: { type: "string" },
//             priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
//           },
//           required: ["subject", "description"],
//         },
//       },
//     ]
//   }

//   private async executeTool(
//     toolName: string,
//     input: any,
//     context: any,
//     userId: string
//   ): Promise<any> {
//     // Check if it's an MCP tool
//     const mcpTool = Array.from(this.mcpManager["availableTools"].values()).find(
//       (t) => t.name === toolName
//     )

//     if (mcpTool) {
//       // Execute via MCP
//       return await this.mcpManager.callTool(mcpTool.serverId, toolName, input)
//     }

//     // Execute built-in tools
//     switch (toolName) {
//       case "send_product_carousel":
//         return await this.sendProductCarousel(input, context)

//       case "create_payment_link":
//         return await this.createPaymentLink(input, context, userId)

//       case "check_product_availability":
//         return await this.checkProductAvailability(input, userId)

//       case "search_products":
//         return await this.searchProducts(input, userId)

//       case "get_order_status":
//         return await this.getOrderStatus(input, context, userId)

//       case "book_appointment":
//         return await this.bookAppointment(input, context, userId)

//       case "update_customer_profile":
//         return await this.updateCustomerProfile(input, context, userId)

//       case "create_support_ticket":
//         return await this.createSupportTicket(input, context, userId)

//       default:
//         throw new Error(`Unknown tool: ${toolName}`)
//     }
//   }

//   // Implement each tool
//   private async sendProductCarousel(input: any, context: any): Promise<any> {
//     const { products } = input

//     // Format as Instagram carousel
//     const carouselElements = products.slice(0, 10).map((product: any) => ({
//       title: product.name,
//       subtitle: `$${(product.price / 100).toFixed(2)} - ${product.description}`,
//       image_url: product.image_url,
//       buttons: [
//         {
//           type: "web_url",
//           title: "Buy Now",
//           url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${product.id}`,
//         },
//         {
//           type: "postback",
//           title: "More Info",
//           payload: `PRODUCT_INFO_${product.id}`,
//         },
//       ],
//     }))

//     // Queue carousel to be sent
//     await prisma.queuedMessage.create({
//       data: {
//         conversationId: context.conversationId,
//         type: "carousel",
//         content: JSON.stringify({ elements: carouselElements }),
//         scheduledFor: new Date(),
//       },
//     })

//     return { success: true, products_shown: products.length }
//   }

//   private async createPaymentLink(input: any, context: any, userId: string): Promise<any> {
//     // Integrate with Stripe
//     const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

//     const paymentLink = await stripe.paymentLinks.create({
//       line_items: input.items.map((item: any) => ({
//         price_data: {
//           currency: input.currency,
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: item.amount,
//         },
//         quantity: item.quantity,
//       })),
//       after_completion: {
//         type: "redirect",
//         redirect: {
//           url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation`,
//         },
//       },
//       metadata: {
//         user_id: userId,
//         conversation_id: context.conversationId,
//         instagram_username: context.participantUsername,
//       },
//     })

//     // Log the payment attempt
//     await prisma.paymentAttempt.create({
//       data: {
//         userId,
//         conversationId: context.conversationId,
//         amount: input.amount,
//         currency: input.currency,
//         stripePaymentLinkId: paymentLink.id,
//         status: "pending",
//       },
//     })

//     return {
//       success: true,
//       payment_url: paymentLink.url,
//       expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//     }
//   }

//   private async checkProductAvailability(input: any, userId: string): Promise<any> {
//     const product = await prisma.product.findUnique({
//       where: { id: input.product_id, userId },
//       select: {
//         id: true,
//         name: true,
//         stock: true,
//         isAvailable: true,
//       },
//     })

//     if (!product) {
//       return { available: false, reason: "Product not found" }
//     }

//     return {
//       available: product.isAvailable && product.stock > 0,
//       stock: product.stock,
//       product_name: product.name,
//     }
//   }

//   private async searchProducts(input: any, userId: string): Promise<any> {
//     const products = await prisma.product.findMany({
//       where: {
//         userId,
//         isAvailable: true,
//         OR: [
//           { name: { contains: input.query, mode: "insensitive" } },
//           { description: { contains: input.query, mode: "insensitive" } },
//         ],
//         ...(input.category && { category: input.category }),
//       },
//       take: input.max_results || 5,
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         price: true,
//         imageUrl: true,
//         category: true,
//       },
//     })

//     return { products, count: products.length }
//   }

//   private async getOrderStatus(input: any, context: any, userId: string): Promise<any> {
//     const order = await prisma.order.findFirst({
//       where: {
//         id: input.order_id,
//         userId,
//       },
//       include: {
//         items: true,
//       },
//     })

//     if (!order) {
//       return { found: false, message: "Order not found" }
//     }

//     return {
//       found: true,
//       order_id: order.id,
//       status: order.status,
//       total: order.total,
//       items: order.items,
//       tracking_number: order.trackingNumber,
//       estimated_delivery: order.estimatedDelivery,
//     }
//   }

//   private async bookAppointment(input: any, context: any, userId: string): Promise<any> {
//     // Check availability first
//     const isAvailable = await this.checkAppointmentAvailability(
//       input.date,
//       input.time,
//       input.duration_minutes || 60,
//       userId
//     )

//     if (!isAvailable) {
//       return {
//         success: false,
//         reason: "Time slot not available",
//         alternative_slots: await this.getAlternativeSlots(input.date, userId),
//       }
//     }

//     // Create appointment
//     const appointment = await prisma.appointment.create({
//       data: {
//         userId,
//         conversationId: context.conversationId,
//         customerName: context.participantName,
//         customerUsername: context.participantUsername,
//         service: input.service,
//         date: new Date(`${input.date}T${input.time}`),
//         durationMinutes: input.duration_minutes || 60,
//         status: "confirmed",
//       },
//     })

//     return {
//       success: true,
//       appointment_id: appointment.id,
//       service: input.service,
//       date: input.date,
//       time: input.time,
//       confirmation_message: `Your ${input.service} appointment is confirmed for ${input.date} at ${input.time}`,
//     }
//   }

//   private async checkAppointmentAvailability(
//     date: string,
//     time: string,
//     duration: number,
//     userId: string
//   ): Promise<boolean> {
//     const startTime = new Date(`${date}T${time}`)
//     const endTime = new Date(startTime.getTime() + duration * 60000)

//     const conflicts = await prisma.appointment.count({
//       where: {
//         userId,
//         status: { in: ["confirmed", "pending"] },
//         date: {
//           gte: startTime,
//           lt: endTime,
//         },
//       },
//     })

//     return conflicts === 0
//   }

//   private async getAlternativeSlots(date: string, userId: string): Promise<string[]> {
//     // Simple implementation - return next 3 available slots
//     return ["10:00", "14:00", "16:00"]
//   }

//   private async updateCustomerProfile(input: any, context: any, userId: string): Promise<any> {
//     await prisma.conversation.update({
//       where: { id: context.conversationId },
//       data: {
//         customerEmail: input.email,
//         customerPhone: input.phone,
//         customerPreferences: input.preferences,
//       },
//     })

//     if (input.tags) {
//       // Add tags
//       for (const tagName of input.tags) {
//         let tag = await prisma.tag.findFirst({
//           where: { userId, name: tagName },
//         })

//         if (!tag) {
//           tag = await prisma.tag.create({
//             data: { userId, name: tagName, color: "#3B82F6" },
//           })
//         }

//         await prisma.conversationTag.upsert({
//           where: {
//             conversationId_tagId: {
//               conversationId: context.conversationId,
//               tagId: tag.id,
//             },
//           },
//           create: {
//             conversationId: context.conversationId,
//             tagId: tag.id,
//           },
//           update: {},
//         })
//       }
//     }

//     return { success: true, message: "Customer profile updated" }
//   }

//   private async createSupportTicket(input: any, context: any, userId: string): Promise<any> {
//     const ticket = await prisma.supportTicket.create({
//       data: {
//         userId,
//         conversationId: context.conversationId,
//         customerName: context.participantName,
//         subject: input.subject,
//         description: input.description,
//         priority: input.priority || "medium",
//         status: "open",
//       },
//     })

//     return {
//       success: true,
//       ticket_id: ticket.id,
//       message: `Support ticket #${ticket.id} created. Our team will respond within 24 hours.`,
//     }
//   }

//   private prepareMessages(config: any, context: any): any[] {
//     if (!context.conversationHistory) return []

//     return context.conversationHistory.slice(-20).map((msg: any) => ({
//       role: msg.sender === "participant" ? "user" : "assistant",
//       content: msg.content,
//     }))
//   }
// }

// export const enhancedAIHandler = new EnhancedAIHandler()

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { prisma } from "./db"
import Anthropic from "@anthropic-ai/sdk"

interface MCPServer {
  id: string
  name: string
  command: string
  args: string[]
  env?: Record<string, string>
  tools: MCPTool[]
}

interface MCPTool {
  name: string
  description: string
  inputSchema: any
}

export class MCPServerManager {
  private servers: Map<string, { client: Client; transport: StdioClientTransport }> = new Map()
  private availableTools: Map<string, MCPTool & { serverId: string }> = new Map()

  // Initialize MCP servers for a user
  async initializeServers(userId: string): Promise<void> {
    // Get user's connected integrations from database
    const integrations = await prisma.integration.findMany({
      where: { userId, isActive: true },
    })

    for (const integration of integrations) {
      await this.connectServer(integration)
    }
  }

  private async connectServer(integration: any): Promise<void> {
    try {
      const serverConfig = this.getServerConfig(integration.type, integration.config)
      
      const transport = new StdioClientTransport({
        command: serverConfig.command,
        args: serverConfig.args,
        env: serverConfig.env,
      })

      const client = new Client(
        {
          name: `instagram-automation-${integration.userId}`,
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      )

      await client.connect(transport)

      // Get available tools from this server
      const { tools } = await client.listTools()

      // Store server and tools
      this.servers.set(integration.id, { client, transport })
      
      tools.forEach((tool: any) => {
        this.availableTools.set(`${integration.id}:${tool.name}`, {
          name: tool.name,
          description: tool.description || "",
          inputSchema: tool.inputSchema,
          serverId: integration.id,
        })
      })

      console.log(`[MCP] Connected to ${integration.type} - ${tools.length} tools available`)
    } catch (error) {
      console.error(`[MCP] Failed to connect ${integration.type}:`, error)
    }
  }

  private getServerConfig(type: string, config: any): MCPServer {
    // These are the GAME CHANGERS - each server gives AI new superpowers
    const configs: Record<string, MCPServer> = {
      stripe: {
        id: "stripe",
        name: "Stripe Payment Processing",
        command: "npx",
        args: ["-y", "@stripe/mcp-server"],
        env: {
          STRIPE_SECRET_KEY: config.secretKey,
        },
        tools: [], // Auto-discovered
      },
      
      shopify: {
        id: "shopify",
        name: "Shopify Store",
        command: "npx",
        args: ["-y", "@shopify/mcp-server"],
        env: {
          SHOPIFY_STORE_URL: config.storeUrl,
          SHOPIFY_ACCESS_TOKEN: config.accessToken,
        },
        tools: [],
      },

      google_calendar: {
        id: "google_calendar",
        name: "Google Calendar",
        command: "npx",
        args: ["-y", "@google/calendar-mcp"],
        env: {
          GOOGLE_CALENDAR_CREDENTIALS: JSON.stringify(config.credentials),
        },
        tools: [],
      },

      hubspot: {
        id: "hubspot",
        name: "HubSpot CRM",
        command: "npx",
        args: ["-y", "@hubspot/mcp-server"],
        env: {
          HUBSPOT_API_KEY: config.apiKey,
        },
        tools: [],
      },

      postgres: {
        id: "postgres",
        name: "Database Access",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-postgres"],
        env: {
          POSTGRES_CONNECTION_STRING: config.connectionString,
        },
        tools: [],
      },

      slack: {
        id: "slack",
        name: "Slack Notifications",
        command: "npx",
        args: ["-y", "@slack/mcp-server"],
        env: {
          SLACK_BOT_TOKEN: config.botToken,
        },
        tools: [],
      },
    }

    return configs[type] || configs.postgres
  }

  // Call an MCP tool
  async callTool(serverId: string, toolName: string, args: any): Promise<any> {
    const serverConnection = this.servers.get(serverId)
    if (!serverConnection) {
      throw new Error(`Server ${serverId} not connected`)
    }

    const { client } = serverConnection

    console.log(`[MCP] Calling tool: ${toolName}`, args)

    const result = await client.callTool({
      name: toolName,
      arguments: args,
    })

    return result
  }

  // Get all available tools for Claude
  getToolsForClaude(userId: string): any[] {
    const tools: any[] = []

    for (const [key, tool] of this.availableTools.entries()) {
      tools.push({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      })
    }

    return tools
  }

  async disconnect(serverId: string): Promise<void> {
    const serverConnection = this.servers.get(serverId)
    if (serverConnection) {
      await serverConnection.transport.close()
      this.servers.delete(serverId)
    }
  }

  async disconnectAll(): Promise<void> {
    for (const [serverId] of this.servers) {
      await this.disconnect(serverId)
    }
  }
}

// Singleton instance
export const mcpManager = new MCPServerManager()


// ============================================
// Enhanced AI Response Handler with MCP + Commerce
// ============================================

export class EnhancedAIHandler {
  private anthropic: Anthropic
  private mcpManager: MCPServerManager

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
    this.mcpManager = mcpManager
  }

  async generateCommerceResponse(
    config: any,
    context: any,
    userId: string
  ): Promise<{
    response: string
    actions: any[]
    metadata: any
  }> {
    // Initialize MCP servers for this user
    await this.mcpManager.initializeServers(userId)

    // Get all available tools (MCP + built-in)
    const mcpTools = this.mcpManager.getToolsForClaude(userId)
    const builtInTools = this.getBuiltInTools()
    const allTools = [...mcpTools, ...builtInTools]

    console.log(`[AI] Available tools: ${allTools.length}`)

    // Build enhanced system prompt
    const systemPrompt = this.buildCommercePrompt(config, context, allTools)

    // Prepare conversation
    const messages = this.prepareMessages(config, context)

    // Multi-turn conversation with tool use
    let conversationMessages = [...messages]
    const executedActions: any[] = []
    let finalResponse = ""
    let turnCount = 0
    const maxTurns = 10 // Prevent infinite loops

    while (turnCount < maxTurns) {
      turnCount++

      const response = await this.anthropic.messages.create({
        model: config.model || "claude-sonnet-4-20250514",
        max_tokens: config.maxTokens || 2000,
        temperature: config.temperature || 0.7,
        system: systemPrompt,
        messages: conversationMessages,
        tools: allTools,
      })

      // Check if response is final or needs tool use
      const textContent = response.content.find((block) => block.type === "text")
      if (textContent?.type === "text") {
        finalResponse = textContent.text
      }

      const toolUses = response.content.filter((block) => block.type === "tool_use")

      if (toolUses.length === 0) {
        // No more tools to use, we're done
        break
      }

      // Execute all tool uses
      const toolResults: any[] = []

      for (const toolUse of toolUses) {
        if (toolUse.type !== "tool_use") continue

        console.log(`[AI] Executing tool: ${toolUse.name}`, toolUse.input)

        try {
          const result = await this.executeTool(
            toolUse.name,
            toolUse.input,
            context,
            userId
          )

          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          })

          executedActions.push({
            tool: toolUse.name,
            input: toolUse.input,
            result,
          })
        } catch (error: any) {
          console.error(`[AI] Tool execution failed:`, error)
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: error.message }),
            is_error: true,
          })
        }
      }

      // Add assistant's response and tool results to conversation
      conversationMessages.push(
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults }
      )
    }

    return {
      response: finalResponse,
      actions: executedActions,
      metadata: {
        turns: turnCount,
        toolsUsed: executedActions.map((a) => a.tool),
      },
    }
  }

  private buildCommercePrompt(config: any, context: any, tools: any[]): string {
    return `You are an advanced AI sales and customer service assistant with access to powerful tools.

Your capabilities:
${tools.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

Customer Context:
- Name: ${context.participantName}
- Username: @${context.participantUsername}
- Previous orders: ${context.orderHistory?.length || 0}
- Tags: ${context.userTags?.join(", ") || "None"}

Your role:
1. Help customers browse and purchase products
2. Process payments securely
3. Book appointments when requested
4. Update CRM records automatically
5. Answer questions using the knowledge base
6. Create support tickets for complex issues
7. Send order confirmations and tracking info

Guidelines:
- Be conversational and helpful
- Always confirm before processing payments
- Use tools proactively to help customers
- Provide product recommendations based on history
- Keep responses concise (2-4 sentences)
${config.tone ? `- Tone: ${config.tone}` : ""}
${config.customInstructions || ""}

When showing products, use the carousel format for multiple items.
When processing payments, always get explicit confirmation first.
When booking appointments, check availability before confirming.`
  }

  private getBuiltInTools(): any[] {
    return [
      {
        name: "send_product_carousel",
        description: "Display multiple products as an interactive carousel in the chat",
        input_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              description: "Array of products to display",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  price: { type: "number" },
                  image_url: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
          required: ["products"],
        },
      },
      {
        name: "create_payment_link",
        description: "Generate a secure payment link for the customer",
        input_schema: {
          type: "object",
          properties: {
            amount: { type: "number", description: "Amount in cents" },
            currency: { type: "string", description: "Currency code (USD, EUR, etc.)" },
            description: { type: "string", description: "Payment description" },
            items: {
              type: "array",
              description: "Line items",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "number" },
                  quantity: { type: "number" },
                },
              },
            },
          },
          required: ["amount", "currency", "description"],
        },
      },
      {
        name: "check_product_availability",
        description: "Check if a product is in stock",
        input_schema: {
          type: "object",
          properties: {
            product_id: { type: "string" },
          },
          required: ["product_id"],
        },
      },
      {
        name: "search_products",
        description: "Search for products in the catalog",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            category: { type: "string", description: "Filter by category" },
            max_results: { type: "number", description: "Max number of results" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_order_status",
        description: "Look up a customer's order status",
        input_schema: {
          type: "object",
          properties: {
            order_id: { type: "string" },
          },
          required: ["order_id"],
        },
      },
      {
        name: "book_appointment",
        description: "Schedule an appointment for the customer",
        input_schema: {
          type: "object",
          properties: {
            service: { type: "string", description: "Type of service" },
            date: { type: "string", description: "Date (YYYY-MM-DD)" },
            time: { type: "string", description: "Time (HH:MM)" },
            duration_minutes: { type: "number", description: "Duration in minutes" },
          },
          required: ["service", "date", "time"],
        },
      },
      {
        name: "update_customer_profile",
        description: "Update customer information in CRM",
        input_schema: {
          type: "object",
          properties: {
            email: { type: "string" },
            phone: { type: "string" },
            preferences: { type: "object" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      },
      {
        name: "create_support_ticket",
        description: "Create a support ticket for complex issues",
        input_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          },
          required: ["subject", "description"],
        },
      },
    ]
  }

  private async executeTool(
    toolName: string,
    input: any,
    context: any,
    userId: string
  ): Promise<any> {
    // Check if it's an MCP tool
    const mcpTool = Array.from(this.mcpManager["availableTools"].values()).find(
      (t) => t.name === toolName
    )

    if (mcpTool) {
      // Execute via MCP
      return await this.mcpManager.callTool(mcpTool.serverId, toolName, input)
    }

    // Execute built-in tools
    switch (toolName) {
      case "send_product_carousel":
        return await this.sendProductCarousel(input, context)

      case "create_payment_link":
        return await this.createPaymentLink(input, context, userId)

      case "check_product_availability":
        return await this.checkProductAvailability(input, userId)

      case "search_products":
        return await this.searchProducts(input, userId)

      case "get_order_status":
        return await this.getOrderStatus(input, context, userId)

      case "book_appointment":
        return await this.bookAppointment(input, context, userId)

      case "update_customer_profile":
        return await this.updateCustomerProfile(input, context, userId)

      case "create_support_ticket":
        return await this.createSupportTicket(input, context, userId)

      default:
        throw new Error(`Unknown tool: ${toolName}`)
    }
  }

  // Implement each tool
  private async sendProductCarousel(input: any, context: any): Promise<any> {
    const { products } = input

    // Format as Instagram carousel
    const carouselElements = products.slice(0, 10).map((product: any) => ({
      title: product.name,
      subtitle: `$${(product.price / 100).toFixed(2)} - ${product.description}`,
      image_url: product.image_url,
      buttons: [
        {
          type: "web_url",
          title: "Buy Now",
          url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${product.id}`,
        },
        {
          type: "postback",
          title: "More Info",
          payload: `PRODUCT_INFO_${product.id}`,
        },
      ],
    }))

    // Queue carousel to be sent
    await prisma.queuedMessage.create({
      data: {
        conversationId: context.conversationId,
        type: "carousel",
        content: JSON.stringify({ elements: carouselElements }),
        scheduledFor: new Date(),
      },
    })

    return { success: true, products_shown: products.length }
  }

  private async createPaymentLink(input: any, context: any, userId: string): Promise<any> {
    // Integrate with Stripe
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const paymentLink = await stripe.paymentLinks.create({
      line_items: input.items.map((item: any) => ({
        price_data: {
          currency: input.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation`,
        },
      },
      metadata: {
        user_id: userId,
        conversation_id: context.conversationId,
        instagram_username: context.participantUsername,
      },
    })

    // Log the payment attempt
    await prisma.paymentAttempt.create({
      data: {
        userId,
        conversationId: context.conversationId,
        amount: input.amount,
        currency: input.currency,
        stripePaymentLinkId: paymentLink.id,
        status: "pending",
      },
    })

    return {
      success: true,
      payment_url: paymentLink.url,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }
  }

  private async checkProductAvailability(input: any, userId: string): Promise<any> {
    const product = await prisma.product.findUnique({
      where: { id: input.product_id, userId },
      select: {
        id: true,
        name: true,
        stock: true,
        isAvailable: true,
      },
    })

    if (!product) {
      return { available: false, reason: "Product not found" }
    }

    return {
      available: product.isAvailable && product.stock > 0,
      stock: product.stock,
      product_name: product.name,
    }
  }

  private async searchProducts(input: any, userId: string): Promise<any> {
    const products = await prisma.product.findMany({
      where: {
        userId,
        isAvailable: true,
        OR: [
          { name: { contains: input.query, mode: "insensitive" } },
          { description: { contains: input.query, mode: "insensitive" } },
        ],
        ...(input.category && { category: input.category }),
      },
      take: input.max_results || 5,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
      },
    })

    return { products, count: products.length }
  }

  private async getOrderStatus(input: any, context: any, userId: string): Promise<any> {
    const order = await prisma.order.findFirst({
      where: {
        id: input.order_id,
        userId,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      return { found: false, message: "Order not found" }
    }

    return {
      found: true,
      order_id: order.id,
      status: order.status,
      total: order.total,
      items: order.items,
      tracking_number: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery,
    }
  }

  private async bookAppointment(input: any, context: any, userId: string): Promise<any> {
    // Check availability first
    const isAvailable = await this.checkAppointmentAvailability(
      input.date,
      input.time,
      input.duration_minutes || 60,
      userId
    )

    if (!isAvailable) {
      return {
        success: false,
        reason: "Time slot not available",
        alternative_slots: await this.getAlternativeSlots(input.date, userId),
      }
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        conversationId: context.conversationId,
        customerName: context.participantName,
        customerUsername: context.participantUsername,
        service: input.service,
        date: new Date(`${input.date}T${input.time}`),
        durationMinutes: input.duration_minutes || 60,
        status: "confirmed",
      },
    })

    return {
      success: true,
      appointment_id: appointment.id,
      service: input.service,
      date: input.date,
      time: input.time,
      confirmation_message: `Your ${input.service} appointment is confirmed for ${input.date} at ${input.time}`,
    }
  }

  private async checkAppointmentAvailability(
    date: string,
    time: string,
    duration: number,
    userId: string
  ): Promise<boolean> {
    const startTime = new Date(`${date}T${time}`)
    const endTime = new Date(startTime.getTime() + duration * 60000)

    const conflicts = await prisma.appointment.count({
      where: {
        userId,
        status: { in: ["confirmed", "pending"] },
        date: {
          gte: startTime,
          lt: endTime,
        },
      },
    })

    return conflicts === 0
  }

  private async getAlternativeSlots(date: string, userId: string): Promise<string[]> {
    // Simple implementation - return next 3 available slots
    return ["10:00", "14:00", "16:00"]
  }

  private async updateCustomerProfile(input: any, context: any, userId: string): Promise<any> {
    await prisma.conversation.update({
      where: { id: context.conversationId },
      data: {
        customerEmail: input.email,
        customerPhone: input.phone,
        customerPreferences: input.preferences,
      },
    })

    if (input.tags) {
      // Add tags
      for (const tagName of input.tags) {
        let tag = await prisma.tag.findFirst({
          where: { userId, name: tagName },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { userId, name: tagName, color: "#3B82F6" },
          })
        }

        await prisma.conversationTag.upsert({
          where: {
            conversationId_tagId: {
              conversationId: context.conversationId,
              tagId: tag.id,
            },
          },
          create: {
            conversationId: context.conversationId,
            tagId: tag.id,
          },
          update: {},
        })
      }
    }

    return { success: true, message: "Customer profile updated" }
  }

  private async createSupportTicket(input: any, context: any, userId: string): Promise<any> {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        conversationId: context.conversationId,
        customerName: context.participantName,
        subject: input.subject,
        description: input.description,
        priority: input.priority || "medium",
        status: "open",
      },
    })

    return {
      success: true,
      ticket_id: ticket.id,
      message: `Support ticket #${ticket.id} created. Our team will respond within 24 hours.`,
    }
  }

  private prepareMessages(config: any, context: any): any[] {
    if (!context.conversationHistory) return []

    return context.conversationHistory.slice(-20).map((msg: any) => ({
      role: msg.sender === "participant" ? "user" : "assistant",
      content: msg.content,
    }))
  }
}

export const enhancedAIHandler = new EnhancedAIHandler()