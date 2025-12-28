// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch';
// import { 
//   Plus, Search, Package, DollarSign, BarChart3, Upload, 
//   Edit, Trash2, Copy, Eye, EyeOff, Image as ImageIcon, 
//   TrendingUp, AlertCircle, CheckCircle, Zap, ShoppingCart,
//   FileUp, Download, Grid, List, Filter, SortAsc
// } from 'lucide-react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export default function ProductCatalogManager() {
//   const [products, setProducts] = useState([
//     {
//       id: '1',
//       name: 'Premium Wireless Headphones',
//       description: 'High-quality noise-cancelling headphones with 30-hour battery life',
//       price: 29999,
//       compareAtPrice: 39999,
//       category: 'Electronics',
//       stock: 45,
//       isAvailable: true,
//       imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
//       sku: 'WH-001',
//       tags: ['bestseller', 'premium'],
//       sales: 234,
//     },
//     {
//       id: '2',
//       name: 'Organic Cotton T-Shirt',
//       description: 'Eco-friendly, comfortable everyday wear',
//       price: 2999,
//       compareAtPrice: null,
//       category: 'Clothing',
//       stock: 120,
//       isAvailable: true,
//       imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
//       sku: 'TS-002',
//       tags: ['organic', 'sustainable'],
//       sales: 567,
//     },
//     {
//       id: '3',
//       name: 'Smart Fitness Watch',
//       description: 'Track your workouts, heart rate, and sleep patterns',
//       price: 19999,
//       compareAtPrice: 24999,
//       category: 'Electronics',
//       stock: 0,
//       isAvailable: false,
//       imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
//       sku: 'FW-003',
//       tags: ['new'],
//       sales: 89,
//     },
//   ]);

//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<any>(null);
//   const [bulkImportModal, setBulkImportModal] = useState(false);

//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     compareAtPrice: '',
//     category: '',
//     stock: '',
//     imageUrl: '',
//     sku: '',
//     tags: '',
//   });

//   const stats = {
//     totalProducts: products.length,
//     activeProducts: products.filter(p => p.isAvailable).length,
//     totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
//     outOfStock: products.filter(p => p.stock === 0).length,
//   };

//   const categories = ['all', ...new Set(products.map(p => p.category))];

//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleAddProduct = () => {
//     setEditingProduct(null);
//     setNewProduct({
//       name: '',
//       description: '',
//       price: '',
//       compareAtPrice: '',
//       category: '',
//       stock: '',
//       imageUrl: '',
//       sku: '',
//       tags: '',
//     });
//     setShowProductModal(true);
//   };

//   const handleEditProduct = (product: any) => {
//     setEditingProduct(product);
//     setNewProduct({
//       name: product.name,
//       description: product.description,
//       price: (product.price / 100).toString(),
//       compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toString() : '',
//       category: product.category,
//       stock: product.stock.toString(),
//       imageUrl: product.imageUrl,
//       sku: product.sku,
//       tags: product.tags.join(', '),
//     });
//     setShowProductModal(true);
//   };

//   const handleSaveProduct = () => {
//     const productData = {
//       ...newProduct,
//       price: parseFloat(newProduct.price) * 100,
//       compareAtPrice: newProduct.compareAtPrice ? parseFloat(newProduct.compareAtPrice) * 100 : null,
//       stock: parseInt(newProduct.stock),
//       tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean),
//       isAvailable: true,
//       sales: 0,
//     };

//     if (editingProduct) {
//       setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
//     } else {
//       setProducts([...products, { id: Date.now().toString(), ...productData }]);
//     }
//     setShowProductModal(false);
//   };

//   const handleDeleteProduct = (id: string) => {
//     if (confirm('Are you sure you want to delete this product?')) {
//       setProducts(products.filter(p => p.id !== id));
//     }
//   };

//   const toggleProductAvailability = (id: string) => {
//     setProducts(products.map(p => 
//       p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
//     ));
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">Product Catalog</h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your products - AI will sell them automatically
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => setBulkImportModal(true)}>
//             <FileUp className="w-4 h-4 mr-2" />
//             Import CSV
//           </Button>
//           <Button onClick={handleAddProduct} size="lg" className="shadow-lg">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Product
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Products</p>
//                 <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
//               </div>
//               <Package className="w-8 h-8 text-blue-500" />
//             </div>
//             <div className="mt-3 flex items-center text-xs text-green-600">
//               <TrendingUp className="w-3 h-3 mr-1" />
//               <span>+12% from last month</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active</p>
//                 <p className="text-3xl font-bold mt-1">{stats.activeProducts}</p>
//               </div>
//               <CheckCircle className="w-8 h-8 text-green-500" />
//             </div>
//             <div className="mt-3 text-xs text-muted-foreground">
//               {stats.totalProducts - stats.activeProducts} inactive
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Inventory Value</p>
//                 <p className="text-3xl font-bold mt-1">
//                   ${(stats.totalValue / 100).toLocaleString()}
//                 </p>
//               </div>
//               <DollarSign className="w-8 h-8 text-yellow-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Out of Stock</p>
//                 <p className="text-3xl font-bold mt-1">{stats.outOfStock}</p>
//               </div>
//               <AlertCircle className={`w-8 h-8 ${stats.outOfStock > 0 ? 'text-red-500' : 'text-gray-400'}`} />
//             </div>
//             {stats.outOfStock > 0 && (
//               <div className="mt-3 text-xs text-red-600">
//                 Restock needed
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* AI Integration Banner */}
//       <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
//         <CardContent className="pt-6">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-purple-500 rounded-xl">
//               <Zap className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex-1">
//               <h3 className="font-semibold text-lg mb-1">AI is watching your catalog</h3>
//               <p className="text-sm text-muted-foreground mb-3">
//                 Your AI assistant can now browse these products, check inventory, and complete sales automatically in Instagram DMs.
//               </p>
//               <div className="flex gap-2">
//                 <Badge variant="secondary" className="gap-1">
//                   <CheckCircle className="w-3 h-3" />
//                   Product Search Enabled
//                 </Badge>
//                 <Badge variant="secondary" className="gap-1">
//                   <CheckCircle className="w-3 h-3" />
//                   Inventory Sync Active
//                 </Badge>
//                 <Badge variant="secondary" className="gap-1">
//                   <CheckCircle className="w-3 h-3" />
//                   Auto-checkout Ready
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Search and Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map(cat => (
//                   <SelectItem key={cat} value={cat}>
//                     {cat === 'all' ? 'All Categories' : cat}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className="flex gap-1 border rounded-lg p-1">
//               <Button
//                 variant={viewMode === 'grid' ? 'default' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant={viewMode === 'list' ? 'default' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Products Grid/List */}
//       {viewMode === 'grid' ? (
//         <div className="grid grid-cols-3 gap-6">
//           {filteredProducts.map(product => (
//             <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="relative aspect-square bg-muted">
//                 <img 
//                   src={product.imageUrl} 
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute top-2 right-2 flex gap-1">
//                   {product.stock === 0 && (
//                     <Badge variant="destructive">Out of Stock</Badge>
//                   )}
//                   {!product.isAvailable && (
//                     <Badge variant="secondary">Inactive</Badge>
//                   )}
//                   {product.tags.includes('bestseller') && (
//                     <Badge className="bg-yellow-500">⭐ Bestseller</Badge>
//                   )}
//                 </div>
//               </div>
//               <CardContent className="p-4 space-y-3">
//                 <div>
//                   <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
//                   <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
//                     {product.description}
//                   </p>
//                 </div>
                
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-2xl font-bold">
//                     ${(product.price / 100).toFixed(2)}
//                   </span>
//                   {product.compareAtPrice && (
//                     <span className="text-sm text-muted-foreground line-through">
//                       ${(product.compareAtPrice / 100).toFixed(2)}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Stock: {product.stock}</span>
//                   <span className="text-muted-foreground">Sales: {product.sales}</span>
//                 </div>

//                 <div className="flex gap-2 pt-2 border-t">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleEditProduct(product)}
//                   >
//                     <Edit className="w-3 h-3 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => toggleProductAvailability(product.id)}
//                   >
//                     {product.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleDeleteProduct(product.id)}
//                   >
//                     <Trash2 className="w-4 h-4 text-red-500" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="p-0">
//             <div className="divide-y">
//               {filteredProducts.map(product => (
//                 <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
//                   <img 
//                     src={product.imageUrl} 
//                     alt={product.name}
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold truncate">{product.name}</h3>
//                     <p className="text-sm text-muted-foreground truncate">{product.description}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold">${(product.price / 100).toFixed(2)}</p>
//                     <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {product.isAvailable ? (
//                       <Badge variant="secondary">Active</Badge>
//                     ) : (
//                       <Badge variant="outline">Inactive</Badge>
//                     )}
//                   </div>
//                   <div className="flex gap-1">
//                     <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
//                       <Trash2 className="w-4 h-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Add/Edit Product Modal */}
//       <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
//             <DialogDescription>
//               {editingProduct ? 'Update product details' : 'Add a new product to your catalog'}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Product Name *</Label>
//               <Input
//                 id="name"
//                 placeholder="Premium Wireless Headphones"
//                 value={newProduct.name}
//                 onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 placeholder="High-quality noise-cancelling headphones..."
//                 value={newProduct.description}
//                 onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                 rows={3}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="price">Price * ($)</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   step="0.01"
//                   placeholder="299.99"
//                   value={newProduct.price}
//                   onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
//                 <Input
//                   id="compareAtPrice"
//                   type="number"
//                   step="0.01"
//                   placeholder="399.99"
//                   value={newProduct.compareAtPrice}
//                   onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="category">Category *</Label>
//                 <Input
//                   id="category"
//                   placeholder="Electronics"
//                   value={newProduct.category}
//                   onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="stock">Stock *</Label>
//                 <Input
//                   id="stock"
//                   type="number"
//                   placeholder="50"
//                   value={newProduct.stock}
//                   onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="imageUrl">Image URL *</Label>
//               <Input
//                 id="imageUrl"
//                 placeholder="https://example.com/image.jpg"
//                 value={newProduct.imageUrl}
//                 onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Or <Button variant="link" className="h-auto p-0 text-xs">upload an image</Button>
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="sku">SKU</Label>
//                 <Input
//                   id="sku"
//                   placeholder="WH-001"
//                   value={newProduct.sku}
//                   onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="tags">Tags (comma-separated)</Label>
//                 <Input
//                   id="tags"
//                   placeholder="bestseller, premium"
//                   value={newProduct.tags}
//                   onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowProductModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveProduct}>
//               {editingProduct ? 'Update Product' : 'Add Product'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Bulk Import Modal */}
//       <Dialog open={bulkImportModal} onOpenChange={setBulkImportModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Import Products from CSV</DialogTitle>
//             <DialogDescription>
//               Upload a CSV file with your product catalog
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-3">
//               <FileUp className="w-12 h-12 mx-auto text-muted-foreground" />
//               <div>
//                 <p className="font-medium">Drop your CSV file here</p>
//                 <p className="text-sm text-muted-foreground">or click to browse</p>
//               </div>
//               <Button>Choose File</Button>
//             </div>

//             <div className="text-sm space-y-2">
//               <p className="font-medium">CSV Format:</p>
//               <code className="block bg-muted p-2 rounded text-xs">
//                 name,description,price,category,stock,imageUrl,sku
//               </code>
//               <Button variant="link" className="h-auto p-0 text-xs">
//                 <Download className="w-3 h-3 mr-1" />
//                 Download template
//               </Button>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setBulkImportModal(false)}>
//               Cancel
//             </Button>
//             <Button>Import Products</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Search, Package, DollarSign, BarChart3, Upload, 
  Edit, Trash2, Copy, Eye, EyeOff, ImagePlus, 
  TrendingUp, AlertCircle, CheckCircle, Zap, ShoppingCart,
  FileUp, Download, Grid, List, Filter, SortAsc
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductCatalogManager() {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality noise-cancelling headphones with 30-hour battery life',
      price: 29999,
      compareAtPrice: 39999,
      category: 'Electronics',
      stock: 45,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      sku: 'WH-001',
      tags: ['bestseller', 'premium'],
      sales: 234,
    },
    {
      id: '2',
      name: 'Organic Cotton T-Shirt',
      description: 'Eco-friendly, comfortable everyday wear',
      price: 2999,
      compareAtPrice: null,
      category: 'Clothing',
      stock: 120,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      sku: 'TS-002',
      tags: ['organic', 'sustainable'],
      sales: 567,
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      description: 'Track your workouts, heart rate, and sleep patterns',
      price: 19999,
      compareAtPrice: 24999,
      category: 'Electronics',
      stock: 0,
      isAvailable: false,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      sku: 'FW-003',
      tags: ['new'],
      sales: 89,
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [bulkImportModal, setBulkImportModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    stock: '',
    imageUrl: '',
    sku: '',
    tags: '',
  });

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isAvailable).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      category: '',
      stock: '',
      imageUrl: '',
      sku: '',
      tags: '',
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toString() : '',
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
      sku: product.sku,
      tags: product.tags.join(', '),
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price) * 100,
      compareAtPrice: newProduct.compareAtPrice ? parseFloat(newProduct.compareAtPrice) * 100 : null,
      stock: parseInt(newProduct.stock),
      tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean),
      isAvailable: true,
      sales: 0,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      setProducts([...products, { id: Date.now().toString(), ...productData }]);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products - AI will sell them automatically
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkImportModal(true)}>
            <FileUp className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={handleAddProduct} size="lg" className="shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-3 flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-1">{stats.activeProducts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {stats.totalProducts - stats.activeProducts} inactive
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-3xl font-bold mt-1">
                  ${(stats.totalValue / 100).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-3xl font-bold mt-1">{stats.outOfStock}</p>
              </div>
              <AlertCircle className={`w-8 h-8 ${stats.outOfStock > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            {stats.outOfStock > 0 && (
              <div className="mt-3 text-xs text-red-600">
                Restock needed
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Integration Banner */}
      <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">AI is watching your catalog</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your AI assistant can now browse these products, check inventory, and complete sales automatically in Instagram DMs.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Product Search Enabled
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Inventory Sync Active
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Auto-checkout Ready
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-muted">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.stock === 0 && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                  {!product.isAvailable && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {product.tags.includes('bestseller') && (
                    <Badge className="bg-yellow-500">⭐ Bestseller</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${(product.compareAtPrice / 100).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock: {product.stock}</span>
                  <span className="text-muted-foreground">Sales: {product.sales}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleProductAvailability(product.id)}
                  >
                    {product.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProducts.map(product => (
                <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(product.price / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.isAvailable ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product details' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Premium Wireless Headphones"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="High-quality noise-cancelling headphones..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price * ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="299.99"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  placeholder="399.99"
                  value={newProduct.compareAtPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="Electronics"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="50"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Or <Button variant="link" className="h-auto p-0 text-xs">upload an image</Button>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="WH-001"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="bestseller, premium"
                  value={newProduct.tags}
                  onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Modal */}
      <Dialog open={bulkImportModal} onOpenChange={setBulkImportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Products from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your product catalog
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-3">
              <FileUp className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <Button>Choose File</Button>
            </div>

            <div className="text-sm space-y-2">
              <p className="font-medium">CSV Format:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                name,description,price,category,stock,imageUrl,sku
              </code>
              <Button variant="link" className="h-auto p-0 text-xs">
                <Download className="w-3 h-3 mr-1" />
                Download template
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkImportModal(false)}>
              Cancel
            </Button>
            <Button>Import Products</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}