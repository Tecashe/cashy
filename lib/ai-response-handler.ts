// // lib/ai-response-handler.ts

// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number
  
//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>
  
//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string
  
//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number
  
//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean
  
//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean
  
//   // Functions
//   enabledFunctions?: string[]
// }

// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//   }> {
//     try {
//       // 1. Build system prompt
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Check knowledge base if enabled
//       let knowledgeContext = ""
//       if (config.useKnowledgeBase) {
//         knowledgeContext = await this.searchKnowledgeBase(
//           context.messageText,
//           config.knowledgeBaseDocs || []
//         )
//       }

//       // 5. Make API call to Claude
//       const response = await this.anthropic.messages.create({
//         model: config.model || "claude-sonnet-4-20250514",
//         max_tokens: config.maxTokens || 500,
//         temperature: config.temperature || 0.7,
//         system: systemPrompt,
//         messages: [
//           // Add knowledge context if available
//           ...(knowledgeContext
//             ? [
//                 {
//                   role: "user" as const,
//                   content: `Relevant information from knowledge base:\n${knowledgeContext}`,
//                 },
//                 {
//                   role: "assistant" as const,
//                   content: "I'll use this information to help answer the customer's question.",
//                 },
//               ]
//             : []),
//           // Add conversation history
//           ...messages,
//           // Add current message
//           {
//             role: "user" as const,
//             content: context.messageText,
//           },
//         ],
//         tools: tools.length > 0 ? tools : undefined,
//       })

//       // 6. Extract response
//       const textContent = response.content.find((block) => block.type === "text")
//       const responseText = textContent?.type === "text" ? textContent.text : ""

//       // 7. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(
//         responseText,
//         context.messageText,
//         config
//       )

//       // 8. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(
//         context.messageText,
//         config.sensitiveTopics || []
//       )

//       // 9. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       throw error
//     }
//   }

//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // Base role
//     parts.push(
//       config.systemPrompt ||
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner."
//     )

//     // Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(toneInstructions)

//     // Response length
//     if (config.responseLength === "concise") {
//       parts.push("Keep responses brief (1-2 sentences).")
//     } else if (config.responseLength === "detailed") {
//       parts.push("Provide detailed, comprehensive responses.")
//     } else {
//       parts.push("Keep responses clear and concise (2-4 sentences).")
//     }

//     // Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\nSpecial instructions:\n${config.customInstructions}`)
//     }

//     // Personalization
//     if (config.personalizeResponses) {
//       parts.push(
//         `\nCustomer info: Name is ${context.participantName}, username is @${context.participantUsername}.`
//       )
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`Customer tags: ${context.userTags.join(", ")}`)
//       }
//     }

//     // Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\nHere are examples of how to respond:")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`\nExample ${i + 1}:`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}`)
//       })
//     }

//     // Emojis
//     if (config.useEmojis === false) {
//       parts.push("\nDo not use emojis in your responses.")
//     } else {
//       parts.push("\nYou can use emojis occasionally to add warmth to your responses.")
//     }

//     // Questions
//     if (config.includeQuestions) {
//       parts.push(
//         "\nWhen appropriate, ask follow-up questions to better understand the customer's needs."
//       )
//     }

//     // Handoff instructions
//     if (config.autoHandoff) {
//       parts.push(
//         "\nIf the customer seems frustrated, angry, or requests a human, indicate that you'll connect them with a team member."
//       )
//     }

//     // Language
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\nRespond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\nRespond in the same language the customer is using.")
//     }

//     return parts.join("\n")
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional:
//         "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly:
//         "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic:
//         "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic:
//         "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous:
//         "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   private async searchKnowledgeBase(query: string, docIds: string[]): Promise<string> {
//     // TODO: Implement semantic search over knowledge base documents
//     // This would involve:
//     // 1. Generate embeddings for the query
//     // 2. Search vector database for relevant chunks
//     // 3. Return top N most relevant passages

//     // For now, return empty string
//     // You can integrate with services like:
//     // - Pinecone
//     // - Weaviate
//     // - pgvector (Postgres)
//     // - Simple keyword search as fallback

//     try {
//       // Placeholder implementation
//       const relevantDocs = await prisma.knowledgeDocument.findMany({
//         where: {
//           id: { in: docIds },
//         },
//         take: 3,
//       })

//       return relevantDocs.map((doc) => doc.content).join("\n\n")
//     } catch (error) {
//       console.error("[AI] Knowledge base search error:", error)
//       return ""
//     }
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     try {
//       // Use Claude to analyze the conversation
//       const analysis = await this.anthropic.messages.create({
//         model: "claude-haiku-4-20250514", // Use faster model for analysis
//         max_tokens: 200,
//         messages: [
//           {
//             role: "user",
//             content: `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`,
//           },
//         ],
//       })

//       const textBlock = analysis.content.find((block) => block.type === "text")
//       const analysisText = textBlock?.type === "text" ? textBlock.text : "{}"

//       // Parse JSON from response
//       const parsed = JSON.parse(analysisText.replace(/```json|```/g, ""))

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) =>
//             parsed.sentiment.includes(trigger) || userMessage.toLowerCase().includes(trigger)
//         ) ||
//         parsed.confidence < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis error:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(
//     conversationId: string,
//     userMessage: string,
//     aiResponse: string,
//     metadata: any
//   ) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()

// lib/ai-response-handler.ts

// lib/ai-response-handler.ts

// lib/ai-response-handler.ts

// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
// }

// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//   }> {
//     try {
//       // 1. Build system prompt
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Check knowledge base if enabled
//       let knowledgeContext = ""
//       if (config.useKnowledgeBase) {
//         knowledgeContext = await this.searchKnowledgeBase(context.messageText, config.knowledgeBaseDocs || [])
//       }

//       // 5. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 500,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...(knowledgeContext
//                 ? [
//                     {
//                       role: "user" as const,
//                       content: `Relevant information from knowledge base:\n${knowledgeContext}`,
//                     },
//                     {
//                       role: "assistant" as const,
//                       content: "I'll use this information to help answer the customer's question.",
//                     },
//                   ]
//                 : []),
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] Response generated using ${usedProvider}`)

//       // 6. Extract response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 7. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 8. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 9. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)

//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//       }
//     }
//   }

//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // Base role
//     parts.push(
//       config.systemPrompt ||
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner.",
//     )

//     // Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(toneInstructions)

//     // Response length
//     if (config.responseLength === "concise") {
//       parts.push("Keep responses brief (1-2 sentences).")
//     } else if (config.responseLength === "detailed") {
//       parts.push("Provide detailed, comprehensive responses.")
//     } else {
//       parts.push("Keep responses clear and concise (2-4 sentences).")
//     }

//     // Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\nSpecial instructions:\n${config.customInstructions}`)
//     }

//     // Personalization
//     if (config.personalizeResponses) {
//       parts.push(`\nCustomer info: Name is ${context.participantName}, username is @${context.participantUsername}.`)
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`Customer tags: ${context.userTags.join(", ")}`)
//       }
//     }

//     // Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\nHere are examples of how to respond:")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`\nExample ${i + 1}:`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}`)
//       })
//     }

//     // Emojis
//     if (config.useEmojis === false) {
//       parts.push("\nDo not use emojis in your responses.")
//     } else {
//       parts.push("\nYou can use emojis occasionally to add warmth to your responses.")
//     }

//     // Questions
//     if (config.includeQuestions) {
//       parts.push("\nWhen appropriate, ask follow-up questions to better understand the customer's needs.")
//     }

//     // Handoff instructions
//     if (config.autoHandoff) {
//       parts.push(
//         "\nIf the customer seems frustrated, angry, or requests a human, indicate that you'll connect them with a team member.",
//       )
//     }

//     // Language
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\nRespond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\nRespond in the same language the customer is using.")
//     }

//     return parts.join("\n")
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   private async searchKnowledgeBase(query: string, docIds: string[]): Promise<string> {
//     // TODO: Implement semantic search over knowledge base documents
//     // This would involve:
//     // 1. Generate embeddings for the query
//     // 2. Search vector database for relevant chunks
//     // 3. Return top N most relevant passages

//     // For now, return empty string
//     // You can integrate with services like:
//     // - Pinecone
//     // - Weaviate
//     // - pgvector (Postgres)
//     // - Simple keyword search as fallback

//     try {
//       // Placeholder implementation
//       const relevantDocs = await prisma.knowledgeDocument.findMany({
//         where: {
//           id: { in: docIds },
//         },
//         take: 3,
//       })

//       return relevantDocs.map((doc) => doc.content).join("\n\n")
//     } catch (error) {
//       console.error("[AI] Knowledge base search error:", error)
//       return ""
//     }
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     try {
//       // Use Claude to analyze the conversation
//       const analysis = await this.anthropic.messages.create({
//         model: "claude-haiku-4-20250514", // Use faster model for analysis
//         max_tokens: 200,
//         messages: [
//           {
//             role: "user",
//             content: `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`,
//           },
//         ],
//       })

//       const textBlock = analysis.content.find((block) => block.type === "text")
//       const analysisText = textBlock?.type === "text" ? textBlock.text : "{}"

//       // Parse JSON from response
//       const parsed = JSON.parse(analysisText.replace(/```json|```/g, ""))

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment.includes(trigger) || userMessage.toLowerCase().includes(trigger),
//         ) ||
//         parsed.confidence < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis error:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 500,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()


// lib/ai-response-handler.ts

// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
// }

// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//   }> {
//     try {
//       // 1. Build system prompt
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Check knowledge base if enabled
//       let knowledgeContext = ""
//       if (config.useKnowledgeBase) {
//         knowledgeContext = await this.searchKnowledgeBase(context.messageText, config.knowledgeBaseDocs || [])
//       }

//       // 5. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 500,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...(knowledgeContext
//                 ? [
//                     {
//                       role: "user" as const,
//                       content: `Relevant information from knowledge base:\n${knowledgeContext}`,
//                     },
//                     {
//                       role: "assistant" as const,
//                       content: "I'll use this information to help answer the customer's question.",
//                     },
//                   ]
//                 : []),
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] Response generated using ${usedProvider}`)

//       // 6. Extract response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 7. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 8. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 9. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//       }
//     }
//   }

//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // Base role
//     parts.push(
//       config.systemPrompt ||
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner.",
//     )

//     // Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(toneInstructions)

//     // Response length
//     if (config.responseLength === "concise") {
//       parts.push("Keep responses brief (1-2 sentences).")
//     } else if (config.responseLength === "detailed") {
//       parts.push("Provide detailed, comprehensive responses.")
//     } else {
//       parts.push("Keep responses clear and concise (2-4 sentences).")
//     }

//     // Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\nSpecial instructions:\n${config.customInstructions}`)
//     }

//     // Personalization
//     if (config.personalizeResponses) {
//       parts.push(`\nCustomer info: Name is ${context.participantName}, username is @${context.participantUsername}.`)
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`Customer tags: ${context.userTags.join(", ")}`)
//       }
//     }

//     // Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\nHere are examples of how to respond:")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`\nExample ${i + 1}:`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}`)
//       })
//     }

//     // Emojis
//     if (config.useEmojis === false) {
//       parts.push("\nDo not use emojis in your responses.")
//     } else {
//       parts.push("\nYou can use emojis occasionally to add warmth to your responses.")
//     }

//     // Questions
//     if (config.includeQuestions) {
//       parts.push("\nWhen appropriate, ask follow-up questions to better understand the customer's needs.")
//     }

//     // Handoff instructions
//     if (config.autoHandoff) {
//       parts.push(
//         "\nIf the customer seems frustrated, angry, or requests a human, indicate that you'll connect them with a team member.",
//       )
//     }

//     // Language
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\nRespond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\nRespond in the same language the customer is using.")
//     }

//     return parts.join("\n")
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   private async searchKnowledgeBase(query: string, docIds: string[]): Promise<string> {
//     // TODO: Implement semantic search over knowledge base documents
//     // This would involve:
//     // 1. Generate embeddings for the query
//     // 2. Search vector database for relevant chunks
//     // 3. Return top N most relevant passages

//     // For now, return empty string
//     // You can integrate with services like:
//     // - Pinecone
//     // - Weaviate
//     // - pgvector (Postgres)
//     // - Simple keyword search as fallback

//     try {
//       // Placeholder implementation
//       const relevantDocs = await prisma.knowledgeDocument.findMany({
//         where: {
//           id: { in: docIds },
//         },
//         take: 3,
//       })

//       return relevantDocs.map((doc) => doc.content).join("\n\n")
//     } catch (error) {
//       console.error("[AI] Knowledge base search error:", error)
//       return ""
//     }
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`

//     try {
//       let analysisText = ""

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const analysis = await this.anthropic.messages.create(
//           {
//             model: "claude-haiku-4-20250514", // Use faster model for analysis
//             max_tokens: 200,
//             messages: [
//               {
//                 role: "user",
//                 content: analysisPrompt,
//               },
//             ],
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)

//         const textBlock = analysis.content.find((block) => block.type === "text")
//         analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic analysis error:", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             console.log("[AI] Falling back to DeepSeek for analysis...")
//             const dsResult = await this.callDeepSeek(
//               "You are an AI analysis assistant. Return JSON only.",
//               [],
//               analysisPrompt,
//               { maxTokens: 200, temperature: 0.1 },
//             )
//             analysisText = dsResult.content[0].text
//           } catch (dsError: any) {
//             console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
//             throw new Error("Both analysis providers failed")
//           }
//         } else {
//           throw new Error("Anthropic analysis failed and no DeepSeek key provided")
//         }
//       }

//       // Parse JSON from response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
//       const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
//       const parsed = JSON.parse(cleanJson)

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
//         ) ||
//         (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis total failure:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 500,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()





// lib/ai-response-handler.ts

// lib/ai-response-handler.ts






























// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"
// import { UnifiedCommerceConnector } from "./commerce-connectors"
// import { searchKnowledgeBase } from "./vector-search"
// import { createProductCarouselCards } from "./instagram-carousel"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
//   enableProductCatalog?: boolean
// }

// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
//   userId?: string
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//     carousel?: {
//       title: string
//       items: Array<{
//         id: string
//         title: string
//         subtitle?: string
//         image_url?: string
//         price?: string
//         action_url?: string
//       }>
//       rawCards?: any[]
//     }
//   }> {
//     try {
//       // 1. Build system prompt
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Check knowledge base if enabled
//       let knowledgeContext = ""
//       if (config.useKnowledgeBase && context.userId) {
//         knowledgeContext = await this.searchKnowledgeBase(context.messageText, context.userId)
//       }

//       // 5. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 500,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...(knowledgeContext
//                 ? [
//                     {
//                       role: "user" as const,
//                       content: `Relevant information from knowledge base:\n${knowledgeContext}`,
//                     },
//                     {
//                       role: "assistant" as const,
//                       content: "I'll use this information to help answer the customer's question.",
//                     },
//                   ]
//                 : []),
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] Response generated using ${usedProvider}`)

//       // 6. Extract response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 7. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 8. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 9. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       // 10. Detect product mentions and generate carousel data
//       let carouselData = undefined
//       if (config.enableProductCatalog) {
//         carouselData = await this.detectAndBuildCarousel(responseText, context)
//       }

//       const formattedCarousel = carouselData
//         ? {
//             title: carouselData.title,
//             items: carouselData.items.map((item: any) => ({
//               id: item.id,
//               title: item.title,
//               subtitle: item.subtitle,
//               image_url: item.image_url,
//               price: item.price,
//               action_url: item.action_url,
//             })),
//           }
//         : undefined

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//         carousel: formattedCarousel,
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//         carousel: undefined,
//       }
//     }
//   }

//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // Base role
//     parts.push(
//       config.systemPrompt ||
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner.",
//     )

//     // Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(toneInstructions)

//     // Response length
//     if (config.responseLength === "concise") {
//       parts.push("Keep responses brief (1-2 sentences).")
//     } else if (config.responseLength === "detailed") {
//       parts.push("Provide detailed, comprehensive responses.")
//     } else {
//       parts.push("Keep responses clear and concise (2-4 sentences).")
//     }

//     // Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\nSpecial instructions:\n${config.customInstructions}`)
//     }

//     // Personalization
//     if (config.personalizeResponses) {
//       parts.push(`\nCustomer info: Name is ${context.participantName}, username is @${context.participantUsername}.`)
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`Customer tags: ${context.userTags.join(", ")}`)
//       }
//     }

//     // Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\nHere are examples of how to respond:")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`\nExample ${i + 1}:`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}`)
//       })
//     }

//     // Emojis
//     if (config.useEmojis === false) {
//       parts.push("\nDo not use emojis in your responses.")
//     } else {
//       parts.push("\nYou can use emojis occasionally to add warmth to your responses.")
//     }

//     // Questions
//     if (config.includeQuestions) {
//       parts.push("\nWhen appropriate, ask follow-up questions to better understand the customer's needs.")
//     }

//     // Handoff instructions
//     if (config.autoHandoff) {
//       parts.push(
//         "\nIf the customer seems frustrated, angry, or requests a human, indicate that you'll connect them with a team member.",
//       )
//     }

//     // Language
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\nRespond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\nRespond in the same language the customer is using.")
//     }

//     // Product catalog instructions
//     if (config.enableProductCatalog) {
//       parts.push("\nIf you are presenting products, include a carousel with up to 10 products.")
//     }

//     return parts.join("\n")
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   private async searchKnowledgeBase(query: string, userId: string): Promise<string> {
//     try {
//       const relevantDocs = await searchKnowledgeBase(query, userId, 3)

//       if (relevantDocs.length === 0) return ""

//       return relevantDocs.map((doc) => `[Source: ${doc.title} (${doc.type})]\n${doc.content}`).join("\n\n---\n\n")
//     } catch (error) {
//       console.error("[AI] Knowledge base search error:", error)
//       return ""
//     }
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`

//     try {
//       let analysisText = ""

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const analysis = await this.anthropic.messages.create(
//           {
//             model: "claude-haiku-4-20250514", // Use faster model for analysis
//             max_tokens: 200,
//             messages: [
//               {
//                 role: "user",
//                 content: analysisPrompt,
//               },
//             ],
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)

//         const textBlock = analysis.content.find((block) => block.type === "text")
//         analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic analysis error:", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             console.log("[AI] Falling back to DeepSeek for analysis...")
//             const dsResult = await this.callDeepSeek(
//               "You are an AI analysis assistant. Return JSON only.",
//               [],
//               analysisPrompt,
//               { maxTokens: 200, temperature: 0.1 },
//             )
//             analysisText = dsResult.content[0].text
//           } catch (dsError: any) {
//             console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
//             throw new Error("Both analysis providers failed")
//           }
//         } else {
//           throw new Error("Anthropic analysis failed and no DeepSeek key provided")
//         }
//       }

//       // Parse JSON from response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
//       const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
//       const parsed = JSON.parse(cleanJson)

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
//         ) ||
//         (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis total failure:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 500,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//       carousel: undefined,
//     }
//   }

//   private async detectAndBuildCarousel(responseText: string, context: ConversationContext): Promise<any> {
//     const connector = new UnifiedCommerceConnector(context.userId!)

//     // We search based on the AI's response text to see what it's talking about,
//     // or the user's original query if the response is too generic
//     const searchQuery = responseText.length > 20 ? responseText : context.messageText
//     const products = await connector.searchProducts(searchQuery, 5)

//     if (products.length === 0) return undefined

//     const cards = createProductCarouselCards(products)

//     // We don't send it here directly, we return the data for the executor to send
//     // This allows the executor to handle the actual Instagram API call
//     return {
//       title: "Product Recommendations",
//       items: cards.map((card) => ({
//         id: card.title, // Use title as ID for mapping
//         title: card.title,
//         subtitle: card.subtitle,
//         image_url: card.image_url, // Fixed from imageUrl to image_url
//         action_url: card.buttons[0]?.url, // Fixed from defaultAction?.url to buttons[0]?.url
//       })),
//       rawCards: cards, // Keep the raw cards for the Instagram API
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()

























// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"
// import { UnifiedCommerceConnector } from "./commerce-connectors"
// import { searchKnowledgeBase } from "./vector-search"
// import { createProductCarouselCards } from "./instagram-carousel"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
//   enableProductCatalog?: boolean
// }

// // 🔥 UPDATED: Extended ConversationContext with new fields
// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
//   userId?: string
  
//   // 🔥 NEW FIELDS
//   knowledgeBase?: any[]
//   products?: any[]
//   businessName?: string
//   businessDescription?: string
//   businessType?: string
//   businessIndustry?: string
//   orderHistory?: any[]
//   customerEmail?: string
//   customerPhone?: string
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//     carousel?: {
//       title: string
//       items: Array<{
//         id: string
//         title: string
//         subtitle?: string
//         image_url?: string
//         price?: string
//         action_url?: string
//       }>
//       rawCards?: any[]
//     }
//   }> {
//     try {
//       console.log("[AI] 🤖 Generating response with full context:", {
//         hasKnowledgeBase: !!(context.knowledgeBase && context.knowledgeBase.length > 0),
//         knowledgeDocsCount: context.knowledgeBase?.length || 0,
//         hasProducts: !!(context.products && context.products.length > 0),
//         productsCount: context.products?.length || 0,
//         hasBusiness: !!context.businessName,
//         historyLength: context.conversationHistory?.length || 0,
//       })

//       // 1. Build comprehensive system prompt with ALL data
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       console.log("[AI] 📝 System prompt built:", {
//         length: systemPrompt.length,
//         hasKnowledge: systemPrompt.includes("Knowledge Base"),
//         hasProducts: systemPrompt.includes("Product Catalog"),
//         hasBusiness: systemPrompt.includes("Business Information"),
//       })

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 2000,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] ✅ Response generated using ${usedProvider}`)

//       // 5. Extract response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 6. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 7. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 8. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       // 🔥 9. SMART CAROUSEL DETECTION (UPDATED)
//       let carouselData = undefined
//       if (config.enableProductCatalog && context.products && context.products.length > 0) {
//         carouselData = await this.detectAndBuildCarousel(formattedResponse, context)
        
//         if (carouselData) {
//           console.log("[AI] 🎠 Carousel built with", carouselData.rawCards?.length || 0, "products")
//         }
//       }

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//         carousel: carouselData,
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//         carousel: undefined,
//       }
//     }
//   }

//   // 🔥 COMPLETELY REWRITTEN: buildSystemPrompt with full knowledge base and products
//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // 1. Base role and custom system prompt
//     if (config.systemPrompt) {
//       parts.push(config.systemPrompt)
//     } else {
//       parts.push(
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner."
//       )
//     }

//     // 2. Business Context
//     if (context.businessName || context.businessDescription) {
//       parts.push("\n## Business Information")
//       if (context.businessName) {
//         parts.push(`**Business Name:** ${context.businessName}`)
//       }
//       if (context.businessDescription) {
//         parts.push(`**About Us:** ${context.businessDescription}`)
//       }
//       if (context.businessType) {
//         parts.push(`**Business Type:** ${context.businessType}`)
//       }
//       if (context.businessIndustry) {
//         parts.push(`**Industry:** ${context.businessIndustry}`)
//       }
//     }

//     // 🔥 3. KNOWLEDGE BASE DOCUMENTS (NEW - COMPREHENSIVE)
//     if (context.knowledgeBase && context.knowledgeBase.length > 0) {
//       parts.push("\n## Knowledge Base")
//       parts.push("Use the following information to answer customer questions accurately. This is your source of truth.\n")
      
//       // Group by type for better organization
//       const groupedDocs = this.groupKnowledgeByType(context.knowledgeBase)
      
//       for (const [type, docs] of Object.entries(groupedDocs)) {
//         const typeLabel = type.replace(/_/g, " ").toUpperCase()
//         parts.push(`\n### ${typeLabel}`)
        
//         for (const doc of docs as any[]) {
//           parts.push(`\n#### ${doc.title}`)
//           parts.push(doc.content)
          
//           if (doc.tags && doc.tags.length > 0) {
//             parts.push(`_Tags: ${doc.tags.join(", ")}_`)
//           }
//           parts.push("") // Empty line for spacing
//         }
//       }
      
//       console.log(`[AI] 📚 Included ${context.knowledgeBase.length} knowledge documents in system prompt`)
//     }

//     // 🔥 4. PRODUCT CATALOG (NEW - COMPREHENSIVE)
//     if (context.products && context.products.length > 0 && config.enableProductCatalog) {
//       parts.push("\n## Product Catalog")
//       parts.push("You can search and recommend these products to customers. Always mention specific product names when discussing products.\n")
      
//       // Group by category if available
//       const categorized = this.groupProductsByCategory(context.products)
      
//       for (const [category, products] of Object.entries(categorized)) {
//         if (category !== "uncategorized") {
//           parts.push(`\n### ${category}`)
//         }
        
//         for (const product of products as any[]) {
//           const price = `$${(product.price / 100).toFixed(2)}`
//           parts.push(`\n**${product.name}** - ${price}`)
//           parts.push(product.description)
          
//           if (product.sku) {
//             parts.push(`SKU: ${product.sku}`)
//           }
          
//           if (product.stock !== undefined) {
//             const stockStatus = product.stock > 0 
//               ? `${product.stock} available` 
//               : "Out of stock"
//             parts.push(`Stock: ${stockStatus}`)
//           }
          
//           if (product.images && product.images.length > 0) {
//             parts.push(`Product ID: ${product.id}`)
//           }
          
//           parts.push("") // Empty line for spacing
//         }
//       }
      
//       parts.push("\n**IMPORTANT**: When you mention specific products by name, I will automatically create a visual product carousel for the customer showing images and details.")
      
//       console.log(`[AI] 🛍️ Included ${context.products.length} products in system prompt`)
//     }

//     // 5. Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(`\n## Tone & Style\n${toneInstructions}`)

//     // 6. Response length
//     parts.push("\n## Response Guidelines")
//     if (config.responseLength === "concise") {
//       parts.push("- Keep responses brief (1-2 sentences)")
//     } else if (config.responseLength === "detailed") {
//       parts.push("- Provide detailed, comprehensive responses")
//     } else {
//       parts.push("- Keep responses clear and concise (2-4 sentences)")
//     }

//     // 7. Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\n## Special Instructions\n${config.customInstructions}`)
//     }

//     // 8. Customer Context & Personalization
//     if (config.personalizeResponses) {
//       parts.push("\n## Customer Information")
//       parts.push(`- Name: ${context.participantName}`)
//       parts.push(`- Username: @${context.participantUsername}`)
      
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`- Tags: ${context.userTags.join(", ")}`)
//       }
      
//       if (context.orderHistory && context.orderHistory.length > 0) {
//         parts.push(`- Past orders: ${context.orderHistory.length} orders`)
//         parts.push("- This is a returning customer")
//       }
      
//       if (context.customerEmail) {
//         parts.push(`- Email: ${context.customerEmail}`)
//       }
//     }

//     // 9. Commerce capabilities
//     if (config.enableProductCatalog) {
//       parts.push("\n## Commerce Capabilities")
//       parts.push("You can help customers by:")
//       parts.push("- Searching and recommending products from the catalog")
//       parts.push("- Answering questions about product availability, pricing, and features")
//       parts.push("- Suggesting products based on customer needs")
      
//       if (config.enabledFunctions?.includes("check_order")) {
//         parts.push("- Checking order status")
//       }
//     }

//     // 10. Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\n## Example Conversations")
//       parts.push("Here are examples of how to respond:\n")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`**Example ${i + 1}:**`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}\n`)
//       })
//     }

//     // 11. Behavioral guidelines
//     parts.push("\n## Behavior Guidelines")
    
//     if (config.useEmojis === false) {
//       parts.push("- Do not use emojis")
//     } else {
//       parts.push("- Use emojis occasionally to add warmth (1-2 per message)")
//     }
    
//     if (config.includeQuestions) {
//       parts.push("- Ask follow-up questions when appropriate to better understand needs")
//     }
    
//     if (config.autoHandoff) {
//       parts.push("- If the customer is frustrated, angry, or explicitly requests human help, indicate you'll connect them with a team member")
//     }
    
//     parts.push("- Always be helpful, accurate, and professional")
//     parts.push("- Use the knowledge base and product catalog to provide specific, factual information")
//     parts.push("- **CRITICAL**: Never make up information - only use what's provided in your knowledge base and product catalog")
//     parts.push("- If you don't know something, admit it and offer to connect them with someone who can help")

//     // 12. Language preference
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\n## Language\nAlways respond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\n## Language\nRespond in the same language the customer is using.")
//     }

//     const finalPrompt = parts.join("\n")
    
//     console.log("[AI] 📋 System prompt stats:", {
//       totalLength: finalPrompt.length,
//       sections: parts.length,
//       hasKnowledge: finalPrompt.includes("Knowledge Base"),
//       hasProducts: finalPrompt.includes("Product Catalog"),
//       hasBusiness: finalPrompt.includes("Business Information"),
//     })

//     return finalPrompt
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   // 🔥 NEW HELPER: Group knowledge docs by type
//   private groupKnowledgeByType(docs: any[]): Record<string, any[]> {
//     return docs.reduce((acc, doc) => {
//       const type = doc.type || "general"
//       if (!acc[type]) acc[type] = []
//       acc[type].push(doc)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   // 🔥 NEW HELPER: Group products by category
//   private groupProductsByCategory(products: any[]): Record<string, any[]> {
//     return products.reduce((acc, product) => {
//       const category = product.category || "uncategorized"
//       if (!acc[category]) acc[category] = []
//       acc[category].push(product)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`

//     try {
//       let analysisText = ""

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const analysis = await this.anthropic.messages.create(
//           {
//             model: "claude-haiku-4-20250514",
//             max_tokens: 200,
//             messages: [
//               {
//                 role: "user",
//                 content: analysisPrompt,
//               },
//             ],
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)

//         const textBlock = analysis.content.find((block) => block.type === "text")
//         analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic analysis error:", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             console.log("[AI] Falling back to DeepSeek for analysis...")
//             const dsResult = await this.callDeepSeek(
//               "You are an AI analysis assistant. Return JSON only.",
//               [],
//               analysisPrompt,
//               { maxTokens: 200, temperature: 0.1 },
//             )
//             analysisText = dsResult.content[0].text
//           } catch (dsError: any) {
//             console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
//             throw new Error("Both analysis providers failed")
//           }
//         } else {
//           throw new Error("Anthropic analysis failed and no DeepSeek key provided")
//         }
//       }

//       // Parse JSON from response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
//       const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
//       const parsed = JSON.parse(cleanJson)

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
//         ) ||
//         (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis total failure:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // 🔥 UPDATED: Smart carousel detection based on products passed in context
//   private async detectAndBuildCarousel(responseText: string, context: ConversationContext): Promise<any> {
//     if (!context.products || context.products.length === 0) {
//       console.log("[AI] 🎠 No products available for carousel")
//       return undefined
//     }

//     console.log("[AI] 🎠 Analyzing response for product recommendations...")

//     // Extract product names mentioned in the AI's response
//     const mentionedProducts: any[] = []
    
//     for (const product of context.products) {
//       // Check if product name is mentioned in the response (case-insensitive, partial match)
//       const productNameLower = product.name.toLowerCase()
//       const responseTextLower = responseText.toLowerCase()
      
//       if (responseTextLower.includes(productNameLower)) {
//         mentionedProducts.push(product)
//         console.log(`[AI] 🎯 Found mentioned product: ${product.name}`)
//       }
//     }

//     console.log(`[AI] 🎠 Found ${mentionedProducts.length} products mentioned in response`)

//     // If specific products were mentioned, show those
//     let productsToShow = mentionedProducts.length > 0 ? mentionedProducts : []
    
//     // If no specific products mentioned but AI talked about products, do smart search
//     if (productsToShow.length === 0) {
//       const productKeywords = [
//         "recommend", "suggest", "check out", "take a look", 
//         "here are", "we have", "available", "product", "item",
//         "offer", "sell", "stock", "browse", "shop"
//       ]
      
//       const hasProductIntent = productKeywords.some(keyword => 
//         responseText.toLowerCase().includes(keyword)
//       )
      
//       if (hasProductIntent && context.userId) {
//         console.log("[AI] 🎠 Response has product intent, performing smart search...")
        
//         try {
//           const connector = new UnifiedCommerceConnector(context.userId)
//           // Search based on the customer's original query
//           const searchQuery = context.messageText || responseText
//           productsToShow = await connector.searchProducts(searchQuery, 5)
          
//           console.log(`[AI] 🎠 Smart search returned ${productsToShow.length} products`)
//         } catch (error) {
//           console.error("[AI] 🎠 Smart search failed:", error)
//           // Fallback: show top 5 products from context
//           productsToShow = context.products.slice(0, 5)
//         }
//       }
//     }

//     if (productsToShow.length === 0) {
//       console.log("[AI] 🎠 No products to show in carousel")
//       return undefined
//     }

//     // Limit to 10 products max (Instagram carousel limit)
//     productsToShow = productsToShow.slice(0, 10)

//     console.log(`[AI] 🎠 Building carousel with ${productsToShow.length} products`)

//     const cards = createProductCarouselCards(productsToShow)
//     return {
//       title: "Product Recommendations",
//       items: cards.map((card) => ({
//         id: card.title,
//         title: card.title,
//         subtitle: card.subtitle,
//         image_url: card.image_url,
//         price: card.subtitle, // The price is typically in subtitle
//         action_url: card.buttons?.[0]?.url,
//       })),
//       rawCards: cards, // Keep the raw cards for the Instagram API
//     }
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 2000,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//       carousel: undefined,
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()





// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"
// import { UnifiedCommerceConnector } from "./commerce-connectors"
// import { searchKnowledgeBase } from "./vector-search"
// import { createProductCarouselCards } from "./instagram-carousel"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
//   enableProductCatalog?: boolean
// }

// // 🔥 UPDATED: Extended ConversationContext with new fields
// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
//   userId?: string
  
//   // 🔥 NEW FIELDS
//   knowledgeBase?: any[]
//   products?: any[]
//   businessName?: string
//   businessDescription?: string
//   businessType?: string
//   businessIndustry?: string
//   orderHistory?: any[]
//   customerEmail?: string
//   customerPhone?: string
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//     carousel?: {
//       title: string
//       items: Array<{
//         id: string
//         title: string
//         subtitle?: string
//         image_url?: string
//         price?: string
//         action_url?: string
//       }>
//       rawCards?: any[]
//     }
//   }> {
//     try {
//       console.log("[AI] 🤖 Generating response with full context:", {
//         hasKnowledgeBase: !!(context.knowledgeBase && context.knowledgeBase.length > 0),
//         knowledgeDocsCount: context.knowledgeBase?.length || 0,
//         hasProducts: !!(context.products && context.products.length > 0),
//         productsCount: context.products?.length || 0,
//         hasBusiness: !!context.businessName,
//         historyLength: context.conversationHistory?.length || 0,
//       })

//       // 1. Build comprehensive system prompt with ALL data
//       const systemPrompt = this.buildSystemPrompt(config, context)

//       console.log("[AI] 📝 System prompt built:", {
//         length: systemPrompt.length,
//         hasKnowledge: systemPrompt.includes("Knowledge Base"),
//         hasProducts: systemPrompt.includes("Product Catalog"),
//         hasBusiness: systemPrompt.includes("Business Information"),
//       })

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools/functions if enabled
//       const tools = this.prepareTools(config)

//       // 4. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 2000,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] ✅ Response generated using ${usedProvider}`)

//       // 5. Extract response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 6. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 7. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 8. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       // 🔥 9. SMART CAROUSEL DETECTION (UPDATED)
//       let carouselData = undefined
//       if (config.enableProductCatalog && context.products && context.products.length > 0) {
//         carouselData = await this.detectAndBuildCarousel(formattedResponse, context)
        
//         if (carouselData) {
//           console.log("[AI] 🎠 Carousel built with", carouselData.rawCards?.length || 0, "products")
//         }
//       }

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//         carousel: carouselData,
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//         carousel: undefined,
//       }
//     }
//   }








//   // 🔥 COMPLETELY REWRITTEN: buildSystemPrompt with full knowledge base and products
//   private buildSystemPrompt(config: AIResponseConfig, context: ConversationContext): string {
//     const parts: string[] = []

//     // 1. Base role and custom system prompt
//     if (config.systemPrompt) {
//       parts.push(config.systemPrompt)
//     } else {
//       parts.push(
//         "You are a helpful customer service AI assistant. Your role is to assist customers with their questions and concerns in a friendly, professional manner."
//       )
//     }

//     // 2. Business Context
//     if (context.businessName || context.businessDescription) {
//       parts.push("\n## Business Information")
//       if (context.businessName) {
//         parts.push(`**Business Name:** ${context.businessName}`)
//       }
//       if (context.businessDescription) {
//         parts.push(`**About Us:** ${context.businessDescription}`)
//       }
//       if (context.businessType) {
//         parts.push(`**Business Type:** ${context.businessType}`)
//       }
//       if (context.businessIndustry) {
//         parts.push(`**Industry:** ${context.businessIndustry}`)
//       }
//     }

//     // 🔥 3. KNOWLEDGE BASE DOCUMENTS (NEW - COMPREHENSIVE)
//     if (context.knowledgeBase && context.knowledgeBase.length > 0) {
//       parts.push("\n## Knowledge Base")
//       parts.push("Use the following information to answer customer questions accurately. This is your source of truth.\n")
      
//       // Group by type for better organization
//       const groupedDocs = this.groupKnowledgeByType(context.knowledgeBase)
      
//       for (const [type, docs] of Object.entries(groupedDocs)) {
//         const typeLabel = type.replace(/_/g, " ").toUpperCase()
//         parts.push(`\n### ${typeLabel}`)
        
//         for (const doc of docs as any[]) {
//           parts.push(`\n#### ${doc.title}`)
//           parts.push(doc.content)
          
//           if (doc.tags && doc.tags.length > 0) {
//             parts.push(`_Tags: ${doc.tags.join(", ")}_`)
//           }
//           parts.push("") // Empty line for spacing
//         }
//       }
      
//       console.log(`[AI] 📚 Included ${context.knowledgeBase.length} knowledge documents in system prompt`)
//     }

//     // 🔥 4. PRODUCT CATALOG (NEW - COMPREHENSIVE)
//     if (context.products && context.products.length > 0 && config.enableProductCatalog) {
//       parts.push("\n## Product Catalog")
//       parts.push("You can search and recommend these products to customers. Always mention specific product names when discussing products.\n")
      
//       // Group by category if available
//       const categorized = this.groupProductsByCategory(context.products)
      
//       for (const [category, products] of Object.entries(categorized)) {
//         if (category !== "uncategorized") {
//           parts.push(`\n### ${category}`)
//         }
        
//         for (const product of products as any[]) {
//           const price = `$${(product.price / 100).toFixed(2)}`
//           parts.push(`\n**${product.name}** - ${price}`)
//           parts.push(product.description)
          
//           if (product.sku) {
//             parts.push(`SKU: ${product.sku}`)
//           }
          
//           if (product.stock !== undefined) {
//             const stockStatus = product.stock > 0 
//               ? `${product.stock} available` 
//               : "Out of stock"
//             parts.push(`Stock: ${stockStatus}`)
//           }
          
//           if (product.images && product.images.length > 0) {
//             parts.push(`Product ID: ${product.id}`)
//           }
          
//           parts.push("") // Empty line for spacing
//         }
//       }
      
//       parts.push("\n**IMPORTANT**: When you mention specific products by name, I will automatically create a visual product carousel for the customer showing images and details.")
      
//       console.log(`[AI] 🛍️ Included ${context.products.length} products in system prompt`)
//     }

//     // 5. Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(`\n## Tone & Style\n${toneInstructions}`)

//     // 6. Response length
//     parts.push("\n## Response Guidelines")
//     if (config.responseLength === "concise") {
//       parts.push("- Keep responses brief (1-2 sentences)")
//     } else if (config.responseLength === "detailed") {
//       parts.push("- Provide detailed, comprehensive responses")
//     } else {
//       parts.push("- Keep responses clear and concise (2-4 sentences)")
//     }

//     // 7. Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\n## Special Instructions\n${config.customInstructions}`)
//     }

//     // 8. Customer Context & Personalization
//     if (config.personalizeResponses) {
//       parts.push("\n## Customer Information")
//       parts.push(`- Name: ${context.participantName}`)
//       parts.push(`- Username: @${context.participantUsername}`)
      
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`- Tags: ${context.userTags.join(", ")}`)
//       }
      
//       if (context.orderHistory && context.orderHistory.length > 0) {
//         parts.push(`- Past orders: ${context.orderHistory.length} orders`)
//         parts.push("- This is a returning customer")
//       }
      
//       if (context.customerEmail) {
//         parts.push(`- Email: ${context.customerEmail}`)
//       }
//     }

//     // 9. Commerce capabilities
//     if (config.enableProductCatalog) {
//       parts.push("\n## Commerce Capabilities")
//       parts.push("You can help customers by:")
//       parts.push("- Searching and recommending products from the catalog")
//       parts.push("- Answering questions about product availability, pricing, and features")
//       parts.push("- Suggesting products based on customer needs")
      
//       if (config.enabledFunctions?.includes("check_order")) {
//         parts.push("- Checking order status")
//       }
//     }

//     // 10. Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\n## Example Conversations")
//       parts.push("Here are examples of how to respond:\n")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`**Example ${i + 1}:**`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}\n`)
//       })
//     }

//     // 11. Behavioral guidelines
//     parts.push("\n## Behavior Guidelines")
    
//     if (config.useEmojis === false) {
//       parts.push("- Do not use emojis")
//     } else {
//       parts.push("- Use emojis occasionally to add warmth (1-2 per message)")
//     }
    
//     if (config.includeQuestions) {
//       parts.push("- Ask follow-up questions when appropriate to better understand needs")
//     }
    
//     if (config.autoHandoff) {
//       parts.push("- If the customer is frustrated, angry, or explicitly requests human help, indicate you'll connect them with a team member")
//     }
    
//     parts.push("- Always be helpful, accurate, and professional")
//     parts.push("- Use the knowledge base and product catalog to provide specific, factual information")
//     parts.push("- **CRITICAL**: Never make up information - only use what's provided in your knowledge base and product catalog")
//     parts.push("- If you don't know something, admit it and offer to connect them with someone who can help")

//     // 12. Language preference
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\n## Language\nAlways respond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\n## Language\nRespond in the same language the customer is using.")
//     }

//     const finalPrompt = parts.join("\n")
    
//     console.log("[AI] 📋 System prompt stats:", {
//       totalLength: finalPrompt.length,
//       sections: parts.length,
//       hasKnowledge: finalPrompt.includes("Knowledge Base"),
//       hasProducts: finalPrompt.includes("Product Catalog"),
//       hasBusiness: finalPrompt.includes("Business Information"),
//     })

//     return finalPrompt
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   private prepareTools(config: AIResponseConfig): any[] {
//     if (!config.enabledFunctions || config.enabledFunctions.length === 0) {
//       return []
//     }

//     const tools: any[] = []

//     if (config.enabledFunctions.includes("book_appointment")) {
//       tools.push({
//         name: "book_appointment",
//         description: "Book an appointment for the customer",
//         input_schema: {
//           type: "object",
//           properties: {
//             date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//             time: { type: "string", description: "Preferred time (HH:MM)" },
//             service: { type: "string", description: "Type of service requested" },
//           },
//           required: ["date", "time"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("check_order")) {
//       tools.push({
//         name: "check_order_status",
//         description: "Check the status of a customer's order",
//         input_schema: {
//           type: "object",
//           properties: {
//             order_id: { type: "string", description: "Order ID or number" },
//           },
//           required: ["order_id"],
//         },
//       })
//     }

//     if (config.enabledFunctions.includes("product_search")) {
//       tools.push({
//         name: "search_products",
//         description: "Search for products in the catalog",
//         input_schema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Search query" },
//             category: { type: "string", description: "Product category (optional)" },
//           },
//           required: ["query"],
//         },
//       })
//     }

//     return tools
//   }

//   // 🔥 NEW HELPER: Group knowledge docs by type
//   private groupKnowledgeByType(docs: any[]): Record<string, any[]> {
//     return docs.reduce((acc, doc) => {
//       const type = doc.type || "general"
//       if (!acc[type]) acc[type] = []
//       acc[type].push(doc)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   // 🔥 NEW HELPER: Group products by category
//   private groupProductsByCategory(products: any[]): Record<string, any[]> {
//     return products.reduce((acc, product) => {
//       const category = product.category || "uncategorized"
//       if (!acc[category]) acc[category] = []
//       acc[category].push(product)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`

//     try {
//       let analysisText = ""

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const analysis = await this.anthropic.messages.create(
//           {
//             model: "claude-haiku-4-20250514",
//             max_tokens: 200,
//             messages: [
//               {
//                 role: "user",
//                 content: analysisPrompt,
//               },
//             ],
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)

//         const textBlock = analysis.content.find((block) => block.type === "text")
//         analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic analysis error:", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             console.log("[AI] Falling back to DeepSeek for analysis...")
//             const dsResult = await this.callDeepSeek(
//               "You are an AI analysis assistant. Return JSON only.",
//               [],
//               analysisPrompt,
//               { maxTokens: 200, temperature: 0.1 },
//             )
//             analysisText = dsResult.content[0].text
//           } catch (dsError: any) {
//             console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
//             throw new Error("Both analysis providers failed")
//           }
//         } else {
//           throw new Error("Anthropic analysis failed and no DeepSeek key provided")
//         }
//       }

//       // Parse JSON from response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
//       const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
//       const parsed = JSON.parse(cleanJson)

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
//         ) ||
//         (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis total failure:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // 🔥 UPDATED: Smart carousel detection based on products passed in context
//   private async detectAndBuildCarousel(responseText: string, context: ConversationContext): Promise<any> {
//     if (!context.products || context.products.length === 0) {
//       console.log("[AI] 🎠 No products available for carousel")
//       return undefined
//     }

//     console.log("[AI] 🎠 Analyzing response for product recommendations...")

//     // Extract product names mentioned in the AI's response
//     const mentionedProducts: any[] = []
    
//     for (const product of context.products) {
//       // Check if product name is mentioned in the response (case-insensitive, partial match)
//       const productNameLower = product.name.toLowerCase()
//       const responseTextLower = responseText.toLowerCase()
      
//       if (responseTextLower.includes(productNameLower)) {
//         mentionedProducts.push(product)
//         console.log(`[AI] 🎯 Found mentioned product: ${product.name}`)
//       }
//     }

//     console.log(`[AI] 🎠 Found ${mentionedProducts.length} products mentioned in response`)

//     // If specific products were mentioned, show those
//     let productsToShow = mentionedProducts.length > 0 ? mentionedProducts : []
    
//     // If no specific products mentioned but AI talked about products, do smart search
//     if (productsToShow.length === 0) {
//       const productKeywords = [
//         "recommend", "suggest", "check out", "take a look", 
//         "here are", "we have", "available", "product", "item",
//         "offer", "sell", "stock", "browse", "shop"
//       ]
      
//       const hasProductIntent = productKeywords.some(keyword => 
//         responseText.toLowerCase().includes(keyword)
//       )
      
//       if (hasProductIntent && context.userId) {
//         console.log("[AI] 🎠 Response has product intent, performing smart search...")
        
//         try {
//           const connector = new UnifiedCommerceConnector(context.userId)
//           // Search based on the customer's original query
//           const searchQuery = context.messageText || responseText
//           productsToShow = await connector.searchProducts(searchQuery, 5)
          
//           console.log(`[AI] 🎠 Smart search returned ${productsToShow.length} products`)
//         } catch (error) {
//           console.error("[AI] 🎠 Smart search failed:", error)
//           // Fallback: show top 5 products from context
//           productsToShow = context.products.slice(0, 5)
//         }
//       }
//     }

//     if (productsToShow.length === 0) {
//       console.log("[AI] 🎠 No products to show in carousel")
//       return undefined
//     }

//     // Limit to 10 products max (Instagram carousel limit)
//     productsToShow = productsToShow.slice(0, 10)

//     console.log(`[AI] 🎠 Building carousel with ${productsToShow.length} products`)

//     const cards = createProductCarouselCards(productsToShow)
//     return {
//       title: "Product Recommendations",
//       items: cards.map((card) => ({
//         id: card.title,
//         title: card.title,
//         subtitle: card.subtitle,
//         image_url: card.image_url,
//         price: card.subtitle, // The price is typically in subtitle
//         action_url: card.buttons?.[0]?.url,
//       })),
//       rawCards: cards, // Keep the raw cards for the Instagram API
//     }
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 2000,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//       carousel: undefined,
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()

// import Anthropic from "@anthropic-ai/sdk"
// import { prisma } from "@/lib/db"
// import fetch from "node-fetch"
// import { UnifiedCommerceConnector } from "./commerce-connectors"
// import { searchKnowledgeBase } from "./vector-search"
// import { createProductCarouselCards, type CarouselCard } from "./instagram-carousel"

// interface AIResponseConfig {
//   // Basic
//   model?: string
//   tone?: string
//   language?: string
//   maxTokens?: number
//   temperature?: number

//   // Personality
//   systemPrompt?: string
//   customInstructions?: string
//   exampleConversations?: Array<{ user: string; assistant: string }>

//   // Knowledge Base
//   useKnowledgeBase?: boolean
//   knowledgeBaseDocs?: string[]
//   searchMode?: string

//   // Behavior
//   autoHandoff?: boolean
//   handoffTriggers?: string[]
//   maxTurns?: number
//   confidenceThreshold?: number
//   useConversationHistory?: boolean
//   historyDepth?: number

//   // Safety
//   contentFiltering?: boolean
//   sensitiveTopics?: string[]
//   requireApproval?: boolean

//   // Style
//   useEmojis?: boolean
//   responseLength?: string
//   includeQuestions?: boolean
//   personalizeResponses?: boolean

//   // Functions
//   enabledFunctions?: string[]
//   enableProductCatalog?: boolean
// }

// interface ConversationContext {
//   conversationId: string
//   participantName: string
//   participantUsername: string
//   messageText: string
//   conversationHistory: Array<{ role: string; content: string }>
//   userTags?: string[]
//   previousInteractions?: any[]
//   userId?: string
  
//   // Extended fields
//   knowledgeBase?: any[]
//   products?: any[]
//   businessName?: string
//   businessDescription?: string
//   businessType?: string
//   businessIndustry?: string
//   orderHistory?: any[]
//   customerEmail?: string
//   customerPhone?: string
// }

// interface AnthropicTextBlock {
//   type: "text"
//   text: string
// }

// interface AnthropicToolUseBlock {
//   type: "tool_use"
//   name: string
//   input: any
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// export class AIResponseHandler {
//   private anthropic: Anthropic
//   private deepseekApiKey: string | undefined

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     })
//     this.deepseekApiKey = process.env.DEEPSEEK_API_KEY
//   }

//   async generateResponse(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Promise<{
//     response: string
//     shouldHandoff: boolean
//     confidence: number
//     sentiment?: string
//     usedFunctions?: string[]
//     carousel?: {
//       title: string
//       items: Array<{
//         id: string
//         title: string
//         subtitle?: string
//         image_url?: string
//         price?: string
//         action_url?: string
//       }>
//       rawCards?: CarouselCard[]
//     }
//   }> {
//     try {
//       console.log("[AI] 🤖 Generating response with full context:", {
//         hasKnowledgeBase: !!(context.knowledgeBase && context.knowledgeBase.length > 0),
//         knowledgeDocsCount: context.knowledgeBase?.length || 0,
//         hasProducts: !!(context.products && context.products.length > 0),
//         productsCount: context.products?.length || 0,
//         hasBusiness: !!context.businessName,
//         historyLength: context.conversationHistory?.length || 0,
//       })

//       // 1. Build comprehensive system prompt with carousel capability
//       const systemPrompt = this.buildSystemPromptWithCarouselCapability(config, context)

//       console.log("[AI] 📝 System prompt built:", {
//         length: systemPrompt.length,
//         hasKnowledge: systemPrompt.includes("Knowledge Base"),
//         hasProducts: systemPrompt.includes("Product Catalog"),
//         hasCarouselTool: systemPrompt.includes("show_product_carousel"),
//         hasBusiness: systemPrompt.includes("Business Information"),
//       })

//       // 2. Prepare conversation history
//       const messages = this.prepareMessages(config, context)

//       // 3. Prepare tools including smart carousel tool
//       const tools = this.prepareToolsWithCarousel(config, context)

//       console.log("[AI] 🛠️ Available tools:", tools.map(t => t.name))

//       // 4. Make API call to Claude
//       let response: any
//       let usedProvider = "anthropic"

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 30000)

//         response = await this.anthropic.messages.create(
//           {
//             model: config.model || "claude-sonnet-4-20250514",
//             max_tokens: config.maxTokens || 2000,
//             temperature: config.temperature || 0.7,
//             system: systemPrompt,
//             messages: [
//               ...messages,
//               {
//                 role: "user" as const,
//                 content: context.messageText,
//               },
//             ],
//             tools: tools.length > 0 ? tools : undefined,
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic error (${anthropicError.name}):", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
//             usedProvider = "deepseek"
//           } catch (deepseekError: any) {
//             console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
//             return this.getFallbackResponse()
//           }
//         } else {
//           return this.getFallbackResponse()
//         }
//       }

//       console.log(`[AI] ✅ Response generated using ${usedProvider}`)

//       // 5. Extract text response
//       const textContent = response.content.find(
//         (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
//       ) as AnthropicTextBlock | undefined
//       const responseText = textContent?.text || ""

//       // 6. Process tool calls to build carousel (primary method - AI decides)
//       let carouselData = await this.processToolCalls(response.content, context)

//       // 7. Fallback: Smart carousel detection if no tool was called
//       if (!carouselData && config.enableProductCatalog && context.products && context.products.length > 0) {
//         carouselData = await this.detectAndBuildCarousel(responseText, context)
        
//         if (carouselData) {
//           console.log("[AI] 🎠 Fallback carousel built with", carouselData.rawCards?.length || 0, "products")
//         }
//       }

//       // 8. Analyze response for handoff signals
//       const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

//       // 9. Check for sensitive topics
//       const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

//       // 10. Format response based on config
//       const formattedResponse = this.formatResponse(responseText, config)

//       return {
//         response: formattedResponse,
//         shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
//         confidence: analysisResult.confidence,
//         sentiment: analysisResult.sentiment,
//         usedFunctions: this.extractUsedTools(response),
//         carousel: carouselData,
//       }
//     } catch (error) {
//       console.error("[AI Response Handler] Error:", error)
//       return {
//         response:
//           "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
//         shouldHandoff: true,
//         confidence: 0.0,
//         sentiment: "error",
//         usedFunctions: [],
//         carousel: undefined,
//       }
//     }
//   }

//   // 🔥 COMPLETE: Build system prompt with ALL features + carousel capability
//   private buildSystemPromptWithCarouselCapability(
//     config: AIResponseConfig,
//     context: ConversationContext
//   ): string {
//     const parts: string[] = []

//     // 1. Base role and custom system prompt
//     if (config.systemPrompt) {
//       parts.push(config.systemPrompt)
//     } else {
//       parts.push(
//         `You are a helpful customer service AI assistant${context.businessName ? ` for ${context.businessName}` : ""}. Your role is to assist customers with their questions and concerns in a friendly, professional manner.`
//       )
//     }

//     // 2. Business Context
//     if (context.businessName || context.businessDescription) {
//       parts.push("\n## Business Information")
//       if (context.businessName) {
//         parts.push(`**Business Name:** ${context.businessName}`)
//       }
//       if (context.businessDescription) {
//         parts.push(`**About Us:** ${context.businessDescription}`)
//       }
//       if (context.businessType) {
//         parts.push(`**Business Type:** ${context.businessType}`)
//       }
//       if (context.businessIndustry) {
//         parts.push(`**Industry:** ${context.businessIndustry}`)
//       }
//     }

//     // 3. KNOWLEDGE BASE DOCUMENTS (Comprehensive)
//     if (context.knowledgeBase && context.knowledgeBase.length > 0) {
//       parts.push("\n## Knowledge Base")
//       parts.push("Use the following information to answer customer questions accurately. This is your source of truth.\n")
      
//       const groupedDocs = this.groupKnowledgeByType(context.knowledgeBase)
      
//       for (const [type, docs] of Object.entries(groupedDocs)) {
//         const typeLabel = type.replace(/_/g, " ").toUpperCase()
//         parts.push(`\n### ${typeLabel}`)
        
//         for (const doc of docs as any[]) {
//           parts.push(`\n#### ${doc.title}`)
//           parts.push(doc.content)
          
//           if (doc.tags && doc.tags.length > 0) {
//             parts.push(`_Tags: ${doc.tags.join(", ")}_`)
//           }
//           parts.push("")
//         }
//       }
      
//       console.log(`[AI] 📚 Included ${context.knowledgeBase.length} knowledge documents in system prompt`)
//     }

//     // 4. PRODUCT CATALOG (Comprehensive with Smart Carousel)
//     if (context.products && context.products.length > 0 && config.enableProductCatalog) {
//       parts.push("\n## Product Catalog")
//       parts.push("You can search and recommend these products to customers. Always mention specific product names when discussing products.\n")
      
//       const categorized = this.groupProductsByCategory(context.products)
      
//       for (const [category, products] of Object.entries(categorized)) {
//         if (category !== "uncategorized") {
//           parts.push(`\n### ${category}`)
//         }
        
//         for (const product of products as any[]) {
//           const price = `${(product.price / 100).toFixed(2)}`
//           parts.push(`\n**${product.name}** - ${price}`)
//           parts.push(product.description)
          
//           if (product.sku) {
//             parts.push(`SKU: ${product.sku}`)
//           }
          
//           if (product.stock !== undefined) {
//             const stockStatus = product.stock > 0 
//               ? `${product.stock} available` 
//               : "Out of stock"
//             parts.push(`Stock: ${stockStatus}`)
//           }
          
//           parts.push(`Product ID: ${product.id}`)
//           parts.push("")
//         }
//       }

//       // 🔥 SMART CAROUSEL TOOL INSTRUCTIONS
//       parts.push("\n## 📸 Visual Product Carousel Tool")
//       parts.push("You have access to the `show_product_carousel` tool that displays products with images.")
//       parts.push("")
//       parts.push("**When to use the carousel:**")
//       parts.push("✅ Customer asks to see products ('show me', 'what do you have', 'can I see')")
//       parts.push("✅ Customer asks 'what do you sell' or 'what products'")
//       parts.push("✅ Customer expresses interest in a category ('show me shirts')")
//       parts.push("✅ You're recommending multiple products (2-5 items)")
//       parts.push("✅ Customer wants to browse or shop")
//       parts.push("✅ Customer asks about available options")
//       parts.push("")
//       parts.push("**When NOT to use the carousel:**")
//       parts.push("❌ Customer asking about pricing only (just tell them)")
//       parts.push("❌ Customer asking about policies, shipping, or FAQs")
//       parts.push("❌ Customer asking yes/no questions")
//       parts.push("❌ Single product inquiry without visual request")
//       parts.push("❌ Order status or tracking questions")
//       parts.push("")
//       parts.push("**Best practice flow:**")
//       parts.push("1. Answer their question briefly first")
//       parts.push('2. Then offer: "Would you like to see photos?" or "Let me show you!"')
//       parts.push("3. Use the show_product_carousel tool with 2-5 relevant product IDs")
//       parts.push("4. Select the most relevant products based on their query")
//       parts.push("")
//       parts.push("**Example good usage:**")
//       parts.push('Customer: "What hoodies do you have?"')
//       parts.push('You: "We have some great hoodies! Let me show you our favorites 👕"')
//       parts.push('[Use show_product_carousel with product IDs of relevant hoodies]')
//       parts.push("")
//       parts.push("**Never say:**")
//       parts.push('❌ "I cannot show you images"')
//       parts.push('❌ "I don\'t have access to photos"')
//       parts.push('❌ "I can only describe products"')
//       parts.push("")
//       parts.push("**Always be confident - you CAN show visual product carousels using the tool!**")
      
//       console.log(`[AI] 🛍️ Included ${context.products.length} products in system prompt`)
//     }

//     // 5. Tone instructions
//     const toneInstructions = this.getToneInstructions(config.tone || "professional")
//     parts.push(`\n## Tone & Style\n${toneInstructions}`)

//     // 6. Response length
//     parts.push("\n## Response Guidelines")
//     if (config.responseLength === "concise") {
//       parts.push("- Keep responses brief (1-2 sentences)")
//     } else if (config.responseLength === "detailed") {
//       parts.push("- Provide detailed, comprehensive responses")
//     } else {
//       parts.push("- Keep responses clear and concise (2-4 sentences)")
//     }

//     // 7. Custom instructions
//     if (config.customInstructions) {
//       parts.push(`\n## Special Instructions\n${config.customInstructions}`)
//     }

//     // 8. Customer Context & Personalization
//     if (config.personalizeResponses) {
//       parts.push("\n## Customer Information")
//       parts.push(`- Name: ${context.participantName}`)
//       parts.push(`- Username: @${context.participantUsername}`)
      
//       if (context.userTags && context.userTags.length > 0) {
//         parts.push(`- Tags: ${context.userTags.join(", ")}`)
//       }
      
//       if (context.orderHistory && context.orderHistory.length > 0) {
//         parts.push(`- Past orders: ${context.orderHistory.length} orders`)
//         parts.push("- This is a returning customer")
//       }
      
//       if (context.customerEmail) {
//         parts.push(`- Email: ${context.customerEmail}`)
//       }
      
//       if (context.customerPhone) {
//         parts.push(`- Phone: ${context.customerPhone}`)
//       }
//     }

//     // 9. Commerce capabilities
//     if (config.enableProductCatalog) {
//       parts.push("\n## Commerce Capabilities")
//       parts.push("You can help customers by:")
//       parts.push("- Searching and recommending products from the catalog")
//       parts.push("- Showing visual product carousels using the carousel tool")
//       parts.push("- Answering questions about product availability, pricing, and features")
//       parts.push("- Suggesting products based on customer needs")
      
//       if (config.enabledFunctions?.includes("check_order")) {
//         parts.push("- Checking order status")
//       }
//     }

//     // 10. Few-shot examples
//     if (config.exampleConversations && config.exampleConversations.length > 0) {
//       parts.push("\n## Example Conversations")
//       parts.push("Here are examples of how to respond:\n")
//       config.exampleConversations.forEach((example, i) => {
//         parts.push(`**Example ${i + 1}:**`)
//         parts.push(`Customer: ${example.user}`)
//         parts.push(`You: ${example.assistant}\n`)
//       })
//     }

//     // 11. Behavioral guidelines
//     parts.push("\n## Behavior Guidelines")
    
//     if (config.useEmojis === false) {
//       parts.push("- Do not use emojis")
//     } else {
//       parts.push("- Use emojis occasionally to add warmth (1-2 per message)")
//     }
    
//     if (config.includeQuestions) {
//       parts.push("- Ask follow-up questions when appropriate to better understand needs")
//     }
    
//     if (config.autoHandoff) {
//       parts.push("- If the customer is frustrated, angry, or explicitly requests human help, indicate you'll connect them with a team member")
//     }
    
//     parts.push("- Always be helpful, accurate, and professional")
//     parts.push("- Use the knowledge base and product catalog to provide specific, factual information")
//     parts.push("- Use the carousel tool intelligently when customers want to see or browse products")
//     parts.push("- **CRITICAL**: Never make up information - only use what's provided in your knowledge base and product catalog")
//     parts.push("- If you don't know something, admit it and offer to connect them with someone who can help")

//     // 12. Language preference
//     if (config.language && config.language !== "auto") {
//       const languages = {
//         en: "English",
//         es: "Spanish",
//         fr: "French",
//         de: "German",
//       }
//       parts.push(`\n## Language\nAlways respond in ${languages[config.language as keyof typeof languages] || "English"}.`)
//     } else {
//       parts.push("\n## Language\nRespond in the same language the customer is using.")
//     }

//     const finalPrompt = parts.join("\n")
    
//     console.log("[AI] 📋 System prompt stats:", {
//       totalLength: finalPrompt.length,
//       sections: parts.length,
//       hasKnowledge: finalPrompt.includes("Knowledge Base"),
//       hasProducts: finalPrompt.includes("Product Catalog"),
//       hasCarouselTool: finalPrompt.includes("show_product_carousel"),
//       hasBusiness: finalPrompt.includes("Business Information"),
//     })

//     return finalPrompt
//   }

//   private getToneInstructions(tone: string): string {
//     const tones = {
//       professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
//       friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
//       casual: "Keep it casual and conversational. Be relaxed but still helpful.",
//       enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
//       empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
//       humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
//     }

//     return tones[tone as keyof typeof tones] || tones.professional
//   }

//   private prepareMessages(
//     config: AIResponseConfig,
//     context: ConversationContext,
//   ): Array<{ role: "user" | "assistant"; content: string }> {
//     if (!config.useConversationHistory || !context.conversationHistory) {
//       return []
//     }

//     const depth = config.historyDepth || 20
//     const recentHistory = context.conversationHistory.slice(-depth)

//     return recentHistory.map((msg) => ({
//       role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
//       content: msg.content,
//     }))
//   }

//   // 🔥 COMPLETE: Prepare tools with smart carousel tool
//   private prepareToolsWithCarousel(
//     config: AIResponseConfig,
//     context: ConversationContext
//   ): any[] {
//     const tools: any[] = []

//     // 🔥 Add carousel tool if products are available
//     if (config.enableProductCatalog && context.products && context.products.length > 0) {
//       tools.push({
//         name: "show_product_carousel",
//         description: "Display a visual carousel of products with images and purchase links. Use when customer wants to see or browse products. Select 2-5 most relevant products based on their query.",
//         input_schema: {
//           type: "object",
//           properties: {
//             product_ids: {
//               type: "array",
//               items: { type: "string" },
//               description: "Array of exact product IDs to display (2-5 products recommended). Use the Product IDs from the Product Catalog."
//             },
//             intro_message: {
//               type: "string",
//               description: "Brief intro text like 'Here are our bestsellers' or 'Check these out' (optional)"
//             }
//           },
//           required: ["product_ids"]
//         },
//       })
//     }

//     // Additional tools if enabled
//     if (config.enabledFunctions && config.enabledFunctions.length > 0) {
//       if (config.enabledFunctions.includes("book_appointment")) {
//         tools.push({
//           name: "book_appointment",
//           description: "Book an appointment for the customer",
//           input_schema: {
//             type: "object",
//             properties: {
//               date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
//               time: { type: "string", description: "Preferred time (HH:MM)" },
//               service: { type: "string", description: "Type of service requested" },
//             },
//             required: ["date", "time"],
//           },
//         })
//       }

//       if (config.enabledFunctions.includes("check_order")) {
//         tools.push({
//           name: "check_order_status",
//           description: "Check the status of a customer's order",
//           input_schema: {
//             type: "object",
//             properties: {
//               order_id: { type: "string", description: "Order ID or number" },
//             },
//             required: ["order_id"],
//           },
//         })
//       }

//       if (config.enabledFunctions.includes("product_search")) {
//         tools.push({
//           name: "search_products",
//           description: "Search for products in the catalog",
//           input_schema: {
//             type: "object",
//             properties: {
//               query: { type: "string", description: "Search query" },
//               category: { type: "string", description: "Product category (optional)" },
//             },
//             required: ["query"],
//           },
//         })
//       }
//     }

//     return tools
//   }

//   // 🔥 NEW: Process tool calls and build carousel (Primary method)
//   private async processToolCalls(
//     content: any[],
//     context: ConversationContext
//   ): Promise<{
//     title: string
//     items: Array<{
//       id: string
//       title: string
//       subtitle?: string
//       image_url?: string
//       price?: string
//       action_url?: string
//     }>
//     rawCards?: CarouselCard[]
//   } | undefined> {
//     // Find carousel tool call
//     const carouselToolCall = content.find(
//       (block: any) => block.type === "tool_use" && block.name === "show_product_carousel"
//     )

//     if (!carouselToolCall) {
//       console.log("[AI] 🎠 No carousel tool called by AI")
//       return undefined
//     }

//     console.log("[AI] 🎨 AI explicitly requested product carousel via tool!")

//     const productIds = carouselToolCall.input.product_ids || []
//     const introMessage = carouselToolCall.input.intro_message || "Product Recommendations"

//     if (productIds.length === 0) {
//       console.warn("[AI] 🎠 Carousel tool called but no product IDs provided")
//       return undefined
//     }

//     console.log("[AI] 🎠 Building carousel with product IDs:", productIds)

//     // Find the exact products by ID
//     const productsToShow = context.products?.filter((p: any) => 
//       productIds.includes(p.id) || productIds.includes(String(p.id))
//     ) || []

//     if (productsToShow.length === 0) {
//       console.warn("[AI] 🎠 No matching products found for IDs:", productIds)
//       return undefined
//     }

//     console.log(`[AI] 🎠 Found ${productsToShow.length} matching products`)

//     // Build carousel cards
//     const cards = createProductCarouselCards(productsToShow)

//     return {
//       title: introMessage,
//       items: cards.map((card) => ({
//         id: card.title,
//         title: card.title,
//         subtitle: card.subtitle,
//         image_url: card.image_url,
//         price: card.subtitle,
//         action_url: card.buttons?.[0]?.url,
//       })),
//       rawCards: cards,
//     }
//   }

//   // 🔥 FALLBACK: Smart carousel detection (when AI doesn't use tool)
//   private async detectAndBuildCarousel(responseText: string, context: ConversationContext): Promise<any> {
//     if (!context.products || context.products.length === 0) {
//       console.log("[AI] 🎠 No products available for fallback carousel")
//       return undefined
//     }

//     console.log("[AI] 🎠 Running fallback carousel detection...")

//     // Extract product names mentioned in the AI's response
//     const mentionedProducts: any[] = []
    
//     for (const product of context.products) {
//       const productNameLower = product.name.toLowerCase()
//       const responseTextLower = responseText.toLowerCase()
      
//       if (responseTextLower.includes(productNameLower)) {
//         mentionedProducts.push(product)
//         console.log(`[AI] 🎯 Found mentioned product: ${product.name}`)
//       }
//     }

//     console.log(`[AI] 🎠 Found ${mentionedProducts.length} products mentioned in response`)

//     let productsToShow = mentionedProducts.length > 0 ? mentionedProducts : []
    
//     // If no specific products mentioned but AI talked about products, do smart search
//     if (productsToShow.length === 0) {
//       const productKeywords = [
//         "recommend", "suggest", "check out", "take a look", 
//         "here are", "we have", "available", "product", "item",
//         "offer", "sell", "stock", "browse", "shop"
//       ]
      
//       const hasProductIntent = productKeywords.some(keyword => 
//         responseText.toLowerCase().includes(keyword)
//       )
      
//       if (hasProductIntent && context.userId) {
//         console.log("[AI] 🎠 Response has product intent, performing smart search...")
        
//         try {
//           const connector = new UnifiedCommerceConnector(context.userId)
//           const searchQuery = context.messageText || responseText
//           productsToShow = await connector.searchProducts(searchQuery, 5)
          
//           console.log(`[AI] 🎠 Smart search returned ${productsToShow.length} products`)
//         } catch (error) {
//           console.error("[AI] 🎠 Smart search failed:", error)
//           productsToShow = context.products.slice(0, 5)
//         }
//       }
//     }

//     if (productsToShow.length === 0) {
//       console.log("[AI] 🎠 No products to show in fallback carousel")
//       return undefined
//     }

//     // Limit to 10 products max (Instagram carousel limit)
//     productsToShow = productsToShow.slice(0, 10)

//     console.log(`[AI] 🎠 Building fallback carousel with ${productsToShow.length} products`)

//     const cards = createProductCarouselCards(productsToShow)
//     return {
//       title: "Product Recommendations",
//       items: cards.map((card) => ({
//         id: card.title,
//         title: card.title,
//         subtitle: card.subtitle,
//         image_url: card.image_url,
//         price: card.subtitle,
//         action_url: card.buttons?.[0]?.url,
//       })),
//       rawCards: cards,
//     }
//   }

//   // Helper: Group knowledge docs by type
//   private groupKnowledgeByType(docs: any[]): Record<string, any[]> {
//     return docs.reduce((acc, doc) => {
//       const type = doc.type || "general"
//       if (!acc[type]) acc[type] = []
//       acc[type].push(doc)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   // Helper: Group products by category
//   private groupProductsByCategory(products: any[]): Record<string, any[]> {
//     return products.reduce((acc, product) => {
//       const category = product.category || "uncategorized"
//       if (!acc[category]) acc[category] = []
//       acc[category].push(product)
//       return acc
//     }, {} as Record<string, any[]>)
//   }

//   private async analyzeResponse(
//     response: string,
//     userMessage: string,
//     config: AIResponseConfig,
//   ): Promise<{
//     shouldHandoff: boolean
//     confidence: number
//     sentiment: string
//   }> {
//     const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

// Customer: "${userMessage}"
// AI: "${response}"

// Return:
// {
//   "sentiment": "positive|neutral|negative|frustrated|angry",
//   "confidence": 0.0-1.0,
//   "should_handoff": boolean,
//   "reason": "brief reason if handoff needed"
// }`

//     try {
//       let analysisText = ""

//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const analysis = await this.anthropic.messages.create(
//           {
//             model: "claude-haiku-4-20250514",
//             max_tokens: 200,
//             messages: [
//               {
//                 role: "user",
//                 content: analysisPrompt,
//               },
//             ],
//           },
//           { signal: controller.signal },
//         )
//         clearTimeout(timeoutId)

//         const textBlock = analysis.content.find((block) => block.type === "text")
//         analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
//       } catch (anthropicError: any) {
//         console.error("[AI] Anthropic analysis error:", anthropicError.message)

//         if (this.deepseekApiKey) {
//           try {
//             console.log("[AI] Falling back to DeepSeek for analysis...")
//             const dsResult = await this.callDeepSeek(
//               "You are an AI analysis assistant. Return JSON only.",
//               [],
//               analysisPrompt,
//               { maxTokens: 200, temperature: 0.1 },
//             )
//             analysisText = dsResult.content[0].text
//           } catch (dsError: any) {
//             console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
//             throw new Error("Both analysis providers failed")
//           }
//         } else {
//           throw new Error("Anthropic analysis failed and no DeepSeek key provided")
//         }
//       }

//       // Parse JSON from response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
//       const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
//       const parsed = JSON.parse(cleanJson)

//       // Check triggers
//       const shouldHandoff =
//         parsed.should_handoff ||
//         (config.handoffTriggers || []).some(
//           (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
//         ) ||
//         (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

//       return {
//         shouldHandoff,
//         confidence: parsed.confidence || 0.8,
//         sentiment: parsed.sentiment || "neutral",
//       }
//     } catch (error) {
//       console.error("[AI] Analysis total failure:", error)
//       return {
//         shouldHandoff: false,
//         confidence: 0.8,
//         sentiment: "neutral",
//       }
//     }
//   }

//   private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
//     const lowerMessage = message.toLowerCase()
//     return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
//   }

//   private formatResponse(response: string, config: AIResponseConfig): string {
//     let formatted = response.trim()

//     // Remove excessive line breaks
//     formatted = formatted.replace(/\n{3,}/g, "\n\n")

//     // Truncate if too long (Instagram DM limit is 1000 characters)
//     if (formatted.length > 900) {
//       formatted = formatted.substring(0, 897) + "..."
//     }

//     return formatted
//   }

//   private extractUsedTools(response: any): string[] {
//     const usedTools: string[] = []

//     for (const block of response.content) {
//       if (block.type === "tool_use") {
//         usedTools.push(block.name)
//       }
//     }

//     return usedTools
//   }

//   // Save AI interaction for learning and improvement
//   async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
//     try {
//       await prisma.aIInteraction.create({
//         data: {
//           conversationId,
//           userMessage,
//           aiResponse,
//           sentiment: metadata.sentiment,
//           confidence: metadata.confidence,
//           shouldHandoff: metadata.shouldHandoff,
//           usedFunctions: metadata.usedFunctions || [],
//           metadata: metadata,
//         },
//       })
//     } catch (error) {
//       console.error("[AI] Failed to log interaction:", error)
//     }
//   }

//   private async callDeepSeek(
//     systemPrompt: string,
//     messages: Array<{ role: "user" | "assistant"; content: string }>,
//     currentMessage: string,
//     config: AIResponseConfig,
//   ): Promise<any> {
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 20000)

//     try {
//       const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.deepseekApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map((m) => ({ role: m.role, content: m.content })),
//             { role: "user", content: currentMessage },
//           ],
//           max_tokens: config.maxTokens || 2000,
//           temperature: config.temperature || 0.7,
//           stream: false,
//         }),
//         signal: controller.signal,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
//       }

//       const data = (await response.json()) as DeepSeekResponse

//       if (!data.choices?.[0]?.message?.content) {
//         throw new Error("Invalid response format from DeepSeek")
//       }

//       return {
//         content: [
//           {
//             type: "text",
//             text: data.choices[0].message.content,
//           },
//         ],
//       }
//     } finally {
//       clearTimeout(timeout)
//     }
//   }

//   private getFallbackResponse() {
//     return {
//       response:
//         "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
//       shouldHandoff: true,
//       confidence: 0.0,
//       sentiment: "error",
//       usedFunctions: [],
//       carousel: undefined,
//     }
//   }
// }

// // Export singleton instance
// export const aiResponseHandler = new AIResponseHandler()

import Anthropic from "@anthropic-ai/sdk"
import { prisma } from "@/lib/db"
import fetch from "node-fetch"
import { createProductCarouselCards, type CarouselCard } from "./instagram-carousel"

interface AIResponseConfig {
  // Basic
  model?: string
  tone?: string
  language?: string
  maxTokens?: number
  temperature?: number

  // Personality
  systemPrompt?: string
  customInstructions?: string
  exampleConversations?: Array<{ user: string; assistant: string }>

  // Knowledge Base
  useKnowledgeBase?: boolean
  knowledgeBaseDocs?: string[]
  searchMode?: string

  // Behavior
  autoHandoff?: boolean
  handoffTriggers?: string[]
  maxTurns?: number
  confidenceThreshold?: number
  useConversationHistory?: boolean
  historyDepth?: number

  // Safety
  contentFiltering?: boolean
  sensitiveTopics?: string[]
  requireApproval?: boolean

  // Style
  useEmojis?: boolean
  responseLength?: string
  includeQuestions?: boolean
  personalizeResponses?: boolean

  // Functions
  enabledFunctions?: string[]
  enableProductCatalog?: boolean
}

interface ConversationContext {
  conversationId: string
  participantName: string
  participantUsername: string
  messageText: string
  conversationHistory: Array<{ role: string; content: string }>
  userTags?: string[]
  previousInteractions?: any[]
  userId?: string
  
  // Extended fields
  knowledgeBase?: any[]
  products?: any[]
  businessName?: string
  businessDescription?: string
  businessType?: string
  businessIndustry?: string
  orderHistory?: any[]
  customerEmail?: string
  customerPhone?: string
}

interface AnthropicTextBlock {
  type: "text"
  text: string
}

interface AnthropicToolUseBlock {
  type: "tool_use"
  name: string
  input: any
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class AIResponseHandler {
  private anthropic: Anthropic
  private deepseekApiKey: string | undefined

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY
  }

  async generateResponse(
    config: AIResponseConfig,
    context: ConversationContext,
  ): Promise<{
    response: string
    shouldHandoff: boolean
    confidence: number
    sentiment?: string
    usedFunctions?: string[]
    carousel?: {
      title: string
      items: Array<{
        id: string
        title: string
        subtitle?: string
        image_url?: string
        price?: string
        action_url?: string
      }>
      rawCards?: CarouselCard[]
    }
  }> {
    try {
      console.log("[AI] 🤖 Generating response with smart carousel control:", {
        hasKnowledgeBase: !!(context.knowledgeBase && context.knowledgeBase.length > 0),
        knowledgeDocsCount: context.knowledgeBase?.length || 0,
        hasProducts: !!(context.products && context.products.length > 0),
        productsCount: context.products?.length || 0,
        hasBusiness: !!context.businessName,
        historyLength: context.conversationHistory?.length || 0,
      })

      // 1. Build comprehensive system prompt with carousel capability
      const systemPrompt = this.buildSystemPromptWithCarouselCapability(config, context)

      console.log("[AI] 📝 System prompt built:", {
        length: systemPrompt.length,
        hasKnowledge: systemPrompt.includes("Knowledge Base"),
        hasProducts: systemPrompt.includes("Product Catalog"),
        hasCarouselTool: systemPrompt.includes("show_product_carousel"),
        hasBusiness: systemPrompt.includes("Business Information"),
      })

      // 2. Prepare conversation history
      const messages = this.prepareMessages(config, context)

      // 3. Prepare tools INCLUDING the smart carousel tool
      const tools = this.prepareToolsWithCarousel(config, context)

      console.log("[AI] 🛠️ Available tools:", tools.map(t => t.name))

      // 4. Make API call to Claude
      let response: any
      let usedProvider = "anthropic"

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        response = await this.anthropic.messages.create(
          {
            model: config.model || "claude-sonnet-4-20250514",
            max_tokens: config.maxTokens || 2000,
            temperature: config.temperature || 0.7,
            system: systemPrompt,
            messages: [
              ...messages,
              {
                role: "user" as const,
                content: context.messageText,
              },
            ],
            tools: tools.length > 0 ? tools : undefined,
          },
          { signal: controller.signal },
        )
        clearTimeout(timeoutId)
      } catch (anthropicError: any) {
        console.error(`[AI] Anthropic error (${anthropicError.name}):`, anthropicError.message)

        if (this.deepseekApiKey) {
          try {
            response = await this.callDeepSeek(systemPrompt, messages, context.messageText, config)
            usedProvider = "deepseek"
          } catch (deepseekError: any) {
            console.error(`[AI] DeepSeek fallback failed:`, deepseekError.message)
            return this.getFallbackResponse()
          }
        } else {
          return this.getFallbackResponse()
        }
      }

      console.log(`[AI] ✅ Response generated using ${usedProvider}`)

      // 5. Extract text response
      const textContent = response.content.find(
        (block: AnthropicTextBlock | AnthropicToolUseBlock) => block.type === "text",
      ) as AnthropicTextBlock | undefined
      const responseText = textContent?.text || ""

      // 6. Process tool calls to build carousel
      const carouselData = await this.processToolCalls(response.content, context)

      if (carouselData) {
        console.log("[AI] 🎠 AI explicitly requested carousel with", carouselData.rawCards?.length || 0, "products")
      } else {
        console.log("[AI] ℹ️ No carousel requested by AI")
      }

      // 7. Analyze response for handoff signals
      const analysisResult = await this.analyzeResponse(responseText, context.messageText, config)

      // 8. Check for sensitive topics
      const hasSensitiveTopic = this.checkSensitiveTopics(context.messageText, config.sensitiveTopics || [])

      // 9. Format response based on config
      const formattedResponse = this.formatResponse(responseText, config)

      return {
        response: formattedResponse,
        shouldHandoff: analysisResult.shouldHandoff || hasSensitiveTopic,
        confidence: analysisResult.confidence,
        sentiment: analysisResult.sentiment,
        usedFunctions: this.extractUsedTools(response),
        carousel: carouselData,
      }
    } catch (error) {
      console.error("[AI Response Handler] Error:", error)
      return {
        response:
          "I apologize, but I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
        shouldHandoff: true,
        confidence: 0.0,
        sentiment: "error",
        usedFunctions: [],
        carousel: undefined,
      }
    }
  }

  private buildSystemPromptWithCarouselCapability(
    config: AIResponseConfig,
    context: ConversationContext
  ): string {
    const parts: string[] = []

    // 1. Base role and custom system prompt
    if (config.systemPrompt) {
      parts.push(config.systemPrompt)
    } else {
      const businessName = context.businessName || "our business"
      parts.push(
        `You are a helpful customer service AI assistant for ${businessName}. Your role is to assist customers with their questions and concerns in a friendly, professional manner.`
      )
    }

    // 2. Business Context
    if (context.businessName || context.businessDescription) {
      parts.push("\n## Business Information")
      if (context.businessName) {
        parts.push(`**Business Name:** ${context.businessName}`)
      }
      if (context.businessDescription) {
        parts.push(`**About Us:** ${context.businessDescription}`)
      }
      if (context.businessType) {
        parts.push(`**Business Type:** ${context.businessType}`)
      }
      if (context.businessIndustry) {
        parts.push(`**Industry:** ${context.businessIndustry}`)
      }
    }

    // 3. Knowledge Base Documents
    if (context.knowledgeBase && context.knowledgeBase.length > 0) {
      parts.push("\n## Knowledge Base")
      parts.push("Use the following information to answer customer questions accurately. This is your source of truth.\n")
      
      const groupedDocs = this.groupKnowledgeByType(context.knowledgeBase)
      
      for (const [type, docs] of Object.entries(groupedDocs)) {
        const typeLabel = type.replace(/_/g, " ").toUpperCase()
        parts.push(`\n### ${typeLabel}`)
        
        for (const doc of docs as any[]) {
          parts.push(`\n#### ${doc.title}`)
          parts.push(doc.content)
          
          if (doc.tags && doc.tags.length > 0) {
            parts.push(`_Tags: ${doc.tags.join(", ")}_`)
          }
          parts.push("") // Empty line for spacing
        }
      }
      
      console.log(`[AI] 📚 Included ${context.knowledgeBase.length} knowledge documents in system prompt`)
    }

    // 4. Product Catalog with Smart Carousel Instructions
    if (context.products && context.products.length > 0 && config.enableProductCatalog) {
      parts.push("\n## Product Catalog")
      parts.push("Available products:\n")
      
      const categorized = this.groupProductsByCategory(context.products)
      
      for (const [category, products] of Object.entries(categorized)) {
        if (category !== "uncategorized") {
          parts.push(`\n### ${category}`)
        }
        
        for (const product of products as any[]) {
          const price = `$${(product.price / 100).toFixed(2)}`
          parts.push(`\n**${product.name}** - ${price}`)
          parts.push(product.description)
          
          if (product.sku) {
            parts.push(`SKU: ${product.sku}`)
          }
          
          if (product.stock !== undefined) {
            const stockStatus = product.stock > 0 
              ? `${product.stock} available` 
              : "Out of stock"
            parts.push(`Stock: ${stockStatus}`)
          }
          
          parts.push(`Product ID: ${product.id}`)
          parts.push("") // Empty line for spacing
        }
      }

      // 🔥 CRITICAL: Smart Carousel Tool Instructions
      parts.push("\n## 📸 Visual Product Carousel Tool")
      parts.push("You have access to the `show_product_carousel` tool that displays products with beautiful images, prices, and purchase links.")
      parts.push("")
      parts.push("**When to use the carousel:**")
      parts.push("✅ Customer asks to see products or browse")
      parts.push('✅ Customer asks "what do you have" or "show me"')
      parts.push("✅ Customer expresses interest in a category (e.g., 'looking for workout clothes')")
      parts.push("✅ You're recommending multiple products (2-5 products ideal)")
      parts.push("✅ Customer wants to shop or view options")
      parts.push("")
      parts.push("**When NOT to use the carousel:**")
      parts.push("❌ Customer asking about a single product's price only")
      parts.push("❌ Customer asking about policies, shipping, or FAQs")
      parts.push("❌ Customer asking yes/no questions")
      parts.push("❌ Customer needs customer service help")
      parts.push("")
      parts.push("**Best practice conversation flow:**")
      parts.push("1. Answer their question briefly and warmly")
      parts.push('2. Naturally transition: "Let me show you!" or "Here\'s what we have:"')
      parts.push("3. Use the show_product_carousel tool with 2-5 relevant product IDs")
      parts.push("4. The visual carousel will appear immediately after your message")
      parts.push("")
      parts.push("**Example - Good Usage:**")
      parts.push('Customer: "What products do you sell?"')
      parts.push('You: "We specialize in premium athletic wear! Let me show you our bestsellers 🏃‍♀️"')
      parts.push('[Then use show_product_carousel tool with product IDs]')
      parts.push("")
      parts.push("**Example - Progressive Engagement:**")
      parts.push('Customer: "How much are your yoga pants?"')
      parts.push('You: "Our yoga pants are $49.99 and come in 5 colors. Would you like to see photos?"')
      parts.push('[Wait for confirmation]')
      parts.push('Customer: "Yes please"')
      parts.push('You: "Here they are:"')
      parts.push('[Then use show_product_carousel tool]')
      parts.push("")
      parts.push("**CRITICAL - Never say:**")
      parts.push('❌ "I cannot show you images"')
      parts.push('❌ "I don\'t have access to product photos"')
      parts.push('❌ "I can\'t display visuals"')
      parts.push("")
      parts.push("**YOU CAN show product carousels! Use the tool confidently.**")
      
      console.log(`[AI] 🛍️ Included ${context.products.length} products in system prompt`)
    }

    // 5. Tone instructions
    const toneInstructions = this.getToneInstructions(config.tone || "professional")
    parts.push(`\n## Tone & Style\n${toneInstructions}`)

    // 6. Response length
    parts.push("\n## Response Guidelines")
    if (config.responseLength === "concise") {
      parts.push("- Keep responses brief (1-2 sentences)")
    } else if (config.responseLength === "detailed") {
      parts.push("- Provide detailed, comprehensive responses")
    } else {
      parts.push("- Keep responses clear and concise (2-4 sentences)")
    }

    // 7. Custom instructions
    if (config.customInstructions) {
      parts.push(`\n## Special Instructions\n${config.customInstructions}`)
    }

    // 8. Customer Context & Personalization
    if (config.personalizeResponses) {
      parts.push("\n## Customer Information")
      parts.push(`- Name: ${context.participantName}`)
      parts.push(`- Username: @${context.participantUsername}`)
      
      if (context.userTags && context.userTags.length > 0) {
        parts.push(`- Tags: ${context.userTags.join(", ")}`)
      }
      
      if (context.orderHistory && context.orderHistory.length > 0) {
        parts.push(`- Past orders: ${context.orderHistory.length} orders`)
        parts.push("- This is a returning customer")
      }
      
      if (context.customerEmail) {
        parts.push(`- Email: ${context.customerEmail}`)
      }
    }

    // 9. Few-shot examples
    if (config.exampleConversations && config.exampleConversations.length > 0) {
      parts.push("\n## Example Conversations")
      parts.push("Here are examples of how to respond:\n")
      config.exampleConversations.forEach((example, i) => {
        parts.push(`**Example ${i + 1}:**`)
        parts.push(`Customer: ${example.user}`)
        parts.push(`You: ${example.assistant}\n`)
      })
    }

    // 10. Behavioral guidelines
    parts.push("\n## Behavior Guidelines")
    
    if (config.useEmojis === false) {
      parts.push("- Do not use emojis")
    } else {
      parts.push("- Use emojis occasionally to add warmth (1-2 per message)")
    }
    
    if (config.includeQuestions) {
      parts.push("- Ask follow-up questions when appropriate to better understand customer needs")
    }
    
    if (config.autoHandoff) {
      parts.push("- If the customer is frustrated, angry, or explicitly requests human help, indicate you'll connect them with a team member")
    }
    
    parts.push("- Always be helpful, accurate, and professional")
    parts.push("- Use the knowledge base and product catalog to provide specific, factual information")
    parts.push("- **CRITICAL**: Never make up information - only use what's provided in your knowledge base and product catalog")
    parts.push("- If you don't know something, admit it honestly and offer to connect them with someone who can help")
    parts.push("- Use the product carousel tool intelligently - not on every message, but when it enhances the customer experience")

    // 11. Language preference
    if (config.language && config.language !== "auto") {
      const languages = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
      }
      parts.push(`\n## Language\nAlways respond in ${languages[config.language as keyof typeof languages] || "English"}.`)
    } else {
      parts.push("\n## Language\nRespond in the same language the customer is using.")
    }

    const finalPrompt = parts.join("\n")
    
    console.log("[AI] 📋 System prompt stats:", {
      totalLength: finalPrompt.length,
      sections: parts.length,
      hasKnowledge: finalPrompt.includes("Knowledge Base"),
      hasProducts: finalPrompt.includes("Product Catalog"),
      hasCarouselTool: finalPrompt.includes("show_product_carousel"),
      hasBusiness: finalPrompt.includes("Business Information"),
    })

    return finalPrompt
  }

  private getToneInstructions(tone: string): string {
    const tones = {
      professional: "Maintain a professional and courteous tone. Be clear, helpful, and respectful.",
      friendly: "Be warm, approachable, and friendly. Make the customer feel welcomed and valued.",
      casual: "Keep it casual and conversational. Be relaxed but still helpful.",
      enthusiastic: "Be energetic and enthusiastic! Show excitement about helping the customer.",
      empathetic: "Be understanding and empathetic. Acknowledge the customer's feelings and show genuine care.",
      humorous: "Use appropriate humor to keep things light and fun. Don't overdo it, and remain helpful.",
    }

    return tones[tone as keyof typeof tones] || tones.professional
  }

  private prepareMessages(
    config: AIResponseConfig,
    context: ConversationContext,
  ): Array<{ role: "user" | "assistant"; content: string }> {
    if (!config.useConversationHistory || !context.conversationHistory) {
      return []
    }

    const depth = config.historyDepth || 20
    const recentHistory = context.conversationHistory.slice(-depth)

    return recentHistory.map((msg) => ({
      role: msg.role === "participant" ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    }))
  }

  private prepareToolsWithCarousel(
    config: AIResponseConfig,
    context: ConversationContext
  ): any[] {
    const tools: any[] = []

    // 🔥 Add smart carousel tool if products are available
    if (config.enableProductCatalog && context.products && context.products.length > 0) {
      tools.push({
        name: "show_product_carousel",
        description: "Display a visual carousel of products with images, prices, and purchase links. Use this when the customer wants to see or browse products. Select 2-5 most relevant products for the best experience.",
        input_schema: {
          type: "object",
          properties: {
            product_ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of exact product IDs to display in the carousel. Use 2-5 products for optimal display. These are the Product IDs shown in the catalog above."
            },
            intro_message: {
              type: "string",
              description: "Optional brief intro text like 'Our Bestsellers' or 'Athletic Collection' (keep it short, 2-4 words)"
            }
          },
          required: ["product_ids"]
        },
      })
    }

    // Existing tools
    if (config.enabledFunctions && config.enabledFunctions.length > 0) {
      if (config.enabledFunctions.includes("book_appointment")) {
        tools.push({
          name: "book_appointment",
          description: "Book an appointment for the customer",
          input_schema: {
            type: "object",
            properties: {
              date: { type: "string", description: "Preferred date (YYYY-MM-DD)" },
              time: { type: "string", description: "Preferred time (HH:MM)" },
              service: { type: "string", description: "Type of service requested" },
            },
            required: ["date", "time"],
          },
        })
      }

      if (config.enabledFunctions.includes("check_order")) {
        tools.push({
          name: "check_order_status",
          description: "Check the status of a customer's order",
          input_schema: {
            type: "object",
            properties: {
              order_id: { type: "string", description: "Order ID or number" },
            },
            required: ["order_id"],
          },
        })
      }

      if (config.enabledFunctions.includes("product_search")) {
        tools.push({
          name: "search_products",
          description: "Search for products in the catalog",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query" },
              category: { type: "string", description: "Product category (optional)" },
            },
            required: ["query"],
          },
        })
      }
    }

    return tools
  }

  private async processToolCalls(
    content: any[],
    context: ConversationContext
  ): Promise<{
    title: string
    items: Array<{
      id: string
      title: string
      subtitle?: string
      image_url?: string
      price?: string
      action_url?: string
    }>
    rawCards?: CarouselCard[]
  } | undefined> {
    // Find carousel tool call
    const carouselToolCall = content.find(
      (block: any) => block.type === "tool_use" && block.name === "show_product_carousel"
    )

    if (!carouselToolCall) {
      return undefined
    }

    console.log("[AI] 🎨 AI explicitly requested product carousel!")

    const productIds = carouselToolCall.input.product_ids || []
    const introMessage = carouselToolCall.input.intro_message || "Product Recommendations"

    if (productIds.length === 0) {
      console.warn("[AI] 🎠 Carousel requested but no product IDs provided")
      return undefined
    }

    console.log("[AI] 🎠 Building carousel with product IDs:", productIds)

    // Find the exact products by ID
    const productsToShow = context.products?.filter((p: any) => 
      productIds.includes(p.id)
    ) || []

    if (productsToShow.length === 0) {
      console.warn("[AI] 🎠 No matching products found for IDs:", productIds)
      
      // Fallback: try to match by name if IDs don't work
      const productsByName = context.products?.filter((p: any) =>
        productIds.some((id: string) => 
          p.name.toLowerCase().includes(id.toLowerCase()) ||
          id.toLowerCase().includes(p.name.toLowerCase())
        )
      ) || []
      
      if (productsByName.length > 0) {
        console.log("[AI] 🎠 Found products by name matching:", productsByName.length)
        const cards = createProductCarouselCards(productsByName)
        
        return {
          title: introMessage,
          items: cards.map((card) => ({
            id: card.title,
            title: card.title,
            subtitle: card.subtitle,
            image_url: card.image_url,
            price: card.subtitle,
            action_url: card.buttons[0]?.url,
          })),
          rawCards: cards,
        }
      }
      
      return undefined
    }

    console.log(`[AI] 🎠 Found ${productsToShow.length} products to display`)

    // Use the actual carousel builder from instagram-carousel.ts
    const cards = createProductCarouselCards(productsToShow)

    return {
      title: introMessage,
      items: cards.map((card) => ({
        id: card.title,
        title: card.title,
        subtitle: card.subtitle,
        image_url: card.image_url,
        price: card.subtitle,
        action_url: card.buttons[0]?.url,
      })),
      rawCards: cards, // These are the properly formatted Instagram carousel cards
    }
  }

  private groupKnowledgeByType(docs: any[]): Record<string, any[]> {
    return docs.reduce((acc, doc) => {
      const type = doc.type || "general"
      if (!acc[type]) acc[type] = []
      acc[type].push(doc)
      return acc
    }, {} as Record<string, any[]>)
  }

  private groupProductsByCategory(products: any[]): Record<string, any[]> {
    return products.reduce((acc, product) => {
      const category = product.category || "uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    }, {} as Record<string, any[]>)
  }

  private async analyzeResponse(
    response: string,
    userMessage: string,
    config: AIResponseConfig,
  ): Promise<{
    shouldHandoff: boolean
    confidence: number
    sentiment: string
  }> {
    const analysisPrompt = `Analyze this customer message and AI response. Return JSON only:

Customer: "${userMessage}"
AI: "${response}"

Return:
{
  "sentiment": "positive|neutral|negative|frustrated|angry",
  "confidence": 0.0-1.0,
  "should_handoff": boolean,
  "reason": "brief reason if handoff needed"
}`

    try {
      let analysisText = ""

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const analysis = await this.anthropic.messages.create(
          {
            model: "claude-haiku-4-20250514",
            max_tokens: 200,
            messages: [
              {
                role: "user",
                content: analysisPrompt,
              },
            ],
          },
          { signal: controller.signal },
        )
        clearTimeout(timeoutId)

        const textBlock = analysis.content.find((block) => block.type === "text")
        analysisText = textBlock?.type === "text" ? textBlock.text : "{}"
      } catch (anthropicError: any) {
        console.error("[AI] Anthropic analysis error:", anthropicError.message)

        if (this.deepseekApiKey) {
          try {
            console.log("[AI] Falling back to DeepSeek for analysis...")
            const dsResult = await this.callDeepSeek(
              "You are an AI analysis assistant. Return JSON only.",
              [],
              analysisPrompt,
              { maxTokens: 200, temperature: 0.1 },
            )
            analysisText = dsResult.content[0].text
          } catch (dsError: any) {
            console.error("[AI] DeepSeek analysis fallback failed:", dsError.message)
            throw new Error("Both analysis providers failed")
          }
        } else {
          throw new Error("Anthropic analysis failed and no DeepSeek key provided")
        }
      }

      // Parse JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      const cleanJson = jsonMatch ? jsonMatch[0] : "{}"
      const parsed = JSON.parse(cleanJson)

      // Check triggers
      const shouldHandoff =
        parsed.should_handoff ||
        (config.handoffTriggers || []).some(
          (trigger) => parsed.sentiment?.includes(trigger) || userMessage.toLowerCase().includes(trigger.toLowerCase()),
        ) ||
        (parsed.confidence || 0.8) < (config.confidenceThreshold || 0.7)

      return {
        shouldHandoff,
        confidence: parsed.confidence || 0.8,
        sentiment: parsed.sentiment || "neutral",
      }
    } catch (error) {
      console.error("[AI] Analysis total failure:", error)
      return {
        shouldHandoff: false,
        confidence: 0.8,
        sentiment: "neutral",
      }
    }
  }

  private checkSensitiveTopics(message: string, sensitiveTopics: string[]): boolean {
    const lowerMessage = message.toLowerCase()
    return sensitiveTopics.some((topic) => lowerMessage.includes(topic.toLowerCase()))
  }

  private formatResponse(response: string, config: AIResponseConfig): string {
    let formatted = response.trim()

    // Remove excessive line breaks
    formatted = formatted.replace(/\n{3,}/g, "\n\n")

    // Truncate if too long (Instagram DM limit is 1000 characters)
    if (formatted.length > 900) {
      formatted = formatted.substring(0, 897) + "..."
    }

    return formatted
  }

  private extractUsedTools(response: any): string[] {
    const usedTools: string[] = []

    for (const block of response.content) {
      if (block.type === "tool_use") {
        usedTools.push(block.name)
      }
    }

    return usedTools
  }

  async logInteraction(conversationId: string, userMessage: string, aiResponse: string, metadata: any) {
    try {
      await prisma.aIInteraction.create({
        data: {
          conversationId,
          userMessage,
          aiResponse,
          sentiment: metadata.sentiment,
          confidence: metadata.confidence,
          shouldHandoff: metadata.shouldHandoff,
          usedFunctions: metadata.usedFunctions || [],
          metadata: metadata,
        },
      })
    } catch (error) {
      console.error("[AI] Failed to log interaction:", error)
    }
  }

  private async callDeepSeek(
    systemPrompt: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    currentMessage: string,
    config: AIResponseConfig,
  ): Promise<any> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: currentMessage },
          ],
          max_tokens: config.maxTokens || 2000,
          temperature: config.temperature || 0.7,
          stream: false,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const data = (await response.json()) as DeepSeekResponse

      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from DeepSeek")
      }

      return {
        content: [
          {
            type: "text",
            text: data.choices[0].message.content,
          },
        ],
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  private getFallbackResponse() {
    return {
      response:
        "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or I can connect you with a human team member.",
      shouldHandoff: true,
      confidence: 0.0,
      sentiment: "error",
      usedFunctions: [],
      carousel: undefined,
    }
  }
}

// Export singleton instance
export const aiResponseHandler = new AIResponseHandler()