// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, Package, Loader2 } from "lucide-react"
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
// import { getProducts, deleteProduct, updateProduct, saveProducts } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   stock: number
//   category: string | null
//   imageUrl: string | null
//   isAvailable: boolean
// }

// export function ProductsTab({ onUpdate }: { onUpdate?: () => void }) {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null)
//   const [showDialog, setShowDialog] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     category: "",
//     imageUrl: "",
//   })

//   useEffect(() => {
//     loadProducts()
//   }, [])

//   const loadProducts = async () => {
//     try {
//       setLoading(true)
//       const data = await getProducts()
//       setProducts(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load products",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteProduct(id)
//       setProducts(products.filter((p) => p.id !== id))
//       onUpdate?.()
//       toast({
//         title: "Product deleted",
//         description: "Product has been removed from your catalog",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete product",
//         variant: "destructive",
//       })
//     }
//   }

//   const toggleActive = async (product: Product) => {
//     try {
//       await updateProduct(product.id, { isAvailable: !product.isAvailable })
//       setProducts(products.map((p) => (p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p)))
//       toast({
//         title: product.isAvailable ? "Product disabled" : "Product enabled",
//         description: `${product.name} is now ${!product.isAvailable ? "available" : "unavailable"} for AI recommendations`,
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update product status",
//         variant: "destructive",
//       })
//     }
//   }

//   const openEditDialog = (product: Product) => {
//     setEditingProduct(product)
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: (product.price / 100).toString(),
//       stock: product.stock.toString(),
//       category: product.category || "",
//       imageUrl: product.imageUrl || "",
//     })
//     setShowDialog(true)
//   }

//   const openAddDialog = () => {
//     setEditingProduct(null)
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       stock: "",
//       category: "",
//       imageUrl: "",
//     })
//     setShowDialog(true)
//   }

//   const handleSave = async () => {
//     if (!formData.name || !formData.description || !formData.price) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       setSaving(true)

//       if (editingProduct) {
//         await updateProduct(editingProduct.id, {
//           name: formData.name,
//           description: formData.description,
//           price: Math.round(Number.parseFloat(formData.price) * 100),
//           stock: Number.parseInt(formData.stock) || 0,
//           category: formData.category || undefined,
//           imageUrl: formData.imageUrl || undefined,
//         })
//         toast({
//           title: "Product updated",
//           description: "Your changes have been saved",
//         })
//       } else {
//         await saveProducts([
//           {
//             name: formData.name,
//             description: formData.description,
//             price: Math.round(Number.parseFloat(formData.price) * 100),
//             stock: Number.parseInt(formData.stock) || 0,
//             category: formData.category || undefined,
//             imageUrl: formData.imageUrl || undefined,
//           },
//         ])
//         toast({
//           title: "Product added",
//           description: "New product has been added to your catalog",
//         })
//       }

//       setShowDialog(false)
//       await loadProducts()
//       onUpdate?.()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save product",
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
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Your Product Catalog</CardTitle>
//               <CardDescription>Products the AI can search and recommend to customers</CardDescription>
//             </div>
//             <Button onClick={openAddDialog}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Product
//             </Button>
//           </div>
//         </CardHeader>
//       </Card>

//       {products.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Package className="h-12 w-12 text-muted-foreground mb-4" />
//             <p className="text-lg font-medium mb-2">No products yet</p>
//             <p className="text-sm text-muted-foreground mb-4">
//               Add products so your AI can recommend them to customers
//             </p>
//             <Button onClick={openAddDialog}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Your First Product
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((product) => (
//             <Card key={product.id}>
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <CardTitle className="text-lg flex items-center gap-2">
//                       <Package className="h-4 w-4" />
//                       {product.name}
//                     </CardTitle>
//                     <CardDescription className="mt-1">{product.description}</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <Badge variant="secondary">${(product.price / 100).toFixed(2)}</Badge>
//                   {product.category && <Badge variant="outline">{product.category}</Badge>}
//                   <Badge variant="outline">Stock: {product.stock}</Badge>
//                   <Badge variant={product.isAvailable ? "default" : "secondary"}>
//                     {product.isAvailable ? "Active" : "Disabled"}
//                   </Badge>
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <Button variant="outline" size="sm" onClick={() => toggleActive(product)} className="flex-1">
//                     {product.isAvailable ? "Disable" : "Enable"}
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
//                     <Edit2 className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
//             <DialogDescription>
//               {editingProduct ? "Update product information" : "Add a new product to your catalog"}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Product Name *</Label>
//               <Input
//                 placeholder="e.g., Organic Cotton T-Shirt"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Description *</Label>
//               <Textarea
//                 placeholder="Describe the product"
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Price ($) *</Label>
//                 <Input
//                   type="number"
//                   placeholder="29.99"
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Stock</Label>
//                 <Input
//                   type="number"
//                   placeholder="50"
//                   value={formData.stock}
//                   onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Category</Label>
//               <Input
//                 placeholder="e.g., Clothing"
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Image URL</Label>
//               <Input
//                 placeholder="https://..."
//                 value={formData.imageUrl}
//                 onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               {editingProduct ? "Update" : "Add"} Product
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, Package, Loader2, X, ImageIcon } from "lucide-react"
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
// import { getProducts, deleteProduct, updateProduct, saveProducts } from "@/actions/ai-setup-actions"
// import { useToast } from "@/hooks/use-toast"

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   stock: number
//   category: string | null
//   imageUrl: string | null
//   images: string[]
//   isAvailable: boolean
// }

// export function ProductsTab({ onUpdate }: { onUpdate?: () => void }) {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null)
//   const [showDialog, setShowDialog] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     category: "",
//     images: [] as string[],
//     newImageUrl: "",
//   })

//   useEffect(() => {
//     loadProducts()
//   }, [])

//   const loadProducts = async () => {
//     try {
//       setLoading(true)
//       const data = await getProducts()
//       setProducts(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load products",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteProduct(id)
//       setProducts(products.filter((p) => p.id !== id))
//       onUpdate?.()
//       toast({
//         title: "Product deleted",
//         description: "Product has been removed from your catalog",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete product",
//         variant: "destructive",
//       })
//     }
//   }

//   const toggleActive = async (product: Product) => {
//     try {
//       await updateProduct(product.id, { isAvailable: !product.isAvailable })
//       setProducts(products.map((p) => (p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p)))
//       toast({
//         title: product.isAvailable ? "Product disabled" : "Product enabled",
//         description: `${product.name} is now ${!product.isAvailable ? "available" : "unavailable"} for AI recommendations`,
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update product status",
//         variant: "destructive",
//       })
//     }
//   }

//   const openEditDialog = (product: Product) => {
//     setEditingProduct(product)
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: (product.price / 100).toString(),
//       stock: product.stock.toString(),
//       category: product.category || "",
//       images: product.images || [],
//       newImageUrl: "",
//     })
//     setShowDialog(true)
//   }

//   const openAddDialog = () => {
//     setEditingProduct(null)
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       stock: "",
//       category: "",
//       images: [],
//       newImageUrl: "",
//     })
//     setShowDialog(true)
//   }

//   const addImage = () => {
//     if (formData.newImageUrl.trim()) {
//       setFormData({
//         ...formData,
//         images: [...formData.images, formData.newImageUrl.trim()],
//         newImageUrl: "",
//       })
//     }
//   }

//   const removeImage = (index: number) => {
//     setFormData({
//       ...formData,
//       images: formData.images.filter((_, i) => i !== index),
//     })
//   }

//   const handleSave = async () => {
//     if (!formData.name || !formData.description || !formData.price) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       setSaving(true)

//       const productData = {
//         name: formData.name,
//         description: formData.description,
//         price: Math.round(Number.parseFloat(formData.price) * 100),
//         stock: Number.parseInt(formData.stock) || 0,
//         category: formData.category || null,
//         images: formData.images,
//       }

//       if (editingProduct) {
//         await updateProduct(editingProduct.id, productData)
//         toast({
//           title: "Product updated",
//           description: "Your changes have been saved",
//         })
//       } else {
//         await saveProducts([productData])
//         toast({
//           title: "Product added",
//           description: "New product has been added to your catalog",
//         })
//       }

//       setShowDialog(false)
//       await loadProducts()
//       onUpdate?.()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save product",
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
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Your Product Catalog</CardTitle>
//               <CardDescription>Products the AI can search and recommend to customers</CardDescription>
//             </div>
//             <Button onClick={openAddDialog}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Product
//             </Button>
//           </div>
//         </CardHeader>
//       </Card>

//       {products.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Package className="h-12 w-12 text-muted-foreground mb-4" />
//             <p className="text-lg font-medium mb-2">No products yet</p>
//             <p className="text-sm text-muted-foreground mb-4">
//               Add products so your AI can recommend them to customers
//             </p>
//             <Button onClick={openAddDialog}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Your First Product
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((product) => (
//             <Card key={product.id}>
//               {product.images && product.images.length > 0 && (
//                 <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
//                   <img
//                     src={product.images[0] || "/placeholder.svg"}
//                     alt={product.name}
//                     className="h-full w-full object-cover"
//                   />
//                   {product.images.length > 1 && (
//                     <Badge className="absolute bottom-2 right-2 bg-black/60 text-white">
//                       +{product.images.length - 1} more
//                     </Badge>
//                   )}
//                 </div>
//               )}
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <CardTitle className="text-lg flex items-center gap-2">
//                       <Package className="h-4 w-4" />
//                       {product.name}
//                     </CardTitle>
//                     <CardDescription className="mt-1 line-clamp-2">{product.description}</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <Badge variant="secondary">${(product.price / 100).toFixed(2)}</Badge>
//                   {product.category && <Badge variant="outline">{product.category}</Badge>}
//                   <Badge variant="outline">Stock: {product.stock}</Badge>
//                   <Badge variant={product.isAvailable ? "default" : "secondary"}>
//                     {product.isAvailable ? "Active" : "Disabled"}
//                   </Badge>
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <Button variant="outline" size="sm" onClick={() => toggleActive(product)} className="flex-1">
//                     {product.isAvailable ? "Disable" : "Enable"}
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
//                     <Edit2 className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
//             <DialogDescription>
//               {editingProduct ? "Update product information" : "Add a new product to your catalog"}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Product Name *</Label>
//               <Input
//                 placeholder="e.g., Organic Cotton T-Shirt"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Description *</Label>
//               <Textarea
//                 placeholder="Describe the product"
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Price ($) *</Label>
//                 <Input
//                   type="number"
//                   placeholder="29.99"
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Stock</Label>
//                 <Input
//                   type="number"
//                   placeholder="50"
//                   value={formData.stock}
//                   onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Category</Label>
//               <Input
//                 placeholder="e.g., Clothing"
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Product Images (Carousel)</Label>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Enter image URL"
//                   value={formData.newImageUrl}
//                   onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
//                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
//                 />
//                 <Button type="button" variant="outline" onClick={addImage}>
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Add multiple images to create a carousel. First image will be the main display.
//               </p>

//               {formData.images.length > 0 && (
//                 <div className="mt-3 space-y-2">
//                   <p className="text-sm font-medium">Images ({formData.images.length})</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     {formData.images.map((url, index) => (
//                       <div key={index} className="relative group">
//                         <div className="aspect-video rounded-lg border bg-muted overflow-hidden">
//                           <img
//                             src={url || "/placeholder.svg"}
//                             alt={`Product ${index + 1}`}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={() => removeImage(index)}
//                         >
//                           <X className="h-3 w-3" />
//                         </Button>
//                         {index === 0 && <Badge className="absolute bottom-1 left-1 text-xs">Main Image</Badge>}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {formData.images.length === 0 && (
//                 <div className="mt-2 flex items-center justify-center h-32 border-2 border-dashed rounded-lg bg-muted/20">
//                   <div className="text-center">
//                     <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground">No images added yet</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               {editingProduct ? "Update" : "Add"} Product
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
import { Plus, Edit2, Trash2, Package, Loader2, X, ImageIcon, Upload } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProducts, deleteProduct, updateProduct, saveProducts } from "@/actions/ai-setup-actions"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/ui/file-upload"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string | null
  imageUrl: string | null
  images: string[]
  isAvailable: boolean
}

export function ProductsTab({ onUpdate }: { onUpdate?: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[],
    newImageUrl: "",
  })

  const [uploadMode, setUploadMode] = useState<"manual" | "upload">("manual")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      onUpdate?.()
      toast({
        title: "Product deleted",
        description: "Product has been removed from your catalog",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isAvailable: !product.isAvailable })
      setProducts(products.map((p) => (p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p)))
      toast({
        title: product.isAvailable ? "Product disabled" : "Product enabled",
        description: `${product.name} is now ${!product.isAvailable ? "available" : "unavailable"} for AI recommendations`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      stock: product.stock.toString(),
      category: product.category || "",
      images: product.images || [],
      newImageUrl: "",
    })
    setShowDialog(true)
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      images: [],
      newImageUrl: "",
    })
    setShowDialog(true)
  }

  const addImage = () => {
    if (formData.newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, formData.newImageUrl.trim()],
        newImageUrl: "",
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Math.round(Number.parseFloat(formData.price) * 100),
        stock: Number.parseInt(formData.stock) || 0,
        category: formData.category || null,
        images: formData.images,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast({
          title: "Product updated",
          description: "Your changes have been saved",
        })
      } else {
        await saveProducts([productData])
        toast({
          title: "Product added",
          description: "New product has been added to your catalog",
        })
      }

      setShowDialog(false)
      await loadProducts()
      onUpdate?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Product Catalog</CardTitle>
              <CardDescription>Products the AI can search and recommend to customers</CardDescription>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
      </Card>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No products yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add products so your AI can recommend them to customers
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              {product.images && product.images.length > 0 && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <Badge className="absolute bottom-2 right-2 bg-black/60 text-white">
                      +{product.images.length - 1} more
                    </Badge>
                  )}
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {product.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{product.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">${(product.price / 100).toFixed(2)}</Badge>
                  {product.category && <Badge variant="outline">{product.category}</Badge>}
                  <Badge variant="outline">Stock: {product.stock}</Badge>
                  <Badge variant={product.isAvailable ? "default" : "secondary"}>
                    {product.isAvailable ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(product)} className="flex-1">
                    {product.isAvailable ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                placeholder="e.g., Organic Cotton T-Shirt"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe the product"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($) *</Label>
                <Input
                  type="number"
                  placeholder="29.99"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="e.g., Clothing"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Product Images (Carousel)</Label>
              <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "manual" | "upload")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Enter URL</TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Files
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL"
                      value={formData.newImageUrl}
                      onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" variant="outline" onClick={addImage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload">
                  <FileUpload
                    type="product"
                    accept="image/*"
                    multiple
                    maxFiles={10}
                    onUploadComplete={(urls) => {
                      setFormData({
                        ...formData,
                        images: [...formData.images, ...urls],
                      })
                      setUploadMode("manual")
                    }}
                    preview
                  />
                </TabsContent>
              </Tabs>
              
              <p className="text-xs text-muted-foreground">
                Add multiple images to create a carousel. First image will be the main display.
              </p>

              {formData.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium">Images ({formData.images.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video rounded-lg border bg-muted overflow-hidden">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && <Badge className="absolute bottom-1 left-1 text-xs">Main Image</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="mt-2 flex items-center justify-center h-32 border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No images added yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
