// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Bot, Package, Brain, Settings, Plug, Play, Pause, Loader2 } from "lucide-react"
// import { ProductsTab } from "./tabs/products-tab"
// import { KnowledgeBaseTab } from "./tabs/knowledge-base-tab"
// import { AIConfigTab } from "./tabs/ai-config-tab"
// import { IntegrationsTab } from "./tabs/integrations-tab"
// import { OverviewTab } from "./tabs/overview-tab"
// import {
//   getProducts,
//   getKnowledgeDocuments,
//   getIntegrations,
//   getOrCreateDefaultAutomation,
//   toggleAIStatus,
// } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// export function AIDashboard() {
//   const [isAIActive, setIsAIActive] = useState(false)
//   const [automationId, setAutomationId] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [toggling, setToggling] = useState(false)
//   const { toast } = useToast()

//   const [stats, setStats] = useState({
//     products: 0,
//     knowledgeDocs: 0,
//     activeIntegrations: 0,
//   })

//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [products, knowledgeDocs, integrations, automation] = await Promise.all([
//         getProducts(),
//         getKnowledgeDocuments(),
//         getIntegrations(),
//         getOrCreateDefaultAutomation(),
//       ])

//       setStats({
//         products: products.length,
//         knowledgeDocs: knowledgeDocs.length,
//         activeIntegrations: integrations.filter((i) => i.isActive).length,
//       })

//       setAutomationId(automation.id)
//       setIsAIActive(automation.isActive)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load dashboard data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleAI = async () => {
//     if (!automationId) return

//     try {
//       setToggling(true)
//       await toggleAIStatus(automationId, !isAIActive)
//       setIsAIActive(!isAIActive)

//       toast({
//         title: isAIActive ? "AI Paused" : "AI Activated",
//         description: isAIActive
//           ? "Your AI assistant is now paused and won't respond to messages"
//           : "Your AI assistant is now active and responding to messages",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to toggle AI status",
//         variant: "destructive",
//       })
//     } finally {
//       setToggling(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold mb-2">AI Assistant Dashboard</h1>
//           <p className="text-muted-foreground text-lg">Manage your AI configuration and view performance</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Badge variant={isAIActive ? "default" : "secondary"} className="text-sm px-4 py-2">
//             {isAIActive ? (
//               <>
//                 <Play className="h-4 w-4 mr-2" />
//                 Active
//               </>
//             ) : (
//               <>
//                 <Pause className="h-4 w-4 mr-2" />
//                 Paused
//               </>
//             )}
//           </Badge>
//           <Button onClick={toggleAI} variant={isAIActive ? "destructive" : "default"} size="lg" disabled={toggling}>
//             {toggling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//             {isAIActive ? "Pause AI" : "Activate AI"}
//           </Button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Products</p>
//                 <p className="text-3xl font-bold">{stats.products}</p>
//               </div>
//               <Package className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Knowledge Docs</p>
//                 <p className="text-3xl font-bold">{stats.knowledgeDocs}</p>
//               </div>
//               <Brain className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Integrations</p>
//                 <p className="text-3xl font-bold">{stats.activeIntegrations}</p>
//               </div>
//               <Plug className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Tabs */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview" className="gap-2">
//             <Bot className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="products" className="gap-2">
//             <Package className="h-4 w-4" />
//             Products
//           </TabsTrigger>
//           <TabsTrigger value="knowledge" className="gap-2">
//             <Brain className="h-4 w-4" />
//             Knowledge
//           </TabsTrigger>
//           <TabsTrigger value="config" className="gap-2">
//             <Settings className="h-4 w-4" />
//             AI Config
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="gap-2">
//             <Plug className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <OverviewTab automationId={automationId} stats={stats} onRefresh={loadDashboardData} />
//         </TabsContent>

//         <TabsContent value="products">
//           <ProductsTab onUpdate={loadDashboardData} />
//         </TabsContent>

//         <TabsContent value="knowledge">
//           <KnowledgeBaseTab onUpdate={loadDashboardData} />
//         </TabsContent>

//         <TabsContent value="config">
//           <AIConfigTab automationId={automationId} />
//         </TabsContent>

//         <TabsContent value="integrations">
//           <IntegrationsTab onUpdate={loadDashboardData} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Bot, Package, Brain, Settings, Plug, Play, Pause, Loader2 } from "lucide-react"
// import { ProductsTab } from "./tabs/products-tab"
// import { KnowledgeBaseTab } from "./tabs/knowledge-base-tab"
// import { AIConfigTab } from "./tabs/ai-config-tab"
// import { IntegrationsTab } from "./tabs/integrations-tab"
// import { OverviewTab } from "./tabs/overview-tab"
// import {
//   getProducts,
//   getKnowledgeDocuments,
//   getIntegrations,
//   getOrCreateDefaultAutomation,
//   toggleAIStatus,
// } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// export function AIDashboard() {
//   const [isAIActive, setIsAIActive] = useState(false)
//   const [automationId, setAutomationId] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [toggling, setToggling] = useState(false)
//   const { toast } = useToast()

//   const [stats, setStats] = useState({
//     products: 0,
//     knowledgeDocs: 0,
//     activeIntegrations: 0,
//   })

//   const [activeTab, setActiveTab] = useState("overview")

//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [products, knowledgeDocs, integrations, automation] = await Promise.all([
//         getProducts(),
//         getKnowledgeDocuments(),
//         getIntegrations(),
//         getOrCreateDefaultAutomation(),
//       ])

//       setStats({
//         products: products.length,
//         knowledgeDocs: knowledgeDocs.length,
//         activeIntegrations: integrations.filter((i) => i.isActive).length,
//       })

//       setAutomationId(automation.id)
//       setIsAIActive(automation.isActive)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load dashboard data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateStats = async () => {
//     try {
//       const [products, knowledgeDocs, integrations] = await Promise.all([
//         getProducts(),
//         getKnowledgeDocuments(),
//         getIntegrations(),
//       ])

//       setStats({
//         products: products.length,
//         knowledgeDocs: knowledgeDocs.length,
//         activeIntegrations: integrations.filter((i) => i.isActive).length,
//       })
//     } catch (error) {
//       // Silent fail for stats update
//     }
//   }

//   const toggleAI = async () => {
//     if (!automationId) return

//     try {
//       setToggling(true)
//       await toggleAIStatus(automationId, !isAIActive)
//       setIsAIActive(!isAIActive)

//       toast({
//         title: isAIActive ? "AI Paused" : "AI Activated",
//         description: isAIActive
//           ? "Your AI assistant is now paused and won't respond to messages"
//           : "Your AI assistant is now active and responding to messages",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to toggle AI status",
//         variant: "destructive",
//       })
//     } finally {
//       setToggling(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold mb-2">AI Assistant Dashboard</h1>
//           <p className="text-muted-foreground text-lg">Manage your AI configuration and view performance</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Badge variant={isAIActive ? "default" : "secondary"} className="text-sm px-4 py-2">
//             {isAIActive ? (
//               <>
//                 <Play className="h-4 w-4 mr-2" />
//                 Active
//               </>
//             ) : (
//               <>
//                 <Pause className="h-4 w-4 mr-2" />
//                 Paused
//               </>
//             )}
//           </Badge>
//           <Button onClick={toggleAI} variant={isAIActive ? "destructive" : "default"} size="lg" disabled={toggling}>
//             {toggling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//             {isAIActive ? "Pause AI" : "Activate AI"}
//           </Button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Products</p>
//                 <p className="text-3xl font-bold">{stats.products}</p>
//               </div>
//               <Package className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Knowledge Docs</p>
//                 <p className="text-3xl font-bold">{stats.knowledgeDocs}</p>
//               </div>
//               <Brain className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Integrations</p>
//                 <p className="text-3xl font-bold">{stats.activeIntegrations}</p>
//               </div>
//               <Plug className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview" className="gap-2">
//             <Bot className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="products" className="gap-2">
//             <Package className="h-4 w-4" />
//             Products
//           </TabsTrigger>
//           <TabsTrigger value="knowledge" className="gap-2">
//             <Brain className="h-4 w-4" />
//             Knowledge
//           </TabsTrigger>
//           <TabsTrigger value="config" className="gap-2">
//             <Settings className="h-4 w-4" />
//             AI Config
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="gap-2">
//             <Plug className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <OverviewTab automationId={automationId} stats={stats} onRefresh={loadDashboardData} />
//         </TabsContent>

//         <TabsContent value="products">
//           <ProductsTab onUpdate={updateStats} />
//         </TabsContent>

//         <TabsContent value="knowledge">
//           <KnowledgeBaseTab onUpdate={updateStats} />
//         </TabsContent>

//         <TabsContent value="config">
//           <AIConfigTab automationId={automationId} />
//         </TabsContent>

//         <TabsContent value="integrations">
//           <IntegrationsTab onUpdate={updateStats} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Bot, Package, Brain, Settings, Plug, Play, Pause, Loader2 } from "lucide-react"
// import { ProductsTab } from "./tabs/products-tab"
// import { KnowledgeBaseTab } from "./tabs/knowledge-base-tab"
// import { AIConfigTab } from "./tabs/ai-config-tab"
// import { IntegrationsTab } from "./tabs/integrations-tab"
// import { OverviewTab } from "./tabs/overview-tab"
// import { TestingTab } from "./tabs/testing-tab"
// import {
//   getProducts,
//   getKnowledgeDocuments,
//   getIntegrations,
//   getOrCreateDefaultAutomation,
//   toggleAIStatus,
// } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// export function AIDashboard() {
//   const [isAIActive, setIsAIActive] = useState(false)
//   const [automationId, setAutomationId] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [toggling, setToggling] = useState(false)
//   const { toast } = useToast()

//   const [stats, setStats] = useState({
//     products: 0,
//     knowledgeDocs: 0,
//     activeIntegrations: 0,
//   })

//   const [activeTab, setActiveTab] = useState("overview")

//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [products, knowledgeDocs, integrations, automation] = await Promise.all([
//         getProducts(),
//         getKnowledgeDocuments(),
//         getIntegrations(),
//         getOrCreateDefaultAutomation(),
//       ])

//       setStats({
//         products: products.length,
//         knowledgeDocs: knowledgeDocs.length,
//         activeIntegrations: integrations.filter((i) => i.isActive).length,
//       })

//       setAutomationId(automation.id)
//       setIsAIActive(automation.isActive)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load dashboard data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateStats = async () => {
//     try {
//       const [products, knowledgeDocs, integrations] = await Promise.all([
//         getProducts(),
//         getKnowledgeDocuments(),
//         getIntegrations(),
//       ])

//       setStats({
//         products: products.length,
//         knowledgeDocs: knowledgeDocs.length,
//         activeIntegrations: integrations.filter((i) => i.isActive).length,
//       })
//     } catch (error) {
//       // Silent fail for stats update
//     }
//   }

//   const toggleAI = async () => {
//     if (!automationId) return

//     try {
//       setToggling(true)
//       await toggleAIStatus(automationId, !isAIActive)
//       setIsAIActive(!isAIActive)

//       toast({
//         title: isAIActive ? "AI Paused" : "AI Activated",
//         description: isAIActive
//           ? "Your AI assistant is now paused and won't respond to messages"
//           : "Your AI assistant is now active and responding to messages",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to toggle AI status",
//         variant: "destructive",
//       })
//     } finally {
//       setToggling(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold mb-2">AI Assistant Dashboard</h1>
//           <p className="text-muted-foreground text-lg">Manage your AI configuration and view performance</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Badge variant={isAIActive ? "default" : "secondary"} className="text-sm px-4 py-2">
//             {isAIActive ? (
//               <>
//                 <Play className="h-4 w-4 mr-2" />
//                 Active
//               </>
//             ) : (
//               <>
//                 <Pause className="h-4 w-4 mr-2" />
//                 Paused
//               </>
//             )}
//           </Badge>
//           <Button onClick={toggleAI} variant={isAIActive ? "destructive" : "default"} size="lg" disabled={toggling}>
//             {toggling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//             {isAIActive ? "Pause AI" : "Activate AI"}
//           </Button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Products</p>
//                 <p className="text-3xl font-bold">{stats.products}</p>
//               </div>
//               <Package className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Knowledge Docs</p>
//                 <p className="text-3xl font-bold">{stats.knowledgeDocs}</p>
//               </div>
//               <Brain className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Integrations</p>
//                 <p className="text-3xl font-bold">{stats.activeIntegrations}</p>
//               </div>
//               <Plug className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="overview" className="gap-2">
//             <Bot className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="products" className="gap-2">
//             <Package className="h-4 w-4" />
//             Products
//           </TabsTrigger>
//           <TabsTrigger value="knowledge" className="gap-2">
//             <Brain className="h-4 w-4" />
//             Knowledge
//           </TabsTrigger>
//           <TabsTrigger value="config" className="gap-2">
//             <Settings className="h-4 w-4" />
//             AI Config
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="gap-2">
//             <Plug className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//           <TabsTrigger value="testing" className="gap-2">
//             <Play className="h-4 w-4" />
//             Testing
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <OverviewTab automationId={automationId} stats={stats} onRefresh={loadDashboardData} />
//         </TabsContent>

//         <TabsContent value="products">
//           <ProductsTab onUpdate={updateStats} />
//         </TabsContent>

//         <TabsContent value="knowledge">
//           <KnowledgeBaseTab onUpdate={updateStats} />
//         </TabsContent>

//         <TabsContent value="config">
//           <AIConfigTab automationId={automationId} />
//         </TabsContent>

//         <TabsContent value="integrations">
//           <IntegrationsTab onUpdate={updateStats} />
//         </TabsContent>

//         <TabsContent value="testing">
//           <TestingTab automationId={automationId} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Package, Brain, Settings, Plug, Play, Pause, Loader2, Lock } from "lucide-react"
import { UpsellCard } from "@/components/feature-gate/upsell-card"
import { hasAccess } from "@/lib/features"
import { ProductsTab } from "./tabs/products-tab"
import { KnowledgeBaseTab } from "./tabs/knowledge-base-tab"
import { AIConfigTab } from "./tabs/ai-config-tab"
import { IntegrationsTab } from "./tabs/integrations-tab"
import { OverviewTab } from "./tabs/overview-tab"
import { TestingTab } from "./tabs/testing-tab"

interface AIDashboardGatedProps {
  isAIActive: boolean
  automationId: string | null
  stats: any
  userTier: "free" | "pro" | "enterprise"
  onToggleAI: () => void
  onLoadDashboard: () => void
  toggling: boolean
  loading: boolean
}

export function AIDashboardGated({
  isAIActive,
  automationId,
  stats,
  userTier,
  onToggleAI,
  onLoadDashboard,
  toggling,
  loading,
}: AIDashboardGatedProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const canUseAI = hasAccess(userTier, "aiAssistant")
  const canUseKnowledge = hasAccess(userTier, "knowledgeBase")
  const canConfigure = hasAccess(userTier, "aiConfiguration")
  const canIntegrate = hasAccess(userTier, "advancedIntegrations")
  const canTest = hasAccess(userTier, "aiTesting")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!canUseAI) {
    return (
      <div className="space-y-6">
        <UpsellCard
          featureName="AI Assistant"
          description="Deploy a powerful AI assistant to handle customer conversations automatically"
          requiredTier="pro"
          currentTier={userTier}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Assistant Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your AI configuration and view performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isAIActive ? "default" : "secondary"} className="text-sm px-4 py-2">
            {isAIActive ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Active
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Paused
              </>
            )}
          </Badge>
          <Button onClick={onToggleAI} variant={isAIActive ? "destructive" : "default"} size="lg" disabled={toggling}>
            {toggling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isAIActive ? "Pause AI" : "Activate AI"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-3xl font-bold">{stats.products}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Knowledge Docs</p>
                <p className="text-3xl font-bold">{stats.knowledgeDocs}</p>
              </div>
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Integrations</p>
                <p className="text-3xl font-bold">{stats.activeIntegrations}</p>
              </div>
              <Plug className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <Bot className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2 relative">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2" disabled={!canUseKnowledge}>
            <Brain className="h-4 w-4" />
            Knowledge
            {!canUseKnowledge && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2" disabled={!canConfigure}>
            <Settings className="h-4 w-4" />
            AI Config
            {!canConfigure && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2" disabled={!canIntegrate}>
            <Plug className="h-4 w-4" />
            Integrations
            {!canIntegrate && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="testing" className="gap-2" disabled={!canTest}>
            <Play className="h-4 w-4" />
            Testing
            {!canTest && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab automationId={automationId} stats={stats} onRefresh={onLoadDashboard} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab onUpdate={onLoadDashboard} />
        </TabsContent>

        <TabsContent value="knowledge">
          {canUseKnowledge ? (
            <KnowledgeBaseTab onUpdate={onLoadDashboard} />
          ) : (
            <UpsellCard
              featureName="Knowledge Base"
              description="Create a knowledge base so your AI can answer questions about your business"
              requiredTier="pro"
              currentTier={userTier}
            />
          )}
        </TabsContent>

        <TabsContent value="config">
          {canConfigure ? (
            <AIConfigTab automationId={automationId} />
          ) : (
            <UpsellCard
              featureName="Advanced AI Configuration"
              description="Customize your AI's personality, tone, and behavior with advanced settings"
              requiredTier="pro"
              currentTier={userTier}
            />
          )}
        </TabsContent>

        <TabsContent value="integrations">
          {canIntegrate ? (
            <IntegrationsTab onUpdate={onLoadDashboard} />
          ) : (
            <UpsellCard
              featureName="Advanced Integrations"
              description="Connect Stripe, Shopify, WooCommerce, and more for full commerce automation"
              requiredTier="enterprise"
              currentTier={userTier}
            />
          )}
        </TabsContent>

        <TabsContent value="testing">
          {canTest ? (
            <TestingTab automationId={automationId} />
          ) : (
            <UpsellCard
              featureName="Advanced Testing"
              description="Test your AI with production API keys before going live"
              requiredTier="pro"
              currentTier={userTier}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
