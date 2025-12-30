"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Send, Bot, User, Loader2, Rocket, AlertTriangle } from "lucide-react"

interface TestingStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function TestingStep({ data, onComplete, onBack }: TestingStepProps) {
  const [testMessage, setTestMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)

  const handleSendTest = async () => {
    if (!testMessage.trim()) return

    const userMessage: Message = {
      role: "user",
      content: testMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setTestMessage("")
    setIsLoading(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiResponse: Message = {
      role: "assistant",
      content:
        "Hi! Thanks for reaching out! I'm here to help you with any questions about our products and services. What can I assist you with today? 😊",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsLoading(false)
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsDeploying(false)
    setIsDeployed(true)
    onComplete({ deployed: true })
  }

  const presetTests = [
    "Do you have blue shoes in stock?",
    "What are your store hours?",
    "I want to book an appointment",
    "How much does shipping cost?",
  ]

  return (
    <div className="space-y-6">
      {!isDeployed ? (
        <>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Test your AI before going live</p>
                <p className="text-sm">
                  Send test messages to see how the AI responds. Make sure it's answering correctly and using the right
                  tone before activating it for real customers.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Playground</CardTitle>
                <CardDescription>Simulate customer messages to test AI responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Quick Test Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {presetTests.map((test) => (
                      <Button
                        key={test}
                        variant="outline"
                        size="sm"
                        onClick={() => setTestMessage(test)}
                        className="text-xs"
                      >
                        {test}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Type a test message as if you were a customer..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleSendTest} disabled={!testMessage.trim() || isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        AI is responding...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Message
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Responses</CardTitle>
                <CardDescription>See how your AI assistant responds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                      <Bot className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Send a test message to see how the AI responds</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                          <div
                            className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Ready to Launch?
              </CardTitle>
              <CardDescription>
                Once you're happy with the AI's responses, activate it for your Instagram account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Before you launch, make sure:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>AI responds appropriately to common questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Tone matches your brand voice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Product recommendations are accurate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Knowledge base information is correct</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleDeploy} disabled={isDeploying} size="lg" className="w-full">
                {isDeploying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Activating AI Assistant...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    Activate AI Assistant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-3">AI Assistant is Live!</h2>
            <p className="text-lg text-green-800 mb-6 max-w-2xl mx-auto">
              Your AI is now handling Instagram messages automatically. It will respond to DMs, comments, and story
              replies 24/7 using the settings you configured.
            </p>
            <div className="space-y-3 text-sm text-green-700 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Monitoring all incoming messages</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ready to search products and knowledge base</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Commerce features enabled</span>
              </div>
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
              <Button size="lg">Monitor Conversations</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg" disabled={isDeploying || isDeployed}>
          Back
        </Button>
      </div>
    </div>
  )
}
