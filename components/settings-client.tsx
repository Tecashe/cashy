"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, CheckCircle2, XCircle, Save, Key, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsClientProps {
  initialSettings: {
    instagramConnected: boolean
    instagramUsername: string | null
    businessName?: string | null
    businessDescription?: string | null
    businessType?: string | null
    automationSettings: {
      enableAutoResponse: boolean
      responseDelay: number
      workingHours: {
        enabled: boolean
        start: string
        end: string
      }
    }
    notificationSettings: {
      emailNotifications: boolean
      newMessages: boolean
      automationErrors: boolean
    }
  }
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [instagramConnected, setInstagramConnected] = useState(initialSettings.instagramConnected)
  const [businessName, setBusinessName] = useState(initialSettings.businessName || "")
  const [businessDescription, setBusinessDescription] = useState(initialSettings.businessDescription || "")
  const [businessType, setBusinessType] = useState(initialSettings.businessType || "")
  const [automationSettings, setAutomationSettings] = useState(initialSettings.automationSettings)
  const [notificationSettings, setNotificationSettings] = useState(initialSettings.notificationSettings)

  const handleConnectInstagram = () => {
    // In production, this would redirect to Instagram OAuth:
    // const oauthUrl = `https://api.instagram.com/oauth/authorize
    //   ?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}
    //   &redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/instagram/callback')}
    //   &scope=instagram_basic,instagram_manage_messages,instagram_manage_comments,instagram_content_publish
    //   &response_type=code`
    // window.location.href = oauthUrl

    alert("Instagram OAuth flow would be initiated here. You'll be redirected to Instagram to authorize the app.")
    setInstagramConnected(true)
  }

  const handleDisconnectInstagram = () => {
    // In production: call API to revoke Instagram access
    setInstagramConnected(false)
    alert("Instagram disconnected")
  }

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessDescription,
          businessType,
          automationSettings,
          notificationSettings,
        }),
      })

      if (!response.ok) throw new Error("Failed to save settings")
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      alert("Failed to save settings")
    }
  }

  return (
    <Tabs defaultValue="business" className="space-y-6">
      <TabsList>
        <TabsTrigger value="business">Business</TabsTrigger>
        <TabsTrigger value="instagram">Instagram</TabsTrigger>
        <TabsTrigger value="automation">Automation</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* Business Context Tab */}
      <TabsContent value="business" className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Provide context about your business to personalize AI responses and automations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g., Acme Fashion Store"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="service">Service Provider</SelectItem>
                  <SelectItem value="influencer">Influencer/Creator</SelectItem>
                  <SelectItem value="agency">Marketing Agency</SelectItem>
                  <SelectItem value="restaurant">Restaurant/Food</SelectItem>
                  <SelectItem value="fitness">Fitness/Wellness</SelectItem>
                  <SelectItem value="fashion">Fashion/Beauty</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                placeholder="Describe your business, products/services, target audience, and brand voice. This helps AI generate personalized responses that match your brand..."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                This information will be used to personalize AI-generated content and automated responses
              </p>
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="h-4 w-4" />
              Save Business Information
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Instagram Connection */}
      <TabsContent value="instagram" className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Instagram Connection</CardTitle>
            <CardDescription>Connect your Instagram account to enable automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {instagramConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Instagram Connected</p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">@your_instagram_account</p>
                  </div>
                  <Button variant="destructive" onClick={handleDisconnectInstagram}>
                    Disconnect
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-semibold">Permissions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Read and send messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Read and respond to comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Publish content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Access insights</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
                    <Instagram className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Instagram Not Connected</p>
                      <Badge variant="outline">
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Connect your account to start automating
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleConnectInstagram}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Instagram className="h-4 w-4" />
                  Connect Instagram Account
                </Button>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Required Permissions</h4>
                  <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                    InstaFlow will request the following permissions:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Key className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium">instagram_basic</p>
                        <p className="text-slate-600 dark:text-slate-400">Access basic profile information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Key className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium">instagram_manage_messages</p>
                        <p className="text-slate-600 dark:text-slate-400">Read and send direct messages</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Key className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium">instagram_manage_comments</p>
                        <p className="text-slate-600 dark:text-slate-400">Read and respond to comments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Key className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium">instagram_content_publish</p>
                        <p className="text-slate-600 dark:text-slate-400">Publish posts and stories</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>For advanced Instagram API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/instagram/webhooks`}
                readOnly
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use this URL when configuring webhooks in the Meta Developer Portal
              </p>
            </div>

            <div className="space-y-2">
              <Label>Verify Token</Label>
              <Input value="your-verify-token-here" readOnly className="font-mono text-sm" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Set INSTAGRAM_WEBHOOK_VERIFY_TOKEN in your environment variables
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Automation Settings */}
      <TabsContent value="automation" className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Automation Settings</CardTitle>
            <CardDescription>Configure how your automations behave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Auto-Response</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Automatically respond to messages based on triggers
                </p>
              </div>
              <Switch
                checked={automationSettings.enableAutoResponse}
                onCheckedChange={(checked) =>
                  setAutomationSettings({ ...automationSettings, enableAutoResponse: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Response Delay (seconds)</Label>
              <Input
                type="number"
                value={automationSettings.responseDelay}
                onChange={(e) =>
                  setAutomationSettings({ ...automationSettings, responseDelay: Number.parseInt(e.target.value) })
                }
                min="0"
                max="60"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Add a slight delay to make responses feel more natural
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Working Hours</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Only run automations during specific hours
                  </p>
                </div>
                <Switch
                  checked={automationSettings.workingHours.enabled}
                  onCheckedChange={(checked) =>
                    setAutomationSettings({
                      ...automationSettings,
                      workingHours: { ...automationSettings.workingHours, enabled: checked },
                    })
                  }
                />
              </div>

              {automationSettings.workingHours.enabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={automationSettings.workingHours.start}
                      onChange={(e) =>
                        setAutomationSettings({
                          ...automationSettings,
                          workingHours: { ...automationSettings.workingHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={automationSettings.workingHours.end}
                      onChange={(e) =>
                        setAutomationSettings({
                          ...automationSettings,
                          workingHours: { ...automationSettings.workingHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="h-4 w-4" />
              Save Automation Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Messages</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get notified of new Instagram messages</p>
              </div>
              <Switch
                checked={notificationSettings.newMessages}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, newMessages: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automation Errors</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Alert when automations encounter errors</p>
              </div>
              <Switch
                checked={notificationSettings.automationErrors}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, automationErrors: checked })
                }
              />
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
