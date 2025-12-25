// "use client"

// import { useEffect, useState } from "react"
// import { ShoppingBag, Check, CreditCard, Package } from "lucide-react"

// export function AdvancedDMSimulation() {
//   const [step, setStep] = useState(0)
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
//   const [showCursor, setShowCursor] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

//   useEffect(() => {
//     const sequence = [
//       { delay: 500, action: () => setStep(1) },
//       { delay: 2000, action: () => setStep(2) },
//       { delay: 3500, action: () => setShowCursor(true) },
//       { delay: 4000, action: () => setCursorPos({ x: 100, y: 200 }) },
//       {
//         delay: 5000,
//         action: () => {
//           setSelectedProduct(0)
//           setShowCursor(false)
//         },
//       },
//       { delay: 6000, action: () => setStep(3) },
//       { delay: 7500, action: () => setStep(4) },
//       { delay: 9000, action: () => setStep(5) },
//       { delay: 11000, action: () => setStep(6) },
//       {
//         delay: 13000,
//         action: () => {
//           setStep(0)
//           setSelectedProduct(null)
//           setShowCursor(false)
//         },
//       },
//     ]

//     const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
//     return () => timers.forEach(clearTimeout)
//   }, [])

//   const products = [
//     { name: "Designer Handbag", price: "$299", color: "bg-maroon", image: "/ecommerce-shopping-bags-and-products.jpg" },
//     { name: "Leather Shoes", price: "$199", color: "bg-brown", image: "/ecommerce-shopping-bags-and-products.jpg" },
//     { name: "Sunglasses", price: "$149", color: "bg-yellow", image: "/ecommerce-shopping-bags-and-products.jpg" },
//   ]

//   return (
//     <section className="py-16 lg:py-20 relative overflow-hidden">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="text-center mb-8 lg:mb-12">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
//             Watch <span className="text-orange">Magic</span> Happen
//           </h2>
//           <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
//             See how yazzil turns casual browsers into paying customers in seconds
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//             <div className="relative order-2 lg:order-1">
//               <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
//                 <div className="bg-muted px-4 py-4 border-b border-border flex items-center gap-3">
//                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange flex items-center justify-center">
//                     <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-black" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm md:text-base">Luxury Boutique</p>
//                     <p className="text-xs text-green flex items-center gap-1">
//                       <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
//                       Active now
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-4 md:p-6 space-y-4 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] relative bg-background/50">
//                   {step >= 1 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
//                         <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm leading-relaxed">
//                           Hey there! 👋 Welcome to our boutique! Looking for something special today?
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 2 && (
//                     <div className="flex gap-2 md:gap-3 animate-fade-in">
//                       <div className="w-8 md:w-10 flex-shrink-0" />
//                       <div className="space-y-3 flex-1">
//                         <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3">
//                           <p className="text-xs md:text-sm">Check out our bestsellers! 🔥</p>
//                         </div>

//                         {products.map((product, index) => (
//                           <div
//                             key={index}
//                             className={`bg-card border-2 ${selectedProduct === index ? "border-green scale-105" : "border-border"} rounded-2xl p-3 md:p-4 transition-all duration-300 cursor-pointer hover:border-green/50`}
//                           >
//                             <div className="flex items-center gap-3 md:gap-4">
//                               <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl relative overflow-hidden flex-shrink-0">
//                                 <img
//                                   src={product.image || "/placeholder.svg"}
//                                   alt={product.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-semibold text-xs md:text-base truncate">{product.name}</p>
//                                 <p className="text-xs md:text-sm text-muted-foreground">{product.price}</p>
//                                 <button className="mt-1 md:mt-2 text-xs bg-green text-black px-2 md:px-4 py-1 md:py-1.5 rounded-full font-medium hover:bg-green/90 transition-colors">
//                                   Add to Cart
//                                 </button>
//                               </div>
//                               {selectedProduct === index && (
//                                 <Check className="w-4 h-4 md:w-6 md:h-6 text-green flex-shrink-0" />
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {step >= 3 && (
//                     <div className="flex gap-3 justify-end animate-slide-in-right">
//                       <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm text-black font-medium">I&apos;ll take the Designer Handbag!</p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 4 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
//                         <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm mb-3">Excellent choice! ✨ Added to your cart.</p>
//                         <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
//                           <div className="flex items-center gap-2 md:gap-3">
//                             <Package className="w-4 h-4 md:w-5 md:h-5 text-orange" />
//                             <div>
//                               <p className="text-xs font-semibold">Cart Total</p>
//                               <p className="text-sm md:text-base font-bold text-orange">$299</p>
//                             </div>
//                           </div>
//                           <button className="bg-orange text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold hover:bg-orange/90 transition-colors flex items-center gap-2">
//                             <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
//                             Checkout
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 5 && (
//                     <div className="flex gap-3 justify-end animate-slide-in-right">
//                       <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm text-black font-medium">Yes, let&apos;s checkout!</p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 6 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
//                         <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm font-medium text-green">
//                           🎉 Order confirmed! You&apos;ll receive tracking info shortly. Thanks for shopping with us!
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {showCursor && (
//                     <div
//                       className="absolute pointer-events-none transition-all duration-1000 ease-out z-50"
//                       style={{
//                         left: `${cursorPos.x}px`,
//                         top: `${cursorPos.y}px`,
//                       }}
//                     >
//                       <svg
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         className="drop-shadow-2xl md:w-7 md:h-7"
//                       >
//                         <path
//                           d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
//                           fill="#ff6b35"
//                           stroke="#0a0a0a"
//                           strokeWidth="1.5"
//                         />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
//               <div className="space-y-4 lg:space-y-6">
//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-orange">1</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Instant Engagement</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Respond to customer inquiries in milliseconds, not hours
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-green">2</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Visual Product Catalogs</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Showcase your products with beautiful, interactive cards
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-purple">3</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Seamless Checkout</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Complete transactions without leaving Instagram
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-red">4</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Order Tracking</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Keep customers updated every step of the way
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-card border-2 border-orange/20 rounded-2xl p-4 md:p-6">
//                 <p className="text-xs md:text-sm text-muted-foreground mb-2">Average conversion rate</p>
//                 <p className="text-3xl md:text-4xl font-bold text-orange mb-2">34.7%</p>
//                 <p className="text-xs md:text-sm text-muted-foreground">vs 2.3% industry average</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// "use client"

// import { useEffect, useState, useRef } from "react"
// import { ShoppingBag, Check, CreditCard, Package, Sparkles } from "lucide-react"

// export function AdvancedDMSimulation() {
//   const [step, setStep] = useState(0)
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
//   const [showCursor, setShowCursor] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)

//   const scrollToBottom = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollTo({
//         top: containerRef.current.scrollHeight,
//         behavior: "smooth",
//       })
//     }
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [step])

//   useEffect(() => {
//     const sequence = [
//       { delay: 500, action: () => setStep(1) },
//       { delay: 2500, action: () => setStep(2) },
//       { delay: 4000, action: () => setShowCursor(true) },
//       { delay: 4500, action: () => setCursorPos({ x: 120, y: 280 }) },
//       {
//         delay: 5500,
//         action: () => {
//           setSelectedProduct(0)
//           setShowCursor(false)
//         },
//       },
//       { delay: 6500, action: () => setStep(3) },
//       { delay: 8000, action: () => setStep(4) },
//       { delay: 10000, action: () => setStep(5) },
//       { delay: 11500, action: () => setStep(6) },
//       { delay: 13500, action: () => setStep(7) },
//       {
//         delay: 16000,
//         action: () => {
//           setStep(0)
//           setSelectedProduct(null)
//           setShowCursor(false)
//         },
//       },
//     ]

//     const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
//     return () => timers.forEach(clearTimeout)
//   }, [])

//   const products = [
//     {
//       name: "Designer Handbag",
//       price: "$299",
//       emoji: "👜",
//       image: "/luxury-designer-handbag-brown-leather.jpg",
//     },
//     {
//       name: "Leather Sneakers",
//       price: "$199",
//       emoji: "👟",
//       image: "/premium-leather-sneakers-white.jpg",
//     },
//     {
//       name: "Sunglasses",
//       price: "$149",
//       emoji: "🕶️",
//       image: "/designer-sunglasses-black-aviator.jpg",
//     },
//   ]

//   return (
//     <section className="py-16 lg:py-20 relative overflow-hidden">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="text-center mb-8 lg:mb-12">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
//             Watch <span className="text-orange">Magic</span> Happen
//           </h2>
//           <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
//             See how yazzil turns casual browsers into paying customers in seconds
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//             <div className="relative order-2 lg:order-1">
//               <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
//                 <div className="bg-muted px-4 py-4 border-b border-border flex items-center gap-3">
//                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange flex items-center justify-center">
//                     <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-black" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm md:text-base">Luxury Boutique</p>
//                     <p className="text-xs text-green flex items-center gap-1">
//                       <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
//                       Active now
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   ref={containerRef}
//                   className="p-4 md:p-6 space-y-4 h-[400px] md:h-[500px] lg:h-[600px] overflow-y-auto relative bg-background/50 scroll-smooth"
//                 >
//                   {step >= 1 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
//                         <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm leading-relaxed">
//                           Hey there! 👋 Welcome to our boutique! I&apos;m here to help you find something amazing today! What
//                           catches your eye?
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 2 && (
//                     <div className="flex gap-2 md:gap-3 animate-fade-in">
//                       <div className="w-8 md:w-10 flex-shrink-0" />
//                       <div className="space-y-3 flex-1">
//                         <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3">
//                           <p className="text-xs md:text-sm">
//                             Check out our bestsellers! 🔥 These are flying off the shelves!
//                           </p>
//                         </div>

//                         {products.map((product, index) => (
//                           <div
//                             key={index}
//                             className={`bg-card border-2 ${selectedProduct === index ? "border-green scale-105" : "border-border"} rounded-2xl p-3 md:p-4 transition-all duration-300 cursor-pointer hover:border-green/50`}
//                           >
//                             <div className="flex items-center gap-3 md:gap-4">
//                               <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl relative overflow-hidden flex-shrink-0 bg-muted">
//                                 <img
//                                   src={product.image || "/placeholder.svg"}
//                                   alt={product.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-semibold text-xs md:text-base truncate">
//                                   {product.name} {product.emoji}
//                                 </p>
//                                 <p className="text-xs md:text-sm text-muted-foreground">{product.price}</p>
//                                 <button className="mt-1 md:mt-2 text-xs bg-green text-black px-2 md:px-4 py-1 md:py-1.5 rounded-full font-medium hover:bg-green/90 transition-colors">
//                                   Add to Cart
//                                 </button>
//                               </div>
//                               {selectedProduct === index && (
//                                 <Check className="w-4 h-4 md:w-6 md:h-6 text-green flex-shrink-0" />
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {step >= 3 && (
//                     <div className="flex gap-3 justify-end animate-slide-in-right">
//                       <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm text-black font-medium">
//                           Omg that Designer Handbag is gorgeous! 😍 I&apos;ll take it!
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 4 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
//                         <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm mb-3">
//                           Excellent taste! ✨ That&apos;s one of our favorites! Added to your cart.
//                         </p>
//                         <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
//                           <div className="flex items-center gap-2 md:gap-3">
//                             <Package className="w-4 h-4 md:w-5 md:h-5 text-orange" />
//                             <div>
//                               <p className="text-xs font-semibold">Cart Total</p>
//                               <p className="text-sm md:text-base font-bold text-orange">$299</p>
//                             </div>
//                           </div>
//                           <button className="bg-orange text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold hover:bg-orange/90 transition-colors flex items-center gap-2">
//                             <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
//                             Checkout
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 5 && (
//                     <div className="flex gap-3 justify-end animate-slide-in-right">
//                       <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm text-black font-medium">Perfect! Let&apos;s do this! 💳</p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 6 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
//                         <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm">Processing your order... 🎁</p>
//                       </div>
//                     </div>
//                   )}

//                   {step >= 7 && (
//                     <div className="flex gap-2 md:gap-3 animate-slide-in-left">
//                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
//                         <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
//                       </div>
//                       <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
//                         <p className="text-xs md:text-sm font-medium text-green">
//                           🎉 Woohoo! Order confirmed! Your Designer Handbag is on its way! You&apos;ll get tracking info in a
//                           few minutes. Thanks for shopping with us! 💕
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   <div ref={messagesEndRef} />

//                   {showCursor && (
//                     <div
//                       className="absolute pointer-events-none transition-all duration-1000 ease-out z-50"
//                       style={{
//                         left: `${cursorPos.x}px`,
//                         top: `${cursorPos.y}px`,
//                       }}
//                     >
//                       <svg
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         className="drop-shadow-2xl md:w-7 md:h-7"
//                       >
//                         <path
//                           d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
//                           fill="#ff6b35"
//                           stroke="#0a0a0a"
//                           strokeWidth="1.5"
//                         />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
//               <div className="space-y-4 lg:space-y-6">
//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-orange">1</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Instant Engagement</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Respond to customer inquiries in milliseconds, not hours
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-green">2</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Visual Product Catalogs</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Showcase your products with beautiful, interactive cards
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-purple">3</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Seamless Checkout</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Complete transactions without leaving Instagram
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 md:gap-4">
//                   <div className="w-10 h-10 md:w-12 md:h-12 bg-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <span className="text-xl md:text-2xl font-bold text-red">4</span>
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Order Tracking</h3>
//                     <p className="text-sm md:text-base text-muted-foreground">
//                       Keep customers updated every step of the way
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-card border-2 border-orange/20 rounded-2xl p-4 md:p-6">
//                 <p className="text-xs md:text-sm text-muted-foreground mb-2">Average conversion rate</p>
//                 <p className="text-3xl md:text-4xl font-bold text-orange mb-2">34.7%</p>
//                 <p className="text-xs md:text-sm text-muted-foreground">vs 2.3% industry average</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }



"use client"

import { useEffect, useState, useRef } from "react"
import {
  ShoppingBag,
  Check,
  CreditCard,
  Package,
  Sparkles,
  Calendar,
  MessageCircle,
  Heart,
  ImageIcon,
} from "lucide-react"

type Scenario = "ecommerce" | "story" | "comment" | "booking" | "support"

export function AdvancedDMSimulation() {
  const [scenario, setScenario] = useState<Scenario>("ecommerce")
  const [step, setStep] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [step])

  useEffect(() => {
    const scenarios: Scenario[] = ["ecommerce", "story", "comment", "booking", "support"]
    let currentScenarioIndex = 0

    const cycleScenario = () => {
      setStep(0)
      setSelectedProduct(null)
      setShowCursor(false)
      currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length
      setScenario(scenarios[currentScenarioIndex])
    }

    // Each scenario runs for ~18 seconds before switching
    const scenarioCycleTimer = setInterval(cycleScenario, 18000)

    return () => clearInterval(scenarioCycleTimer)
  }, [])

  useEffect(() => {
    let timers: NodeJS.Timeout[] = []

    if (scenario === "ecommerce") {
      const sequence = [
        { delay: 500, action: () => setStep(1) },
        { delay: 2500, action: () => setStep(2) },
        { delay: 4000, action: () => setShowCursor(true) },
        { delay: 4500, action: () => setCursorPos({ x: 120, y: 280 }) },
        {
          delay: 5500,
          action: () => {
            setSelectedProduct(0)
            setShowCursor(false)
          },
        },
        { delay: 6500, action: () => setStep(3) },
        { delay: 8000, action: () => setStep(4) },
        { delay: 10000, action: () => setStep(5) },
        { delay: 11500, action: () => setStep(6) },
        { delay: 13500, action: () => setStep(7) },
      ]
      timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    } else if (scenario === "story") {
      const sequence = [
        { delay: 500, action: () => setStep(1) },
        { delay: 2500, action: () => setStep(2) },
        { delay: 4500, action: () => setStep(3) },
        { delay: 6500, action: () => setStep(4) },
        { delay: 8500, action: () => setStep(5) },
        { delay: 10500, action: () => setStep(6) },
      ]
      timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    } else if (scenario === "comment") {
      const sequence = [
        { delay: 500, action: () => setStep(1) },
        { delay: 2500, action: () => setStep(2) },
        { delay: 4500, action: () => setStep(3) },
        { delay: 6500, action: () => setStep(4) },
        { delay: 8500, action: () => setStep(5) },
      ]
      timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    } else if (scenario === "booking") {
      const sequence = [
        { delay: 500, action: () => setStep(1) },
        { delay: 2500, action: () => setStep(2) },
        { delay: 4500, action: () => setStep(3) },
        { delay: 6500, action: () => setStep(4) },
        { delay: 8500, action: () => setStep(5) },
        { delay: 10500, action: () => setStep(6) },
      ]
      timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    } else if (scenario === "support") {
      const sequence = [
        { delay: 500, action: () => setStep(1) },
        { delay: 2500, action: () => setStep(2) },
        { delay: 4500, action: () => setStep(3) },
        { delay: 6500, action: () => setStep(4) },
        { delay: 8500, action: () => setStep(5) },
      ]
      timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    }

    return () => timers.forEach(clearTimeout)
  }, [scenario])

  const products = [
    { name: "Designer Handbag", price: "$299", emoji: "👜", image: "/luxury-designer-handbag-brown-leather.jpg" },
    { name: "Leather Sneakers", price: "$199", emoji: "👟", image: "/premium-leather-sneakers-white.jpg" },
    { name: "Sunglasses", price: "$149", emoji: "🕶️", image: "/designer-sunglasses-black-aviator.jpg" },
  ]

  const scenarioConfig = {
    ecommerce: { name: "Boutique", icon: ShoppingBag, color: "orange" },
    story: { name: "Fashion", icon: ImageIcon, color: "purple" },
    comment: { name: "Fitness", icon: Heart, color: "red" },
    booking: { name: "Beauty", icon: Calendar, color: "green" },
    support: { name: "Tech Support", icon: MessageCircle, color: "yellow" },
  }

  const config = scenarioConfig[scenario]
  const Icon = config.icon

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
            Watch <span className="text-orange">Magic</span> Happen
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            See how yazzil automates every type of Instagram interaction
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="relative order-2 lg:order-1">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {Object.entries(scenarioConfig).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setScenario(key as Scenario)
                      setStep(0)
                      setSelectedProduct(null)
                      setShowCursor(false)
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      scenario === key
                        ? `bg-${value.color} text-black`
                        : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>

              <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-muted px-4 py-4 border-b border-border flex items-center gap-3">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-${config.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">{config.name}</p>
                    <p className={`text-xs text-${config.color} flex items-center gap-1`}>
                      <span className={`w-2 h-2 bg-${config.color} rounded-full animate-pulse`} />
                      Active now
                    </p>
                  </div>
                </div>

                <div
                  ref={containerRef}
                  className="p-4 md:p-6 space-y-4 h-[400px] md:h-[500px] lg:h-[600px] overflow-y-auto relative bg-background/50 scroll-smooth"
                >
                  {scenario === "ecommerce" && (
                    <>
                      {step >= 1 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm leading-relaxed">
                              Hey there! 👋 Welcome to our boutique! I&apos;m here to help you find something amazing today!
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 2 && (
                        <div className="flex gap-2 md:gap-3 animate-fade-in">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="space-y-3 flex-1">
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3">
                              <p className="text-xs md:text-sm">Check out our bestsellers! 🔥</p>
                            </div>

                            {products.map((product, index) => (
                              <div
                                key={index}
                                className={`bg-card border-2 ${selectedProduct === index ? "border-green scale-105" : "border-border"} rounded-2xl p-3 md:p-4 transition-all duration-300 cursor-pointer`}
                                onClick={() => setSelectedProduct(index)}
                              >
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl relative overflow-hidden flex-shrink-0 bg-muted">
                                    <img
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs md:text-base truncate">
                                      {product.name} {product.emoji}
                                    </p>
                                    <p className="text-xs md:text-sm text-muted-foreground">{product.price}</p>
                                    <button className="mt-1 md:mt-2 text-xs bg-green text-black px-2 md:px-4 py-1 md:py-1.5 rounded-full font-medium hover:bg-green/90 transition-colors">
                                      Add to Cart
                                    </button>
                                  </div>
                                  {selectedProduct === index && (
                                    <Check className="w-4 h-4 md:w-6 md:h-6 text-green flex-shrink-0" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step >= 3 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">
                              That Designer Handbag is gorgeous! 😍
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 4 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm mb-3">Excellent taste! ✨ Added to cart.</p>
                            <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2 md:gap-3">
                                <Package className="w-4 h-4 md:w-5 md:h-5 text-orange" />
                                <div>
                                  <p className="text-xs font-semibold">Cart Total</p>
                                  <p className="text-sm md:text-base font-bold text-orange">$299</p>
                                </div>
                              </div>
                              <button className="bg-orange text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold hover:bg-orange/90 transition-colors flex items-center gap-2">
                                <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                                Checkout
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 5 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">Let&apos;s do this! 💳</p>
                          </div>
                        </div>
                      )}

                      {step >= 6 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">Processing your order... 🎁</p>
                          </div>
                        </div>
                      )}

                      {step >= 7 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm font-medium text-green">
                              🎉 Order confirmed! Your handbag is on its way! 💕
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {scenario === "story" && (
                    <>
                      {step >= 1 && (
                        <div className="flex gap-2 md:gap-3 animate-fade-in">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="bg-purple/20 border border-purple rounded-2xl p-3 md:p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="w-4 h-4 text-purple" />
                                <p className="text-xs font-semibold text-purple">Story Reply</p>
                              </div>
                              <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden mb-2 bg-muted">
                                <img
                                  src="/fashion-model-wearing-new-summer-collection.jpg"
                                  alt="Story"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground italic">&ldquo;OMG this collection is fire! 🔥&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 2 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">
                              Thank you so much! 😊 We&apos;re so excited about this drop!
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 3 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm mb-2">
                              Want early access? Here&apos;s an exclusive 20% off code just for you! 🎁
                            </p>
                            <div className="bg-purple/20 border border-purple rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-purple">SUMMER20</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 4 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-purple rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">Yesss! Thank you! 💜</p>
                          </div>
                        </div>
                      )}

                      {step >= 5 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">Shop now at our link in bio! Code expires in 24hrs ⏰</p>
                          </div>
                        </div>
                      )}

                      {step >= 6 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-purple rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">On it! 🏃‍♀️</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {scenario === "comment" && (
                    <>
                      {step >= 1 && (
                        <div className="flex gap-2 md:gap-3 animate-fade-in">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="bg-red/20 border border-red rounded-2xl p-3 md:p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-red" />
                                <p className="text-xs font-semibold text-red">Post Comment</p>
                              </div>
                              <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden mb-2 bg-muted">
                                <img
                                  src="/fitness-workout-gym-motivation.jpg"
                                  alt="Post"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground italic">&ldquo;How do I join your classes? 💪&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 2 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red flex items-center justify-center flex-shrink-0">
                            <Heart className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">
                              Hey! Thanks for your interest! 🙌 Let me help you get started!
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 3 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm mb-2">We have 3 membership options:</p>
                            <div className="space-y-2">
                              <div className="bg-card border border-border rounded-lg p-2">
                                <p className="text-xs font-semibold">Basic - $29/mo</p>
                                <p className="text-xs text-muted-foreground">3 classes/week</p>
                              </div>
                              <div className="bg-card border border-border rounded-lg p-2">
                                <p className="text-xs font-semibold">Pro - $49/mo</p>
                                <p className="text-xs text-muted-foreground">Unlimited classes</p>
                              </div>
                              <div className="bg-card border border-red rounded-lg p-2 bg-red/10">
                                <p className="text-xs font-semibold text-red">Elite - $79/mo</p>
                                <p className="text-xs text-muted-foreground">Unlimited + PT sessions</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 4 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-red rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">Pro sounds perfect!</p>
                          </div>
                        </div>
                      )}

                      {step >= 5 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm font-medium text-green">
                              Awesome choice! 🎉 Click here to sign up and get your first week FREE! 💪
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {scenario === "booking" && (
                    <>
                      {step >= 1 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-yellow rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">
                              Hi! I&apos;d like to book a haircut 💇‍♀️
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 2 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">Perfect! Let me show you available times this week 📅</p>
                          </div>
                        </div>
                      )}

                      {step >= 3 && (
                        <div className="flex gap-2 md:gap-3 animate-fade-in">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <div className="space-y-2">
                              <div className="bg-card border border-border rounded-lg p-2 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-semibold">Tomorrow</p>
                                  <p className="text-xs text-muted-foreground">2:00 PM</p>
                                </div>
                                <button className="bg-yellow text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow/90 transition-colors">
                                  Book
                                </button>
                              </div>
                              <div className="bg-card border border-border rounded-lg p-2 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-semibold">Friday</p>
                                  <p className="text-xs text-muted-foreground">10:00 AM</p>
                                </div>
                                <button className="bg-green text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow/90 transition-colors">
                                  Book
                                </button>
                              </div>
                              <div className="bg-card border border-border rounded-lg p-2 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-semibold">Saturday</p>
                                  <p className="text-xs text-muted-foreground">3:30 PM</p>
                                </div>
                                <button className="bg-green text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow/90 transition-colors">
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 4 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-green rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">Tomorrow at 2 PM works!</p>
                          </div>
                        </div>
                      )}

                      {step >= 5 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">Booking confirmed! ✨</p>
                          </div>
                        </div>
                      )}

                      {step >= 6 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm font-medium text-green">
                              📅 Tomorrow, 2:00 PM with Sarah
                              <br />📍 123 Main St
                              <br />
                              We&apos;ll send you a reminder! See you soon! 💚
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {scenario === "support" && (
                    <>
                      {step >= 1 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-yellow rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">
                              Help! My order hasn&apos;t arrived yet 😰
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 2 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm">
                              I&apos;m so sorry to hear that! Let me check on your order right away 🔍
                            </p>
                          </div>
                        </div>
                      )}

                      {step >= 3 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 md:w-10 flex-shrink-0" />
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm mb-2">Found it! Here&apos;s your tracking info:</p>
                            <div className="bg-card border border-border rounded-lg p-3">
                              <p className="text-xs font-semibold mb-1">Order #12345</p>
                              <p className="text-xs text-muted-foreground mb-2">Status: Out for delivery 🚚</p>
                              <div className="bg-yellow/20 border border-yellow rounded p-2">
                                <p className="text-xs font-medium text-yellow">Expected today by 6 PM</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step >= 4 && (
                        <div className="flex gap-3 justify-end animate-slide-in-right">
                          <div className="bg-yellow rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm text-black font-medium">Oh perfect! Thank you! 🙏</p>
                          </div>
                        </div>
                      )}

                      {step >= 5 && (
                        <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                            <p className="text-xs md:text-sm font-medium text-green">
                              You&apos;re welcome! We&apos;ll notify you when it&apos;s delivered. Anything else I can help with? 😊
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div ref={messagesEndRef} />

                  {showCursor && (
                    <div
                      className="absolute pointer-events-none transition-all duration-1000 ease-out z-50"
                      style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="drop-shadow-2xl md:w-7 md:h-7"
                      >
                        <path
                          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                          fill="#ff6b35"
                          stroke="#0a0a0a"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-orange">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Instant Engagement</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Respond to customer inquiries in milliseconds, not hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-green">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Visual Product Catalogs</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Showcase your products with beautiful, interactive cards
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-purple">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Seamless Checkout</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Complete transactions without leaving Instagram
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-red">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Order Tracking</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Keep customers updated every step of the way
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-orange/20 rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Average conversion rate</p>
                <p className="text-3xl md:text-4xl font-bold text-orange mb-2">34.7%</p>
                <p className="text-xs md:text-sm text-muted-foreground">vs 2.3% industry average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
