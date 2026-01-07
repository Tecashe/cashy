"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Send, CheckCircle, XCircle, Zap, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (message: string, options?: { model?: string; stream?: boolean }) => Promise<any>
      }
    }
  }
}

export function TestingTab({ automationId }: { automationId: string | null }) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [puterLoaded, setPuterLoaded] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadConfig = async () => {
      if (!automationId) return

      try {
        const automation = await fetch(`/api/automations/${automationId}`).then((r) => r.json())
        const aiAction = automation.actions?.find((a: any) => a.type === "ai_response")
        setConfig(aiAction?.config || {})
      } catch (error) {
        console.error("Failed to load AI config:", error)
      }
    }

    loadConfig()
  }, [automationId])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.puter.com/v2/"
    script.async = true
    script.onload = () => setPuterLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const testWithAPIKeys = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test message",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch("/api/test-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, config }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.details || data.error)
      }

      setResponse(data)
      toast({
        title: "Success",
        description: `AI responded using ${data.provider}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to test AI",
        variant: "destructive",
      })
      setResponse({
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const testWithPuter = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test message",
        variant: "destructive",
      })
      return
    }

    if (!window.puter) {
      toast({
        title: "Error",
        description: "Puter.js is still loading...",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const result = await window.puter.ai.chat(message, {
        model: "claude-sonnet-4-5",
      })

      const aiResponse = result.message?.content?.[0]?.text || result.text || "No response"

      setResponse({
        success: true,
        response: aiResponse,
        provider: "puter (free claude)",
        confidence: 0.95,
        sentiment: "neutral",
      })

      toast({
        title: "Success",
        description: "AI responded using free Puter.js Claude API",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to test with Puter.js",
        variant: "destructive",
      })
      setResponse({
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const presetMessages = [
    "Hi, do you have blue shoes?",
    "What's your shipping policy?",
    "I need help with my order",
    "Can I book an appointment?",
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="free" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="free" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Free Testing (Puter.js) - RECOMMENDED
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Production Testing
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="free" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Free Claude Access - Start Here!</h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Test your AI responses instantly using Puter.js - no API keys or setup needed! This is the easiest way
                  to test your AI configuration.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a test message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && testWithPuter()}
                />
                <Button onClick={testWithPuter} disabled={loading || !puterLoaded}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {presetMessages.map((preset) => (
                  <Button key={preset} variant="outline" size="sm" onClick={() => setMessage(preset)}>
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            {response && (
              <div className="mt-6 space-y-4">
                {response.success ? (
                  <>
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">AI Response:</p>
                        <p className="text-green-800 dark:text-green-200">{response.response}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-semibold">{(response.confidence * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sentiment</p>
                        <p className="font-semibold capitalize">{response.sentiment}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Provider</p>
                        <p className="font-semibold capitalize">{response.provider}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100 mb-1">Error:</p>
                      <p className="text-red-800 dark:text-red-200">{response.error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Important Note</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Puter.js is CLIENT-SIDE only and perfect for testing your AI personality and responses in the browser. For
              REAL Instagram automation (when DMs arrive), you MUST use the "Production Testing" tab with API keys
              because Instagram webhooks hit your server, not the browser.
            </p>
          </Card>
        </TabsContent> */}

        <TabsContent value="production" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Production Testing (Requires API Keys)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test with your configured API keys - this is what will actually run when Instagram DMs arrive. Add your
              API keys in the Integrations tab first.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a test message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && testWithAPIKeys()}
                />
                <Button onClick={testWithAPIKeys} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {presetMessages.map((preset) => (
                  <Button key={preset} variant="outline" size="sm" onClick={() => setMessage(preset)}>
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            {response && (
              <div className="mt-6 space-y-4">
                {response.success ? (
                  <>
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">AI Response:</p>
                        <p className="text-green-800 dark:text-green-200">{response.response}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-semibold">{(response.confidence * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sentiment</p>
                        <p className="font-semibold capitalize">{response.sentiment}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Provider</p>
                        <p className="font-semibold capitalize">{response.provider}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100 mb-1">Error:</p>
                      <p className="text-red-800 dark:text-red-200">{response.error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">API Keys Required</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Configure these in the Integrations tab or set as environment variables:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">ANTHROPIC_API_KEY</code> - Get from
                console.anthropic.com
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">DEEPSEEK_API_KEY</code> (Optional fallback)
                - Get from platform.deepseek.com
              </li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
