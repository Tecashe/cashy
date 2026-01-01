// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

// export function IntegrationsTab() {
//   const integrations = [
//     {
//       id: "anthropic",
//       name: "Anthropic Claude",
//       description: "AI model provider (Required)",
//       isConnected: true,
//       isRequired: true,
//     },
//     {
//       id: "stripe",
//       name: "Stripe Payments",
//       description: "Process payments and create payment links",
//       isConnected: true,
//       isRequired: false,
//     },
//     {
//       id: "google_calendar",
//       name: "Google Calendar",
//       description: "Schedule appointments and manage bookings",
//       isConnected: false,
//       isRequired: false,
//     },
//     {
//       id: "mcp",
//       name: "MCP Servers",
//       description: "Extended AI capabilities via Model Context Protocol",
//       isConnected: false,
//       isRequired: false,
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Connected Services</CardTitle>
//           <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
//         </CardHeader>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {integrations.map((integration) => (
//           <Card key={integration.id}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <CardTitle className="text-lg">{integration.name}</CardTitle>
//                     {integration.isRequired && (
//                       <Badge variant="destructive" className="text-xs">
//                         Required
//                       </Badge>
//                     )}
//                   </div>
//                   <CardDescription>{integration.description}</CardDescription>
//                 </div>
//                 {integration.isConnected ? (
//                   <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between">
//                 <Badge
//                   variant={integration.isConnected ? "default" : "secondary"}
//                   className={integration.isConnected ? "bg-green-600" : ""}
//                 >
//                   {integration.isConnected ? "Connected" : "Not Connected"}
//                 </Badge>
//                 <Button variant="outline" size="sm">
//                   {integration.isConnected ? "Manage" : "Connect"}
//                   <ExternalLink className="h-3 w-3 ml-2" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

// export function IntegrationsTab({ onUpdate }: { onUpdate?: () => void }) {
//   const integrations = [
//     {
//       id: "anthropic",
//       name: "Anthropic Claude",
//       description: "AI model provider (Required)",
//       isConnected: true,
//       isRequired: true,
//     },
//     {
//       id: "stripe",
//       name: "Stripe Payments",
//       description: "Process payments and create payment links",
//       isConnected: true,
//       isRequired: false,
//     },
//     {
//       id: "google_calendar",
//       name: "Google Calendar",
//       description: "Schedule appointments and manage bookings",
//       isConnected: false,
//       isRequired: false,
//     },
//     {
//       id: "mcp",
//       name: "MCP Servers",
//       description: "Extended AI capabilities via Model Context Protocol",
//       isConnected: false,
//       isRequired: false,
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Connected Services</CardTitle>
//           <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
//         </CardHeader>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {integrations.map((integration) => (
//           <Card key={integration.id}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <CardTitle className="text-lg">{integration.name}</CardTitle>
//                     {integration.isRequired && (
//                       <Badge variant="destructive" className="text-xs">
//                         Required
//                       </Badge>
//                     )}
//                   </div>
//                   <CardDescription>{integration.description}</CardDescription>
//                 </div>
//                 {integration.isConnected ? (
//                   <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between">
//                 <Badge
//                   variant={integration.isConnected ? "default" : "secondary"}
//                   className={integration.isConnected ? "bg-green-600" : ""}
//                 >
//                   {integration.isConnected ? "Connected" : "Not Connected"}
//                 </Badge>
//                 <Button variant="outline" size="sm" onClick={onUpdate}>
//                   {integration.isConnected ? "Manage" : "Connect"}
//                   <ExternalLink className="h-3 w-3 ml-2" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { CheckCircle2, XCircle, Loader2, Key } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { getIntegrations, createIntegration, updateIntegration } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// export function IntegrationsTab({ onUpdate }: { onUpdate?: () => void }) {
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [configuringIntegration, setConfiguringIntegration] = useState<string | null>(null)
//   const [apiKey, setApiKey] = useState("")
//   const [saving, setSaving] = useState(false)
//   const { toast } = useToast()

//   const INTEGRATION_DEFINITIONS = [
//     {
//       type: "anthropic",
//       name: "Anthropic Claude",
//       description: "AI model provider (Required for AI responses)",
//       isRequired: true,
//       envVar: "ANTHROPIC_API_KEY",
//       configFields: ["apiKey"],
//     },
//     {
//       type: "stripe",
//       name: "Stripe Payments",
//       description: "Process payments and create payment links",
//       isRequired: false,
//       envVar: "STRIPE_SECRET_KEY",
//       configFields: ["apiKey"],
//     },
//     {
//       type: "google_calendar",
//       name: "Google Calendar",
//       description: "Schedule appointments and manage bookings",
//       isRequired: false,
//       envVar: "GOOGLE_CALENDAR_CREDENTIALS",
//       configFields: ["credentials"],
//     },
//     {
//       type: "mcp_server",
//       name: "MCP Servers",
//       description: "Extended AI capabilities via Model Context Protocol",
//       isRequired: false,
//       envVar: "MCP_SERVER_URL",
//       configFields: ["serverUrl", "apiKey"],
//     },
//   ]

//   useEffect(() => {
//     loadIntegrations()
//   }, [])

//   const loadIntegrations = async () => {
//     try {
//       setLoading(true)
//       const data = await getIntegrations()
//       setIntegrations(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load integrations",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getIntegrationStatus = (type: string) => {
//     const integration = integrations.find((i) => i.type === type)
//     return {
//       exists: !!integration,
//       isActive: integration?.isActive || false,
//       id: integration?.id,
//     }
//   }

//   const handleConfigure = (type: string) => {
//     setConfiguringIntegration(type)
//     const integration = integrations.find((i) => i.type === type)
//     if (integration?.config?.apiKey) {
//       setApiKey("••••••••") // Show masked key
//     } else {
//       setApiKey("")
//     }
//   }

//   const handleSaveIntegration = async () => {
//     if (!configuringIntegration) return

//     try {
//       setSaving(true)
//       const status = getIntegrationStatus(configuringIntegration)

//       const config = {
//         apiKey: apiKey === "••••••••" ? undefined : apiKey, // Don't update if masked
//       }

//       if (status.exists && status.id) {
//         await updateIntegration(status.id, { config, isActive: true })
//       } else {
//         await createIntegration({
//           type: configuringIntegration,
//           name: INTEGRATION_DEFINITIONS.find((d) => d.type === configuringIntegration)?.name || configuringIntegration,
//           config,
//           isActive: true,
//         })
//       }

//       await loadIntegrations()
//       onUpdate?.()

//       toast({
//         title: "Integration saved",
//         description: "Your integration has been configured",
//       })

//       setConfiguringIntegration(null)
//       setApiKey("")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save integration",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
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
//     <>
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Connected Services</CardTitle>
//             <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
//           </CardHeader>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {INTEGRATION_DEFINITIONS.map((definition) => {
//             const status = getIntegrationStatus(definition.type)
//             const isConnected = status.exists && status.isActive

//             return (
//               <Card key={definition.type}>
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <CardTitle className="text-lg">{definition.name}</CardTitle>
//                         {definition.isRequired && (
//                           <Badge variant="destructive" className="text-xs">
//                             Required
//                           </Badge>
//                         )}
//                       </div>
//                       <CardDescription>{definition.description}</CardDescription>
//                     </div>
//                     {isConnected ? (
//                       <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
//                     ) : (
//                       <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <Badge
//                         variant={isConnected ? "default" : "secondary"}
//                         className={isConnected ? "bg-green-600" : ""}
//                       >
//                         {isConnected ? "Connected" : "Not Connected"}
//                       </Badge>
//                       <Button variant="outline" size="sm" onClick={() => handleConfigure(definition.type)}>
//                         {isConnected ? "Manage" : "Connect"}
//                         <Key className="h-3 w-3 ml-2" />
//                       </Button>
//                     </div>
//                     {definition.envVar && <p className="text-xs text-muted-foreground">Env: {definition.envVar}</p>}
//                   </div>
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div>
//       </div>

//       {/* Configuration Dialog */}
//       <Dialog open={!!configuringIntegration} onOpenChange={() => setConfiguringIntegration(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               Configure {INTEGRATION_DEFINITIONS.find((d) => d.type === configuringIntegration)?.name}
//             </DialogTitle>
//             <DialogDescription>Enter your API credentials to connect this integration</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="apiKey">API Key</Label>
//               <Input
//                 id="apiKey"
//                 type="password"
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 placeholder="Enter your API key"
//               />
//               <p className="text-xs text-muted-foreground">Your API key is stored securely and never exposed</p>
//             </div>
//             <Button onClick={handleSaveIntegration} className="w-full" disabled={saving || !apiKey}>
//               {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               Save Integration
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Loader2, Key } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getIntegrations, createIntegration, updateIntegration } from "@/actions/ai-setup-actions"
import { useToast } from "@/hooks/use-toast"

export function IntegrationsTab({ onUpdate }: { onUpdate?: () => void }) {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [configuringIntegration, setConfiguringIntegration] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [storefrontAccessToken, setStorefrontAccessToken] = useState("")
  const [consumerKey, setConsumerKey] = useState("")
  const [consumerSecret, setConsumerSecret] = useState("")
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const INTEGRATION_DEFINITIONS = [
    {
      type: "anthropic",
      name: "Anthropic Claude",
      description: "AI model provider (Required for AI responses)",
      isRequired: true,
      envVar: "ANTHROPIC_API_KEY",
      configFields: ["apiKey"],
    },
    {
      type: "stripe",
      name: "Stripe Payments",
      description: "Process payments and create payment links",
      isRequired: false,
      envVar: "STRIPE_SECRET_KEY",
      configFields: ["apiKey"],
    },
    {
      type: "google_calendar",
      name: "Google Calendar",
      description: "Schedule appointments and manage bookings",
      isRequired: false,
      envVar: "GOOGLE_CALENDAR_CREDENTIALS",
      configFields: ["credentials"],
    },
    {
      type: "shopify",
      name: "Shopify Storefront",
      description: "Sync products and inventory from your Shopify store",
      isRequired: false,
      envVar: "SHOPIFY_STOREFRONT_TOKEN",
      configFields: ["storeUrl", "storefrontAccessToken"],
    },
    {
      type: "woocommerce",
      name: "WooCommerce",
      description: "Sync products and inventory from your WooCommerce store",
      isRequired: false,
      envVar: "WOOCOMMERCE_KEYS",
      configFields: ["storeUrl", "consumerKey", "consumerSecret"],
    },
    {
      type: "mcp_server",
      name: "MCP Servers",
      description: "Extended AI capabilities via Model Context Protocol",
      isRequired: false,
      envVar: "MCP_SERVER_URL",
      configFields: ["serverUrl", "apiKey"],
    },
  ]

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const data = await getIntegrations()
      setIntegrations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getIntegrationStatus = (type: string) => {
    const integration = integrations.find((i) => i.type === type)
    return {
      exists: !!integration,
      isActive: integration?.isActive || false,
      id: integration?.id,
    }
  }

  const handleConfigure = (type: string) => {
    setConfiguringIntegration(type)
    const integration = integrations.find((i) => i.type === type)
    if (integration?.config?.apiKey) {
      setApiKey("••••••••") // Show masked key
    } else {
      setApiKey("")
    }
    if (integration?.config?.storeUrl) {
      setStoreUrl(integration.config.storeUrl)
    } else {
      setStoreUrl("")
    }
    if (integration?.config?.storefrontAccessToken) {
      setStorefrontAccessToken(integration.config.storefrontAccessToken)
    } else {
      setStorefrontAccessToken("")
    }
    if (integration?.config?.consumerKey) {
      setConsumerKey(integration.config.consumerKey)
    } else {
      setConsumerKey("")
    }
    if (integration?.config?.consumerSecret) {
      setConsumerSecret(integration.config.consumerSecret)
    } else {
      setConsumerSecret("")
    }
  }

  const handleSaveIntegration = async () => {
    if (!configuringIntegration) return

    try {
      setSaving(true)
      const status = getIntegrationStatus(configuringIntegration)
      const definition = INTEGRATION_DEFINITIONS.find((d) => d.type === configuringIntegration)

      const config: any = {}
      if (definition?.type === "shopify") {
        config.storeUrl = storeUrl
        config.storefrontAccessToken = storefrontAccessToken
      } else if (definition?.type === "woocommerce") {
        config.storeUrl = storeUrl
        config.consumerKey = consumerKey
        config.consumerSecret = consumerSecret
      } else {
        config.apiKey = apiKey === "••••••••" ? undefined : apiKey
      }

      if (status.exists && status.id) {
        await updateIntegration(status.id, { config, isActive: true })
      } else {
        await createIntegration({
          type: configuringIntegration,
          name: definition?.name || configuringIntegration,
          config,
          isActive: true,
        })
      }

      await loadIntegrations()
      onUpdate?.()

      toast({
        title: "Integration saved",
        description: "Your integration has been configured",
      })

      setConfiguringIntegration(null)
      setApiKey("")
      setStoreUrl("")
      setStorefrontAccessToken("")
      setConsumerKey("")
      setConsumerSecret("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save integration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Services</CardTitle>
            <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATION_DEFINITIONS.map((definition) => {
            const status = getIntegrationStatus(definition.type)
            const isConnected = status.exists && status.isActive

            return (
              <Card key={definition.type}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{definition.name}</CardTitle>
                        {definition.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{definition.description}</CardDescription>
                    </div>
                    {isConnected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={isConnected ? "default" : "secondary"}
                        className={isConnected ? "bg-green-600" : ""}
                      >
                        {isConnected ? "Connected" : "Not Connected"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigure(definition.type)}>
                        {isConnected ? "Manage" : "Connect"}
                        <Key className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                    {definition.envVar && <p className="text-xs text-muted-foreground">Env: {definition.envVar}</p>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={!!configuringIntegration} onOpenChange={() => setConfiguringIntegration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configure {INTEGRATION_DEFINITIONS.find((d) => d.type === configuringIntegration)?.name}
            </DialogTitle>
            <DialogDescription>Enter your API credentials to connect this integration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {configuringIntegration === "shopify" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input
                    id="storeUrl"
                    type="text"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="Enter your store URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storefrontAccessToken">Storefront Access Token</Label>
                  <Input
                    id="storefrontAccessToken"
                    type="password"
                    value={storefrontAccessToken}
                    onChange={(e) => setStorefrontAccessToken(e.target.value)}
                    placeholder="Enter your storefront access token"
                  />
                </div>
              </>
            )}
            {configuringIntegration === "woocommerce" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input
                    id="storeUrl"
                    type="text"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="Enter your store URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumerKey">Consumer Key</Label>
                  <Input
                    id="consumerKey"
                    type="password"
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    placeholder="Enter your consumer key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumerSecret">Consumer Secret</Label>
                  <Input
                    id="consumerSecret"
                    type="password"
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    placeholder="Enter your consumer secret"
                  />
                </div>
              </>
            )}
            {configuringIntegration !== "shopify" && configuringIntegration !== "woocommerce" && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
                <p className="text-xs text-muted-foreground">Your API key is stored securely and never exposed</p>
              </div>
            )}
            <Button
              onClick={handleSaveIntegration}
              className="w-full"
              disabled={saving || (!apiKey && !storeUrl && !storefrontAccessToken && !consumerKey && !consumerSecret)}
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Integration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
