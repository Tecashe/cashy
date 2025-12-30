"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Package, Info, ArrowRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category?: string
  stock: number
}

interface ProductSetupStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function ProductSetupStep({ data, onComplete, onNext, onBack, onSkip }: ProductSetupStepProps) {
  const [hasProducts, setHasProducts] = useState(data?.hasProducts ?? true)
  const [products, setProducts] = useState<Product[]>(data?.products || [])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([
        ...products,
        {
          ...newProduct,
          id: Math.random().toString(),
        } as Product,
      ])
      setNewProduct({ name: "", description: "", price: 0, stock: 0, category: "" })
      setShowAddForm(false)
    }
  }

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleContinue = () => {
    onComplete({ hasProducts, products })
    onNext()
  }

  const handleSkipStep = () => {
    onComplete({ hasProducts: false, products: [] })
    onSkip()
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Why add products?</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>The AI can search and recommend products when customers ask questions</li>
              <li>Send beautiful product carousels directly in Instagram DMs</li>
              <li>Process orders and create payment links automatically</li>
              <li>Track inventory and notify customers about availability</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Do you sell products or services?</CardTitle>
              <CardDescription>
                Enable this if you want the AI to help sell and recommend your offerings
              </CardDescription>
            </div>
            <Switch checked={hasProducts} onCheckedChange={setHasProducts} />
          </div>
        </CardHeader>
      </Card>

      {hasProducts && (
        <>
          {products.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Products ({products.length})</h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold">{product.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary">${(product.price / 100).toFixed(2)}</Badge>
                            {product.category && <Badge variant="outline">{product.category}</Badge>}
                            <Badge variant="outline">Stock: {product.stock}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(product.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(showAddForm || products.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add a Product</CardTitle>
                <CardDescription>Add your first product so the AI can start recommending and selling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Organic Cotton T-Shirt"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (in cents) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="2999 = $29.99"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">Enter price in cents: 2999 = $29.99</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the product, its features, and benefits"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Clothing"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={newProduct.stock || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.price}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  {products.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false)
                        setNewProduct({ name: "", description: "", price: 0, stock: 0 })
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <div className="flex gap-2">
          {!hasProducts || products.length === 0 ? (
            <Button variant="ghost" onClick={handleSkipStep} size="lg">
              Skip for Now
            </Button>
          ) : null}
          <Button onClick={handleContinue} disabled={hasProducts && products.length === 0} size="lg">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
