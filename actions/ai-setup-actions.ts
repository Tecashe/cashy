// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// // Save business information
// export async function saveBusinessInfo(data: {
//   businessName: string
//   businessDescription: string
//   businessType?: string
//   businessIndustry?: string
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.user.update({
//     where: { id: user.id },
//     data: {
//       businessName: data.businessName,
//       businessDescription: data.businessDescription,
//       businessType: data.businessType,
//       businessIndustry: data.businessIndustry,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Save products
// export async function saveProducts(
//   products: Array<{
//     name: string
//     description: string // Made required to match Prisma schema
//     price: number
//     sku?: string
//     stock?: number
//     category?: string
//     imageUrl?: string
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.createMany({
//     data: products.map((p) => ({
//       userId: user.id,
//       name: p.name,
//       description: p.description,
//       price: p.price,
//       sku: p.sku,
//       stock: p.stock ?? 0,
//       category: p.category,
//       imageUrl: p.imageUrl,
//       isAvailable: true,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get user's products
// export async function getProducts() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const products = await prisma.product.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return products
// }

// // Delete product
// export async function deleteProduct(productId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.delete({
//     where: { id: productId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Save knowledge base documents
// export async function saveKnowledgeDocuments(
//   documents: Array<{
//     title: string
//     content: string
//     type: "faq" | "policy" | "product_info" | "general" // Changed from category to type to match schema
//     tags?: string[]
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.createMany({
//     data: documents.map((d) => ({
//       userId: user.id,
//       title: d.title,
//       content: d.content,
//       type: d.type,
//       tags: d.tags || [],
//       embedding: [], // Added required embedding field (empty array for now)
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get knowledge documents
// export async function getKnowledgeDocuments() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const documents = await prisma.knowledgeDocument.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return documents
// }

// // Delete knowledge document
// export async function deleteKnowledgeDocument(documentId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.delete({
//     where: { id: documentId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Save integrations
// export async function saveIntegration(data: {
//   name: string
//   type: string
//   config: any
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const integration = await prisma.integration.upsert({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: data.type,
//       },
//     },
//     create: {
//       userId: user.id,
//       name: data.name,
//       type: data.type,
//       config: data.config,
//       isActive: true,
//     },
//     update: {
//       name: data.name,
//       config: data.config,
//       isActive: true,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true, integration }
// }

// // Get integrations
// export async function getIntegrations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const integrations = await prisma.integration.findMany({
//     where: { userId: user.id },
//   })

//   return integrations
// }

// // Save AI configuration - THIS IS THE KEY CONNECTION
// export async function saveAIConfiguration(data: {
//   automationId?: string // Optional: If updating existing automation
//   automationName?: string // For new automations
//   instagramAccountId?: string
//   aiConfig: {
//     enableAI: boolean
//     enableCommerce: boolean
//     tone: string
//     systemPrompt?: string
//     aiInstructions?: string
//     enablePayments: boolean
//     enableProductCatalog: boolean
//     enableAppointments: boolean
//     maxOrderValue?: number
//     requirePaymentConfirmation: boolean
//     mcpEnabled: boolean
//     aiKnowledgeBase: boolean
//   }
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   if (data.automationId) {
//     // Update existing automation's AI action
//     const automation = await prisma.automation.findFirst({
//       where: { id: data.automationId, userId: user.id },
//       include: { actions: true },
//     })

//     if (!automation) throw new Error("Automation not found")

//     // Find AI response action
//     const aiAction = automation.actions.find((a) => a.type === "ai_response")

//     if (aiAction) {
//       // Update existing AI action
//       await prisma.automationAction.update({
//         where: { id: aiAction.id },
//         data: {
//           content: {
//             ...data.aiConfig,
//           },
//         },
//       })
//     } else {
//       // Create new AI action
//       await prisma.automationAction.create({
//         data: {
//           automationId: automation.id,
//           type: "ai_response",
//           content: {
//             ...data.aiConfig,
//           },
//           order: automation.actions.length,
//         },
//       })
//     }

//     revalidatePath("/automations")
//     revalidatePath(`/automations/${data.automationId}`)
//     return { success: true, automationId: data.automationId }
//   } else {
//     // Create new automation with AI action
//     const automation = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         name: data.automationName || "AI Auto-Reply",
//         description: "AI-powered automatic responses",
//         instagramAccountId: data.instagramAccountId,
//         status: "draft",
//         isActive: false,
//         triggers: {
//           create: {
//             type: "message_received",
//             conditions: {},
//             order: 0,
//           },
//         },
//         actions: {
//           create: {
//             type: "ai_response",
//             content: {
//               ...data.aiConfig,
//             },
//             order: 0,
//           },
//         },
//       },
//       include: {
//         triggers: true,
//         actions: true,
//       },
//     })

//     revalidatePath("/automations")
//     return { success: true, automationId: automation.id }
//   }
// }

// // Get AI configuration for an automation
// export async function getAIConfiguration(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       actions: {
//         where: { type: "ai_response" },
//       },
//     },
//   })

//   if (!automation || automation.actions.length === 0) return null

//   return automation.actions[0].content
// }

// // Complete AI setup and activate automation
// export async function completeAISetup(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Activate the automation
//   await prisma.automation.update({
//     where: { id: automationId, userId: user.id },
//     data: {
//       status: "active",
//       isActive: true,
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }





// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// // Save business information
// export async function saveBusinessInfo(data: {
//   businessName: string
//   businessDescription: string
//   businessType?: string
//   businessIndustry?: string
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.user.update({
//     where: { id: user.id },
//     data: {
//       businessName: data.businessName,
//       businessDescription: data.businessDescription,
//       businessType: data.businessType,
//       businessIndustry: data.businessIndustry,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Save products
// export async function saveProducts(
//   products: Array<{
//     name: string
//     description: string // Made required to match Prisma schema
//     price: number
//     sku?: string
//     stock?: number
//     category?: string
//     imageUrl?: string
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.createMany({
//     data: products.map((p) => ({
//       userId: user.id,
//       name: p.name,
//       description: p.description,
//       price: p.price,
//       sku: p.sku,
//       stock: p.stock ?? 0,
//       category: p.category,
//       imageUrl: p.imageUrl,
//       isAvailable: true,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get user's products
// export async function getProducts() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const products = await prisma.product.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return products
// }

// // Delete product
// export async function deleteProduct(productId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.delete({
//     where: { id: productId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Update product
// export async function updateProduct(
//   productId: string,
//   data: {
//     name?: string
//     description?: string
//     price?: number
//     sku?: string
//     stock?: number
//     category?: string
//     imageUrl?: string
//     isAvailable?: boolean
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const product = await prisma.product.update({
//     where: { id: productId, userId: user.id },
//     data,
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true, product }
// }

// // Get single product
// export async function getProduct(productId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const product = await prisma.product.findFirst({
//     where: { id: productId, userId: user.id },
//   })

//   return product
// }

// // Save knowledge base documents
// export async function saveKnowledgeDocuments(
//   documents: Array<{
//     title: string
//     content: string
//     type: "faq" | "policy" | "product_info" | "general" // Changed from category to type to match schema
//     tags?: string[]
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.createMany({
//     data: documents.map((d) => ({
//       userId: user.id,
//       title: d.title,
//       content: d.content,
//       type: d.type,
//       tags: d.tags || [],
//       embedding: [], // Added required embedding field (empty array for now)
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get knowledge documents
// export async function getKnowledgeDocuments() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const documents = await prisma.knowledgeDocument.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return documents
// }

// // Delete knowledge document
// export async function deleteKnowledgeDocument(documentId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.delete({
//     where: { id: documentId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Update knowledge document
// export async function updateKnowledgeDocument(
//   documentId: string,
//   data: {
//     title?: string
//     content?: string
//     type?: "faq" | "policy" | "product_info" | "general"
//     tags?: string[]
//     isActive?: boolean
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const document = await prisma.knowledgeDocument.update({
//     where: { id: documentId, userId: user.id },
//     data,
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true, document }
// }

// // Get single knowledge document
// export async function getKnowledgeDocument(documentId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const document = await prisma.knowledgeDocument.findFirst({
//     where: { id: documentId, userId: user.id },
//   })

//   return document
// }

// // Save integrations
// export async function saveIntegration(data: {
//   name: string
//   type: string
//   config: any
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const integration = await prisma.integration.upsert({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: data.type,
//       },
//     },
//     create: {
//       userId: user.id,
//       name: data.name,
//       type: data.type,
//       config: data.config,
//       isActive: true,
//     },
//     update: {
//       name: data.name,
//       config: data.config,
//       isActive: true,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true, integration }
// }

// // Get integrations
// export async function getIntegrations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const integrations = await prisma.integration.findMany({
//     where: { userId: user.id },
//   })

//   return integrations
// }

// // Delete integration
// export async function deleteIntegration(integrationType: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.integration.delete({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: integrationType,
//       },
//     },
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Toggle integration status
// export async function toggleIntegrationStatus(integrationType: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.integration.update({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: integrationType,
//       },
//     },
//     data: { isActive },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }

// // Save AI configuration - THIS IS THE KEY CONNECTION
// export async function saveAIConfiguration(data: {
//   automationId?: string // Optional: If updating existing automation
//   automationName?: string // For new automations
//   instagramAccountId?: string
//   aiConfig: {
//     enableAI: boolean
//     enableCommerce: boolean
//     tone: string
//     systemPrompt?: string
//     aiInstructions?: string
//     enablePayments: boolean
//     enableProductCatalog: boolean
//     enableAppointments: boolean
//     maxOrderValue?: number
//     requirePaymentConfirmation: boolean
//     mcpEnabled: boolean
//     aiKnowledgeBase: boolean
//   }
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   if (data.automationId) {
//     // Update existing automation's AI action
//     const automation = await prisma.automation.findFirst({
//       where: { id: data.automationId, userId: user.id },
//       include: { actions: true },
//     })

//     if (!automation) throw new Error("Automation not found")

//     // Find AI response action
//     const aiAction = automation.actions.find((a) => a.type === "ai_response")

//     if (aiAction) {
//       // Update existing AI action
//       await prisma.automationAction.update({
//         where: { id: aiAction.id },
//         data: {
//           content: {
//             ...data.aiConfig,
//           },
//         },
//       })
//     } else {
//       // Create new AI action
//       await prisma.automationAction.create({
//         data: {
//           automationId: automation.id,
//           type: "ai_response",
//           content: {
//             ...data.aiConfig,
//           },
//           order: automation.actions.length,
//         },
//       })
//     }

//     revalidatePath("/automations")
//     revalidatePath(`/automations/${data.automationId}`)
//     return { success: true, automationId: data.automationId }
//   } else {
//     // Create new automation with AI action
//     const automation = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         name: data.automationName || "AI Auto-Reply",
//         description: "AI-powered automatic responses",
//         instagramAccountId: data.instagramAccountId,
//         status: "draft",
//         isActive: false,
//         triggers: {
//           create: {
//             type: "message_received",
//             conditions: {},
//             order: 0,
//           },
//         },
//         actions: {
//           create: {
//             type: "ai_response",
//             content: {
//               ...data.aiConfig,
//             },
//             order: 0,
//           },
//         },
//       },
//       include: {
//         triggers: true,
//         actions: true,
//       },
//     })

//     revalidatePath("/automations")
//     return { success: true, automationId: automation.id }
//   }
// }

// // Get AI configuration for an automation
// export async function getAIConfiguration(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       actions: {
//         where: { type: "ai_response" },
//       },
//     },
//   })

//   if (!automation || automation.actions.length === 0) return null

//   return automation.actions[0].content
// }

// // Complete AI setup and activate automation
// export async function completeAISetup(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Activate the automation
//   await prisma.automation.update({
//     where: { id: automationId, userId: user.id },
//     data: {
//       status: "active",
//       isActive: true,
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }

// // Get business info
// export async function getBusinessInfo() {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     select: {
//       businessName: true,
//       businessDescription: true,
//       businessType: true,
//       businessIndustry: true,
//     },
//   })

//   return user
// }

// // Get or create default automation
// export async function getOrCreateDefaultAutomation() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   let automation = await prisma.automation.findFirst({
//     where: {
//       userId: user.id,
//       name: "AI Auto-Reply",
//     },
//     include: {
//       actions: {
//         where: { type: "ai_response" },
//       },
//     },
//   })

//   if (!automation) {
//     automation = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         name: "AI Auto-Reply",
//         description: "AI-powered automatic responses",
//         status: "draft",
//         isActive: false,
//         triggers: {
//           create: {
//             type: "message_received",
//             conditions: {},
//             order: 0,
//           },
//         },
//         actions: {
//           create: {
//             type: "ai_response",
//             content: {
//               enableAI: true,
//               enableCommerce: false,
//               tone: "professional",
//               enablePayments: false,
//               enableProductCatalog: false,
//               enableAppointments: false,
//               requirePaymentConfirmation: true,
//               mcpEnabled: false,
//               aiKnowledgeBase: true,
//               aiModel: "claude-sonnet-4",
//               aiProvider: "anthropic",
//             },
//             order: 0,
//           },
//         },
//       },
//       include: {
//         actions: {
//           where: { type: "ai_response" },
//         },
//       },
//     })
//   }

//   return automation
// }

// // Update AI configuration
// export async function updateAIConfig(automationId: string, config: any) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: { actions: { where: { type: "ai_response" } } },
//   })

//   if (!automation) throw new Error("Automation not found")

//   const aiAction = automation.actions[0]

//   await prisma.automationAction.update({
//     where: { id: aiAction.id },
//     data: { content: config },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }

// // Toggle AI status
// export async function toggleAIStatus(automationId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.automation.update({
//     where: { id: automationId, userId: user.id },
//     data: {
//       isActive,
//       status: isActive ? "active" : "paused",
//     },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }







// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// // Save business information
// export async function saveBusinessInfo(data: {
//   businessName: string
//   businessDescription: string
//   businessType?: string
//   businessIndustry?: string
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.user.update({
//     where: { id: user.id },
//     data: {
//       businessName: data.businessName,
//       businessDescription: data.businessDescription,
//       businessType: data.businessType,
//       businessIndustry: data.businessIndustry,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Save products
// export async function saveProducts(
//   products: Array<{
//     name: string
//     description: string
//     price: number
//     sku?: string
//     stock?: number
//     category?: string | null
//     images?: string[] // Added images array for carousel support
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.createMany({
//     data: products.map((p) => ({
//       userId: user.id,
//       name: p.name,
//       description: p.description,
//       price: p.price,
//       sku: p.sku,
//       stock: p.stock ?? 0,
//       category: p.category || null, // Explicitly convert undefined to null
//       images: p.images || [], // Support images array
//       isAvailable: true,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get user's products
// export async function getProducts() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const products = await prisma.product.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   // Return products with proper null handling (not converting to undefined)
//   return products
// }

// // Delete product
// export async function deleteProduct(productId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.product.delete({
//     where: { id: productId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Update product
// export async function updateProduct(
//   productId: string,
//   data: {
//     name?: string
//     description?: string
//     price?: number
//     sku?: string
//     stock?: number
//     category?: string | null
//     images?: string[] // Added images array support
//     isAvailable?: boolean
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const product = await prisma.product.update({
//     where: { id: productId, userId: user.id },
//     data: {
//       ...data,
//       category: data.category !== undefined ? data.category || null : undefined, // Handle null conversion
//     },
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true, product }
// }

// // Get single product
// export async function getProduct(productId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const product = await prisma.product.findFirst({
//     where: { id: productId, userId: user.id },
//   })

//   return product
// }

// // Save knowledge base documents
// export async function saveKnowledgeDocuments(
//   documents: Array<{
//     title: string
//     content: string
//     type: "faq" | "policy" | "product_info" | "general" // Changed from category to type to match schema
//     tags?: string[]
//   }>,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.createMany({
//     data: documents.map((d) => ({
//       userId: user.id,
//       title: d.title,
//       content: d.content,
//       type: d.type,
//       tags: d.tags || [],
//       embedding: [], // Added required embedding field (empty array for now)
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Get knowledge documents
// export async function getKnowledgeDocuments() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const documents = await prisma.knowledgeDocument.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   // Cast type to the specific union type expected by the component
//   return documents.map((doc) => ({
//     ...doc,
//     type: doc.type as "faq" | "policy" | "product_info" | "general",
//   }))
// }

// // Delete knowledge document
// export async function deleteKnowledgeDocument(documentId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.knowledgeDocument.delete({
//     where: { id: documentId, userId: user.id },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Update knowledge document
// export async function updateKnowledgeDocument(
//   documentId: string,
//   data: {
//     title?: string
//     content?: string
//     type?: "faq" | "policy" | "product_info" | "general"
//     tags?: string[]
//     isActive?: boolean
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const document = await prisma.knowledgeDocument.update({
//     where: { id: documentId, userId: user.id },
//     data,
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true, document }
// }

// // Get single knowledge document
// export async function getKnowledgeDocument(documentId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const document = await prisma.knowledgeDocument.findFirst({
//     where: { id: documentId, userId: user.id },
//   })

//   return document
// }

// // Save integrations
// export async function saveIntegration(data: {
//   name: string
//   type: string
//   config: any
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const integration = await prisma.integration.upsert({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: data.type,
//       },
//     },
//     create: {
//       userId: user.id,
//       name: data.name,
//       type: data.type,
//       config: data.config,
//       isActive: true,
//     },
//     update: {
//       name: data.name,
//       config: data.config,
//       isActive: true,
//     },
//   })

//   revalidatePath("/ai-setup")
//   return { success: true, integration }
// }

// // Get integrations
// export async function getIntegrations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const integrations = await prisma.integration.findMany({
//     where: { userId: user.id },
//   })

//   return integrations
// }

// // Delete integration
// export async function deleteIntegration(integrationType: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.integration.delete({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: integrationType,
//       },
//     },
//   })

//   revalidatePath("/ai-dashboard")
//   revalidatePath("/ai-setup")
//   return { success: true }
// }

// // Toggle integration status
// export async function toggleIntegrationStatus(integrationType: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.integration.update({
//     where: {
//       userId_type: {
//         userId: user.id,
//         type: integrationType,
//       },
//     },
//     data: { isActive },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }

// // Save AI configuration - THIS IS THE KEY CONNECTION
// export async function saveAIConfiguration(data: {
//   automationId?: string // Optional: If updating existing automation
//   automationName?: string // For new automations
//   instagramAccountId?: string
//   aiConfig: {
//     enableAI: boolean
//     enableCommerce: boolean
//     tone: string
//     systemPrompt?: string
//     aiInstructions?: string
//     enablePayments: boolean
//     enableProductCatalog: boolean
//     enableAppointments: boolean
//     maxOrderValue?: number
//     requirePaymentConfirmation: boolean
//     mcpEnabled: boolean
//     aiKnowledgeBase: boolean
//   }
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   if (data.automationId) {
//     // Update existing automation's AI action
//     const automation = await prisma.automation.findFirst({
//       where: { id: data.automationId, userId: user.id },
//       include: { actions: true },
//     })

//     if (!automation) throw new Error("Automation not found")

//     // Find AI response action
//     const aiAction = automation.actions.find((a) => a.type === "ai_response")

//     if (aiAction) {
//       // Update existing AI action
//       await prisma.automationAction.update({
//         where: { id: aiAction.id },
//         data: {
//           content: {
//             ...data.aiConfig,
//           },
//         },
//       })
//     } else {
//       // Create new AI action
//       await prisma.automationAction.create({
//         data: {
//           automationId: automation.id,
//           type: "ai_response",
//           content: {
//             ...data.aiConfig,
//           },
//           order: automation.actions.length,
//         },
//       })
//     }

//     revalidatePath("/automations")
//     revalidatePath(`/automations/${data.automationId}`)
//     return { success: true, automationId: data.automationId }
//   } else {
//     // Create new automation with AI action
//     const automation = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         name: data.automationName || "AI Auto-Reply",
//         description: "AI-powered automatic responses",
//         instagramAccountId: data.instagramAccountId,
//         status: "draft",
//         isActive: false,
//         triggers: {
//           create: {
//             type: "message_received",
//             conditions: {},
//             order: 0,
//           },
//         },
//         actions: {
//           create: {
//             type: "ai_response",
//             content: {
//               ...data.aiConfig,
//             },
//             order: 0,
//           },
//         },
//       },
//       include: {
//         triggers: true,
//         actions: true,
//       },
//     })

//     revalidatePath("/automations")
//     return { success: true, automationId: automation.id }
//   }
// }

// // Get AI configuration for an automation
// export async function getAIConfiguration(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return null

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       actions: {
//         where: { type: "ai_response" },
//       },
//     },
//   })

//   if (!automation || automation.actions.length === 0) return null

//   return automation.actions[0].content
// }

// // Complete AI setup and activate automation
// export async function completeAISetup(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Activate the automation
//   await prisma.automation.update({
//     where: { id: automationId, userId: user.id },
//     data: {
//       status: "active",
//       isActive: true,
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }

// // Get business info
// export async function getBusinessInfo() {
//   const { userId } = await auth()
//   if (!userId) return null

//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     select: {
//       businessName: true,
//       businessDescription: true,
//       businessType: true,
//       businessIndustry: true,
//     },
//   })

//   return user
// }

// // Get or create default automation
// export async function getOrCreateDefaultAutomation() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   let automation = await prisma.automation.findFirst({
//     where: {
//       userId: user.id,
//       name: "AI Auto-Reply",
//     },
//     include: {
//       actions: {
//         where: { type: "ai_response" },
//       },
//     },
//   })

//   if (!automation) {
//     automation = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         name: "AI Auto-Reply",
//         description: "AI-powered automatic responses",
//         status: "draft",
//         isActive: false,
//         triggers: {
//           create: {
//             type: "message_received",
//             conditions: {},
//             order: 0,
//           },
//         },
//         actions: {
//           create: {
//             type: "ai_response",
//             content: {
//               enableAI: true,
//               enableCommerce: false,
//               tone: "professional",
//               enablePayments: false,
//               enableProductCatalog: false,
//               enableAppointments: false,
//               requirePaymentConfirmation: true,
//               mcpEnabled: false,
//               aiKnowledgeBase: true,
//               aiModel: "claude-sonnet-4",
//               aiProvider: "anthropic",
//             },
//             order: 0,
//           },
//         },
//       },
//       include: {
//         actions: {
//           where: { type: "ai_response" },
//         },
//       },
//     })
//   }

//   return automation
// }

// // Update AI configuration
// export async function updateAIConfig(automationId: string, config: any) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: { actions: { where: { type: "ai_response" } } },
//   })

//   if (!automation) throw new Error("Automation not found")

//   const aiAction = automation.actions[0]

//   await prisma.automationAction.update({
//     where: { id: aiAction.id },
//     data: { content: config },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }

// // Toggle AI status
// export async function toggleAIStatus(automationId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.automation.update({
//     where: { id: automationId, userId: user.id },
//     data: {
//       isActive,
//       status: isActive ? "active" : "paused",
//     },
//   })

//   revalidatePath("/ai-dashboard")
//   return { success: true }
// }









"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Save business information
export async function saveBusinessInfo(data: {
  businessName: string
  businessDescription: string
  businessType?: string
  businessIndustry?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.user.update({
    where: { id: user.id },
    data: {
      businessName: data.businessName,
      businessDescription: data.businessDescription,
      businessType: data.businessType,
      businessIndustry: data.businessIndustry,
    },
  })

  revalidatePath("/ai-setup")
  return { success: true }
}

// Save products
export async function saveProducts(
  products: Array<{
    name: string
    description: string
    price: number
    sku?: string
    stock?: number
    category?: string | null
    images?: string[] // Added images array for carousel support
  }>,
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.product.createMany({
    data: products.map((p) => ({
      userId: user.id,
      name: p.name,
      description: p.description,
      price: p.price,
      sku: p.sku,
      stock: p.stock ?? 0,
      category: p.category || null, // Explicitly convert undefined to null
      images: p.images || [], // Support images array
      isAvailable: true,
    })),
    skipDuplicates: true,
  })

  revalidatePath("/ai-setup")
  return { success: true }
}

// Get user's products
export async function getProducts() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  // Return products with proper null handling (not converting to undefined)
  return products
}

// Delete product
export async function deleteProduct(productId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.product.delete({
    where: { id: productId, userId: user.id },
  })

  revalidatePath("/ai-setup")
  return { success: true }
}

// Update product
export async function updateProduct(
  productId: string,
  data: {
    name?: string
    description?: string
    price?: number
    sku?: string
    stock?: number
    category?: string | null
    images?: string[] // Added images array support
    isAvailable?: boolean
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const product = await prisma.product.update({
    where: { id: productId, userId: user.id },
    data: {
      ...data,
      category: data.category !== undefined ? data.category || null : undefined, // Handle null conversion
    },
  })

  revalidatePath("/ai-dashboard")
  revalidatePath("/ai-setup")
  return { success: true, product }
}

// Get single product
export async function getProduct(productId: string) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return null

  const product = await prisma.product.findFirst({
    where: { id: productId, userId: user.id },
  })

  return product
}

// Save knowledge base documents
export async function saveKnowledgeDocuments(
  documents: Array<{
    title: string
    content: string
    type: "faq" | "policy" | "product_info" | "general" // Changed from category to type to match schema
    tags?: string[]
  }>,
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.knowledgeDocument.createMany({
    data: documents.map((d) => ({
      userId: user.id,
      title: d.title,
      content: d.content,
      type: d.type,
      tags: d.tags || [],
      embedding: [], // Added required embedding field (empty array for now)
    })),
    skipDuplicates: true,
  })

  revalidatePath("/ai-setup")
  return { success: true }
}

// Get knowledge documents
export async function getKnowledgeDocuments() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const documents = await prisma.knowledgeDocument.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  // Cast type to the specific union type expected by the component
  return documents.map((doc) => ({
    ...doc,
    type: doc.type as "faq" | "policy" | "product_info" | "general",
  }))
}

// Delete knowledge document
export async function deleteKnowledgeDocument(documentId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.knowledgeDocument.delete({
    where: { id: documentId, userId: user.id },
  })

  revalidatePath("/ai-setup")
  return { success: true }
}

// Update knowledge document
export async function updateKnowledgeDocument(
  documentId: string,
  data: {
    title?: string
    content?: string
    type?: "faq" | "policy" | "product_info" | "general"
    tags?: string[]
    isActive?: boolean
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const document = await prisma.knowledgeDocument.update({
    where: { id: documentId, userId: user.id },
    data,
  })

  revalidatePath("/ai-dashboard")
  revalidatePath("/ai-setup")
  return { success: true, document }
}

// Get single knowledge document
export async function getKnowledgeDocument(documentId: string) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return null

  const document = await prisma.knowledgeDocument.findFirst({
    where: { id: documentId, userId: user.id },
  })

  return document
}

// Save integrations
export async function saveIntegration(data: {
  name: string
  type: string
  config: any
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const integration = await prisma.integration.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: data.type,
      },
    },
    create: {
      userId: user.id,
      name: data.name,
      type: data.type,
      config: data.config,
      isActive: true,
    },
    update: {
      name: data.name,
      config: data.config,
      isActive: true,
    },
  })

  revalidatePath("/ai-setup")
  return { success: true, integration }
}

// Get integrations
export async function getIntegrations() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const integrations = await prisma.integration.findMany({
    where: { userId: user.id },
  })

  return integrations
}

// Create integration
export async function createIntegration(data: {
  name: string
  type: string
  config: any
  isActive?: boolean
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const integration = await prisma.integration.create({
    data: {
      userId: user.id,
      name: data.name,
      type: data.type,
      config: data.config,
      isActive: data.isActive ?? true,
    },
  })

  revalidatePath("/ai-dashboard")
  revalidatePath("/ai-setup")
  return { success: true, integration }
}

// Update integration
export async function updateIntegration(
  integrationId: string,
  data: {
    name?: string
    config?: any
    isActive?: boolean
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

 function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// First fetch the existing integration
const existing = await prisma.integration.findUnique({
  where: { id: integrationId },
  select: { config: true },
});

const integration = await prisma.integration.update({
  where: { id: integrationId },
  data: {
    ...data,
    config: data.config
      ? {
          ...(isObject(existing?.config) ? existing.config : {}),
          ...data.config,
        }
      : undefined,
  },
});

  revalidatePath("/ai-dashboard")
  revalidatePath("/ai-setup")
  return { success: true, integration }
}

// Delete integration
export async function deleteIntegration(integrationType: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.integration.delete({
    where: {
      userId_type: {
        userId: user.id,
        type: integrationType,
      },
    },
  })

  revalidatePath("/ai-dashboard")
  revalidatePath("/ai-setup")
  return { success: true }
}

// Toggle integration status
export async function toggleIntegrationStatus(integrationType: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.integration.update({
    where: {
      userId_type: {
        userId: user.id,
        type: integrationType,
      },
    },
    data: { isActive },
  })

  revalidatePath("/ai-dashboard")
  return { success: true }
}

// Save AI configuration - THIS IS THE KEY CONNECTION
export async function saveAIConfiguration(data: {
  automationId?: string // Optional: If updating existing automation
  automationName?: string // For new automations
  instagramAccountId?: string
  aiConfig: {
    enableAI: boolean
    enableCommerce: boolean
    tone: string
    systemPrompt?: string
    aiInstructions?: string
    enablePayments: boolean
    enableProductCatalog: boolean
    enableAppointments: boolean
    maxOrderValue?: number
    requirePaymentConfirmation: boolean
    mcpEnabled: boolean
    aiKnowledgeBase: boolean
  }
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  if (data.automationId) {
    // Update existing automation's AI action
    const automation = await prisma.automation.findFirst({
      where: { id: data.automationId, userId: user.id },
      include: { actions: true },
    })

    if (!automation) throw new Error("Automation not found")

    // Find AI response action
    const aiAction = automation.actions.find((a) => a.type === "ai_response")

    if (aiAction) {
      // Update existing AI action
      await prisma.automationAction.update({
        where: { id: aiAction.id },
        data: {
          content: {
            ...data.aiConfig,
          },
        },
      })
    } else {
      // Create new AI action
      await prisma.automationAction.create({
        data: {
          automationId: automation.id,
          type: "ai_response",
          content: {
            ...data.aiConfig,
          },
          order: automation.actions.length,
        },
      })
    }

    revalidatePath("/automations")
    revalidatePath(`/automations/${data.automationId}`)
    return { success: true, automationId: data.automationId }
  } else {
    // Create new automation with AI action
    const automation = await prisma.automation.create({
      data: {
        userId: user.id,
        name: data.automationName || "AI Auto-Reply",
        description: "AI-powered automatic responses",
        instagramAccountId: data.instagramAccountId,
        status: "draft",
        isActive: false,
        triggers: {
          create: {
            type: "message_received",
            conditions: {},
            order: 0,
          },
        },
        actions: {
          create: {
            type: "ai_response",
            content: {
              ...data.aiConfig,
            },
            order: 0,
          },
        },
      },
      include: {
        triggers: true,
        actions: true,
      },
    })

    revalidatePath("/automations")
    return { success: true, automationId: automation.id }
  }
}

// Get AI configuration for an automation
export async function getAIConfiguration(automationId: string) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return null

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: {
      actions: {
        where: { type: "ai_response" },
      },
    },
  })

  if (!automation || automation.actions.length === 0) return null

  return automation.actions[0].content
}

// Complete AI setup and activate automation
export async function completeAISetup(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Activate the automation
  await prisma.automation.update({
    where: { id: automationId, userId: user.id },
    data: {
      status: "active",
      isActive: true,
    },
  })

  revalidatePath("/automations")
  revalidatePath("/dashboard")
  return { success: true }
}

// Get business info
export async function getBusinessInfo() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      businessName: true,
      businessDescription: true,
      businessType: true,
      businessIndustry: true,
    },
  })

  return user
}

// Get or create default automation
export async function getOrCreateDefaultAutomation() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  let automation = await prisma.automation.findFirst({
    where: {
      userId: user.id,
      name: "AI Auto-Reply",
    },
    include: {
      actions: {
        where: { type: "ai_response" },
      },
    },
  })

  if (!automation) {
    automation = await prisma.automation.create({
      data: {
        userId: user.id,
        name: "AI Auto-Reply",
        description: "AI-powered automatic responses",
        status: "draft",
        isActive: false,
        triggers: {
          create: {
            type: "message_received",
            conditions: {},
            order: 0,
          },
        },
        actions: {
          create: {
            type: "ai_response",
            content: {
              enableAI: true,
              enableCommerce: false,
              tone: "professional",
              enablePayments: false,
              enableProductCatalog: false,
              enableAppointments: false,
              requirePaymentConfirmation: true,
              mcpEnabled: false,
              aiKnowledgeBase: true,
              aiModel: "claude-sonnet-4",
              aiProvider: "anthropic",
            },
            order: 0,
          },
        },
      },
      include: {
        actions: {
          where: { type: "ai_response" },
        },
      },
    })
  }

  return automation
}

// Update AI configuration
export async function updateAIConfig(automationId: string, config: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: { actions: { where: { type: "ai_response" } } },
  })

  if (!automation) throw new Error("Automation not found")

  const aiAction = automation.actions[0]

  await prisma.automationAction.update({
    where: { id: aiAction.id },
    data: { content: config },
  })

  revalidatePath("/ai-dashboard")
  return { success: true }
}

// Toggle AI status
export async function toggleAIStatus(automationId: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.automation.update({
    where: { id: automationId, userId: user.id },
    data: {
      isActive,
      status: isActive ? "active" : "paused",
    },
  })

  revalidatePath("/ai-dashboard")
  return { success: true }
}
