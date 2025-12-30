"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Info, ArrowRight, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  type: string
  tags: string[]
}

interface KnowledgeBaseStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const DOCUMENT_TYPES = [
  { value: "faq", label: "FAQ", description: "Common questions and answers" },
  { value: "policy", label: "Business Policy", description: "Return, shipping, privacy policies" },
  { value: "hours", label: "Operating Hours", description: "When you're open for business" },
  { value: "pricing", label: "Pricing Info", description: "Pricing tiers, packages, discounts" },
  { value: "process", label: "Process / How-To", description: "How things work at your business" },
  { value: "other", label: "Other", description: "General business information" },
]

export function KnowledgeBaseStep({ data, onComplete, onNext, onBack, onSkip }: KnowledgeBaseStepProps) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(data?.documents || [])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDoc, setNewDoc] = useState({
    title: "",
    content: "",
    type: "faq",
    tags: [] as string[],
  })

  const handleAddDocument = () => {
    if (newDoc.title && newDoc.content) {
      setDocuments([
        ...documents,
        {
          ...newDoc,
          id: Math.random().toString(),
        },
      ])
      setNewDoc({ title: "", content: "", type: "faq", tags: [] })
      setShowAddForm(false)
    }
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id))
  }

  const handleContinue = () => {
    onComplete({ documents })
    onNext()
  }

  const handleSkipStep = () => {
    onComplete({ documents: [] })
    onSkip()
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Why build a knowledge base?</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>The AI searches this info to answer customer questions accurately</li>
              <li>Ensure consistent answers about policies, hours, and procedures</li>
              <li>Reduces incorrect information and "I don't know" responses</li>
              <li>Update once here, and the AI instantly knows the new information</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Knowledge Base ({documents.length} documents)</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
              {DOCUMENT_TYPES.map((type) => {
                const count = documents.filter((d) => d.type === type.value).length
                return count > 0 ? (
                  <TabsTrigger key={type.value} value={type.value}>
                    {type.label} ({count})
                  </TabsTrigger>
                ) : null
              })}
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-semibold">{doc.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doc.content}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label}</Badge>
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {DOCUMENT_TYPES.map((type) => (
              <TabsContent key={type.value} value={type.value} className="space-y-3 mt-4">
                {documents
                  .filter((d) => d.type === type.value)
                  .map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <h4 className="font-semibold">{doc.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{doc.content}</p>
                            <div className="flex items-center gap-2">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {(showAddForm || documents.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {documents.length === 0 ? "Add Your First Document" : "Add Another Document"}
            </CardTitle>
            <CardDescription>
              This information will be available to the AI when answering customer questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type *</Label>
              <Select value={newDoc.type} onValueChange={(value) => setNewDoc({ ...newDoc, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docTitle">Title *</Label>
              <Input
                id="docTitle"
                placeholder="e.g., Return Policy, Operating Hours, How to Book"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docContent">Content *</Label>
              <Textarea
                id="docContent"
                placeholder="Write the detailed information here. The AI will use this exact text to answer customer questions."
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Be specific and clear. Include all important details the AI should know.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" onClick={handleAddDocument} disabled={!newDoc.title || !newDoc.content}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
              {documents.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewDoc({ title: "", content: "", type: "faq", tags: [] })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <div className="flex gap-2">
          {documents.length === 0 && (
            <Button variant="ghost" onClick={handleSkipStep} size="lg">
              Skip for Now
            </Button>
          )}
          <Button onClick={handleContinue} size="lg">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
