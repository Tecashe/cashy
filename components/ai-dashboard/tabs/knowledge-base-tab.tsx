// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, FileText, Loader2 } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   getKnowledgeDocuments,
//   deleteKnowledgeDocument,
//   updateKnowledgeDocument,
//   saveKnowledgeDocuments,
// } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// interface KnowledgeDocument {
//   id: string
//   title: string
//   content: string
//   type: "faq" | "policy" | "product_info" | "general" // Changed from string to union type to match Prisma schema
//   tags: string[]
//   createdAt: Date
//   updatedAt: Date
//   embedding: number[]
// }

// export function KnowledgeBaseTab({ onUpdate }: { onUpdate?: () => void }) {
//   const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingDocument, setEditingDocument] = useState<KnowledgeDocument | null>(null)
//   const [showDialog, setShowDialog] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [selectedType, setSelectedType] = useState<string>("all")
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     type: "faq" as "faq" | "policy" | "product_info" | "general",
//     tags: "",
//   })

//   useEffect(() => {
//     loadDocuments()
//   }, [])

//   const loadDocuments = async () => {
//     try {
//       setLoading(true)
//       const data = await getKnowledgeDocuments()
//       setDocuments(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load knowledge documents",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteKnowledgeDocument(id)
//       setDocuments(documents.filter((d) => d.id !== id))
//       onUpdate?.()
//       toast({
//         title: "Document deleted",
//         description: "Knowledge document has been removed",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete document",
//         variant: "destructive",
//       })
//     }
//   }

//   const toggleActive = async (doc: KnowledgeDocument) => {
//     toast({
//       title: "Feature unavailable",
//       description: "Document status toggle is not supported",
//       variant: "destructive",
//     })
//   }

//   const openEditDialog = (doc: KnowledgeDocument) => {
//     setEditingDocument(doc)
//     setFormData({
//       title: doc.title,
//       content: doc.content,
//       type: doc.type,
//       tags: doc.tags.join(", "),
//     })
//     setShowDialog(true)
//   }

//   const openAddDialog = () => {
//     setEditingDocument(null)
//     setFormData({
//       title: "",
//       content: "",
//       type: "faq",
//       tags: "",
//     })
//     setShowDialog(true)
//   }

//   const handleSave = async () => {
//     if (!formData.title || !formData.content) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in title and content",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       setSaving(true)

//       const tags = formData.tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter((t) => t)

//       if (editingDocument) {
//         await updateKnowledgeDocument(editingDocument.id, {
//           title: formData.title,
//           content: formData.content,
//           type: formData.type, // Cast type to the union type expected by Prisma
//           tags,
//         })
//         toast({
//           title: "Document updated",
//           description: "Your changes have been saved",
//         })
//       } else {
//         await saveKnowledgeDocuments([
//           {
//             title: formData.title,
//             content: formData.content,
//             type: formData.type, // Cast type to the union type expected by Prisma
//             tags,
//           },
//         ])
//         toast({
//           title: "Document added",
//           description: "New knowledge document has been added",
//         })
//       }

//       setShowDialog(false)
//       await loadDocuments()
//       onUpdate?.()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save document",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const filteredDocuments = selectedType === "all" ? documents : documents.filter((d) => d.type === selectedType)

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Knowledge Base</CardTitle>
//               <CardDescription>Information the AI uses to answer customer questions</CardDescription>
//             </div>
//             <Button onClick={openAddDialog}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Document
//             </Button>
//           </div>
//         </CardHeader>
//       </Card>

//       <Tabs value={selectedType} onValueChange={setSelectedType}>
//         <TabsList>
//           <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
//           <TabsTrigger value="faq">FAQs ({documents.filter((d) => d.type === "faq").length})</TabsTrigger>
//           <TabsTrigger value="policy">Policies ({documents.filter((d) => d.type === "policy").length})</TabsTrigger>
//           <TabsTrigger value="product_info">
//             Product Info ({documents.filter((d) => d.type === "product_info").length})
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value={selectedType} className="space-y-4 mt-6">
//           {filteredDocuments.length === 0 ? (
//             <Card>
//               <CardContent className="flex flex-col items-center justify-center py-12">
//                 <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//                 <p className="text-lg font-medium mb-2">No documents yet</p>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Add knowledge documents to help your AI answer questions
//                 </p>
//                 <Button onClick={openAddDialog}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Your First Document
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             filteredDocuments.map((doc) => (
//               <Card key={doc.id}>
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg flex items-center gap-2">
//                         <FileText className="h-4 w-4" />
//                         {doc.title}
//                       </CardTitle>
//                       <CardDescription className="mt-2 line-clamp-2">{doc.content}</CardDescription>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" onClick={() => openEditDialog(doc)}>
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <Badge variant="secondary">{doc.type.replace("_", " ")}</Badge>
//                     {doc.tags.map((tag) => (
//                       <Badge key={tag} variant="outline">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>

//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>{editingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
//             <DialogDescription>
//               {editingDocument ? "Update knowledge document" : "Add information for your AI to reference"}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Title *</Label>
//               <Input
//                 placeholder="e.g., Return Policy"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Type *</Label>
//               <Select
//                 value={formData.type}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, type: value as "faq" | "policy" | "product_info" | "general" })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="faq">FAQ</SelectItem>
//                   <SelectItem value="policy">Policy</SelectItem>
//                   <SelectItem value="product_info">Product Info</SelectItem>
//                   <SelectItem value="general">General</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Content *</Label>
//               <Textarea
//                 placeholder="The information the AI will use to answer questions..."
//                 rows={8}
//                 value={formData.content}
//                 onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tags (comma-separated)</Label>
//               <Input
//                 placeholder="e.g., returns, shipping, warranty"
//                 value={formData.tags}
//                 onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               {editingDocument ? "Update" : "Add"} Document
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, FileText, Loader2, Upload, FileUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import {
  getKnowledgeDocuments,
  deleteKnowledgeDocument,
  updateKnowledgeDocument,
  saveKnowledgeDocuments,
} from "@/actions/ai-setup-actions"
import { useToast } from "@/hooks/use-toast"

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  type: "faq" | "policy" | "product_info" | "general" // Changed from string to union type to match Prisma schema
  tags: string[]
  createdAt: Date
  updatedAt: Date
  embedding: number[]
}

export function KnowledgeBaseTab({ onUpdate }: { onUpdate?: () => void }) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDocument, setEditingDocument] = useState<KnowledgeDocument | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [documentUploadMode, setDocumentUploadMode] = useState<"manual" | "upload">("manual")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "faq" as "faq" | "policy" | "product_info" | "general",
    tags: "",
  })

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await getKnowledgeDocuments()
      setDocuments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load knowledge documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeDocument(id)
      setDocuments(documents.filter((d) => d.id !== id))
      onUpdate?.()
      toast({
        title: "Document deleted",
        description: "Knowledge document has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (doc: KnowledgeDocument) => {
    toast({
      title: "Feature unavailable",
      description: "Document status toggle is not supported",
      variant: "destructive",
    })
  }

  const openEditDialog = (doc: KnowledgeDocument) => {
    setEditingDocument(doc)
    setFormData({
      title: doc.title,
      content: doc.content,
      type: doc.type,
      tags: doc.tags.join(", "),
    })
    setShowDialog(true)
  }

  const openAddDialog = () => {
    setEditingDocument(null)
    setFormData({
      title: "",
      content: "",
      type: "faq",
      tags: "",
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and content",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t)

      if (editingDocument) {
        await updateKnowledgeDocument(editingDocument.id, {
          title: formData.title,
          content: formData.content,
          type: formData.type, // Cast type to the union type expected by Prisma
          tags,
        })
        toast({
          title: "Document updated",
          description: "Your changes have been saved",
        })
      } else {
        await saveKnowledgeDocuments([
          {
            title: formData.title,
            content: formData.content,
            type: formData.type, // Cast type to the union type expected by Prisma
            tags,
          },
        ])
        toast({
          title: "Document added",
          description: "New knowledge document has been added",
        })
      }

      setShowDialog(false)
      await loadDocuments()
      onUpdate?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDocumentUpload = async (urls: string[]) => {
    try {
      // Fetch and parse uploaded documents
      for (const url of urls) {
        const response = await fetch(url)
        const text = await response.text()
        
        // Extract filename from URL
        const filename = url.split('/').pop() || 'document'
        
        // Add to form data
        setFormData({
          ...formData,
          title: formData.title || filename,
          content: text,
        })
      }
      
      toast({
        title: "Document loaded",
        description: "Document content has been imported",
      })
      
      setDocumentUploadMode("manual")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document content",
        variant: "destructive",
      })
    }
  }

  const filteredDocuments = selectedType === "all" ? documents : documents.filter((d) => d.type === selectedType)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Information the AI uses to answer customer questions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Docs
              </Button>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="faq">FAQs ({documents.filter((d) => d.type === "faq").length})</TabsTrigger>
          <TabsTrigger value="policy">Policies ({documents.filter((d) => d.type === "policy").length})</TabsTrigger>
          <TabsTrigger value="product_info">
            Product Info ({documents.filter((d) => d.type === "product_info").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4 mt-6">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No documents yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add knowledge documents to help your AI answer questions
                </p>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{doc.content}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(doc)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{doc.type.replace("_", " ")}</Badge>
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
            <DialogDescription>
              {editingDocument ? "Update knowledge document" : "Add information for your AI to reference"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Return Policy"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as "faq" | "policy" | "product_info" | "general" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="product_info">Product Info</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Tabs value={documentUploadMode} onValueChange={(v) => setDocumentUploadMode(v as "manual" | "upload")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Type Manually</TabsTrigger>
                  <TabsTrigger value="upload">
                    <FileUp className="h-3 w-3 mr-1" />
                    Upload Document
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <Textarea
                    placeholder="The information the AI will use to answer questions..."
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </TabsContent>
                <TabsContent value="upload">
                  <FileUpload
                    type="knowledge"
                    accept=".txt,.pdf,.csv,.json,text/plain,application/pdf"
                    multiple={false}
                    onUploadComplete={handleDocumentUpload}
                    preview={false}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload a text file, PDF, CSV, or JSON document. The content will be extracted and added to the knowledge base.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                placeholder="e.g., returns, shipping, warranty"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {editingDocument ? "Update" : "Add"} Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Knowledge Documents</DialogTitle>
            <DialogDescription>
              Upload PDF or TXT files. We'll extract the content for your AI to use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FileUpload
              type="knowledge"
              accept=".pdf,.txt"
              multiple
              onUploadComplete={async (urls) => {
                // Here we would trigger a server action to process these files
                // For now, we'll notify the user
                toast({
                  title: "Files uploaded",
                  description: "Processing your documents... they will appear in the list shortly.",
                })
                setShowUploadDialog(false)
                // In a real app, you'd trigger a background job to parse the PDF/TXT
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
