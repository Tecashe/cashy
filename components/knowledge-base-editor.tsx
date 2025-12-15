"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, BookOpen, MessageSquare, SettingsIcon } from "lucide-react"
import { toast } from "sonner"

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface KnowledgeBaseData {
  id?: string
  name: string
  description?: string
  businessInfo: string
  faqs: FAQItem[]
  productInfo?: string
  policyInfo?: string
  aiInstructions: string
  responseStyle: {
    tone: string
    maxLength: number
    useEmojis: boolean
    includeLinks: boolean
  }
}

interface KnowledgeBaseEditorProps {
  knowledgeBase?: KnowledgeBaseData | null
  onSave: (data: KnowledgeBaseData) => Promise<void>
}

export function KnowledgeBaseEditor({ knowledgeBase, onSave }: KnowledgeBaseEditorProps) {
  const [name, setName] = useState(knowledgeBase?.name || "My Knowledge Base")
  const [description, setDescription] = useState(knowledgeBase?.description || "")
  const [businessInfo, setBusinessInfo] = useState(knowledgeBase?.businessInfo || "")
  const [faqs, setFaqs] = useState<FAQItem[]>(knowledgeBase?.faqs || [])
  const [productInfo, setProductInfo] = useState(knowledgeBase?.productInfo || "")
  const [policyInfo, setPolicyInfo] = useState(knowledgeBase?.policyInfo || "")
  const [aiInstructions, setAiInstructions] = useState(
    knowledgeBase?.aiInstructions ||
      "Be helpful, friendly, and concise. Answer questions accurately based on the knowledge base.",
  )
  const [responseStyle, setResponseStyle] = useState({
    tone: knowledgeBase?.responseStyle?.tone || "friendly",
    maxLength: knowledgeBase?.responseStyle?.maxLength || 300,
    useEmojis: knowledgeBase?.responseStyle?.useEmojis ?? true,
    includeLinks: knowledgeBase?.responseStyle?.includeLinks ?? true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
    }
    setFaqs([...faqs, newFAQ])
  }

  const updateFAQ = (id: string, field: "question" | "answer", value: string) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)))
  }

  const deleteFAQ = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for your knowledge base")
      return
    }

    if (!businessInfo.trim()) {
      toast.error("Please provide business information")
      return
    }

    setIsSaving(true)

    try {
      const data: KnowledgeBaseData = {
        id: knowledgeBase?.id,
        name,
        description,
        businessInfo,
        faqs: faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        productInfo,
        policyInfo,
        aiInstructions,
        responseStyle,
      }

      await onSave(data)
      toast.success("Knowledge base saved successfully!")
    } catch (error) {
      console.error("Failed to save knowledge base:", error)
      toast.error("Failed to save knowledge base")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">AI Knowledge Base</h2>
          <p className="text-sm text-muted-foreground mt-1">Train your AI with information about your business</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Knowledge Base"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Knowledge Base Name</Label>
            <Input
              placeholder="e.g., Customer Support KB, Product Information"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Description (Optional)</Label>
            <Input
              placeholder="Brief description of this knowledge base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Business Information</h3>
              </div>
              <div>
                <Label>About Your Business</Label>
                <Textarea
                  placeholder="Describe your business, services, hours, location, etc..."
                  value={businessInfo}
                  onChange={(e) => setBusinessInfo(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This information will be used by the AI to understand your business context.
                </p>
              </div>
              <div>
                <Label>Policies & Terms</Label>
                <Textarea
                  placeholder="Return policy, shipping policy, terms of service, etc..."
                  value={policyInfo}
                  onChange={(e) => setPolicyInfo(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                </div>
                <Button onClick={addFAQ} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No FAQs yet. Add your first FAQ to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={faq.id} className="p-4 border-l-4 border-l-primary">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="secondary">FAQ {index + 1}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => deleteFAQ(faq.id)} className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div>
                          <Label className="text-xs">Question</Label>
                          <Input
                            placeholder="What question do customers ask?"
                            value={faq.question}
                            onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Answer</Label>
                          <Textarea
                            placeholder="How should the AI respond?"
                            value={faq.answer}
                            onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Product Information</h3>
              </div>
              <div>
                <Label>Products & Services</Label>
                <Textarea
                  placeholder="List your products/services with details like pricing, features, availability..."
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Include product names, descriptions, prices, features, and any relevant details.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">AI Response Settings</h3>
              </div>

              <div>
                <Label>AI Instructions</Label>
                <Textarea
                  placeholder="How should the AI behave when responding to customers?"
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Guide the AI on tone, style, and behavior when answering questions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Response Tone</Label>
                  <select
                    value={responseStyle.tone}
                    onChange={(e) => setResponseStyle({ ...responseStyle, tone: e.target.value })}
                    className="w-full mt-1.5 h-10 rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                <div>
                  <Label>Max Response Length</Label>
                  <Input
                    type="number"
                    min="50"
                    max="1000"
                    value={responseStyle.maxLength}
                    onChange={(e) => setResponseStyle({ ...responseStyle, maxLength: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Characters (50-1000)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Use Emojis</Label>
                    <p className="text-xs text-muted-foreground">Make responses more engaging with emojis</p>
                  </div>
                  <Switch
                    checked={responseStyle.useEmojis}
                    onCheckedChange={(checked) => setResponseStyle({ ...responseStyle, useEmojis: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Links</Label>
                    <p className="text-xs text-muted-foreground">Allow AI to share relevant links</p>
                  </div>
                  <Switch
                    checked={responseStyle.includeLinks}
                    onCheckedChange={(checked) => setResponseStyle({ ...responseStyle, includeLinks: checked })}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
