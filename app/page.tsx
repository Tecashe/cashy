// import { redirect } from "next/navigation"

// export default async function HomePage() {

//     const { auth } = await import("@clerk/nextjs/server")
//     const { userId } = await auth()

//     if (userId) {
//       redirect("/dashboard")
//     } else {
//       redirect("/sign-in")
//     }

// }

// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Check, Moon, Sun } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"

// export default function LandingPage() {
//   const [theme, setTheme] = useState<"light" | "dark">("dark")

//   useEffect(() => {
//     // Apply theme to document
//     document.documentElement.classList.toggle("dark", theme === "dark")
//   }, [theme])

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark")
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
//         <div className="mx-auto max-w-7xl px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-12">
//               <Link href="/" className="text-xl font-semibold tracking-tight">
//                 AutomateIG
//               </Link>
//               <div className="hidden items-center gap-8 md:flex">
//                 <Link
//                   href="#features"
//                   className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//                 >
//                   Features
//                 </Link>
//                 <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
//                   Pricing
//                 </Link>
//                 <Link
//                   href="#customers"
//                   className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//                 >
//                   Customers
//                 </Link>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={toggleTheme}
//                 className="rounded-lg p-2 transition-colors hover:bg-secondary"
//                 aria-label="Toggle theme"
//               >
//                 {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//               </button>
//               <Button variant="ghost" size="sm" asChild>
//                 <Link href="/login">Sign in</Link>
//               </Button>
//               <Button size="sm" asChild>
//                 <Link href="/signup">
//                   Get started <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-32 pb-20">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="mx-auto max-w-3xl text-center">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
//               <span className="relative flex h-2 w-2">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75" />
//                 <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
//               </span>
//               Now supporting Instagram Stories
//             </div>
//             <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
//               Automate your Instagram DMs with intelligence
//             </h1>
//             <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
//               Turn comments into conversations. Engage followers automatically with AI-powered responses, lead capture,
//               and smart workflows that work 24/7.
//             </p>
//             <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//               <Button size="lg" className="w-full sm:w-auto" asChild>
//                 <Link href="/signup">
//                   Start free trial <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//               </Button>
//               <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
//                 <Link href="#demo">Watch demo</Link>
//               </Button>
//             </div>
//             <p className="mt-4 text-sm text-muted-foreground">No credit card required · 14-day free trial</p>
//           </div>

//           {/* Hero Image */}
//           <div className="relative mx-auto mt-16 max-w-5xl">
//             <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl">
//               <div className="aspect-video overflow-hidden rounded-xl bg-muted">
//                 <Image
//                   src="/modern-instagram-automation-dashboard-interface-da.jpg"
//                   alt="AutomateIG Dashboard"
//                   width={1400}
//                   height={800}
//                   className="h-full w-full object-cover"
//                   priority
//                 />
//               </div>
//             </div>
//             {/* Decorative elements */}
//             <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-chart-1/10 blur-3xl" />
//             <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-chart-2/10 blur-3xl" />
//           </div>
//         </div>
//       </section>

//       {/* Bento Grid Features */}
//       <section id="features" className="py-24">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
//               Everything you need to automate engagement
//             </h2>
//             <p className="text-pretty text-lg text-muted-foreground">
//               Powerful features that turn your Instagram into a lead generation machine
//             </p>
//           </div>

//           {/* Bento Grid Layout */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {/* Large Feature Card */}
//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 md:col-span-2">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-2xl font-semibold">AI-Powered Responses</h3>
//                 <p className="text-balance leading-relaxed text-muted-foreground">
//                   Generate intelligent, context-aware replies that feel human. Train the AI on your brand voice and let
//                   it handle customer conversations automatically.
//                 </p>
//               </div>
//               <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/ai-chatbot-responding-to-instagram-comments-interf.jpg"
//                   alt="AI Responses"
//                   width={700}
//                   height={400}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>

//             {/* Vertical Feature Card */}
//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 md:row-span-2">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-2xl font-semibold">Visual Automation Builder</h3>
//                 <p className="text-balance leading-relaxed text-muted-foreground">
//                   Create complex workflows with our intuitive drag-and-drop builder. No code required.
//                 </p>
//               </div>
//               <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/visual-workflow-builder-automation-interface-verti.jpg"
//                   alt="Workflow Builder"
//                   width={450}
//                   height={600}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>

//             {/* Wide Feature Card */}
//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 md:col-span-2">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-2xl font-semibold">Real-Time Analytics</h3>
//                 <p className="text-balance leading-relaxed text-muted-foreground">
//                   Track engagement metrics, conversion rates, and automation performance with beautiful dashboards.
//                 </p>
//               </div>
//               <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/analytics-dashboard-charts-graphs-instagram-metric.jpg"
//                   alt="Analytics Dashboard"
//                   width={700}
//                   height={400}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>

//             {/* Small Feature Cards */}
//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-xl font-semibold">Smart Keyword Detection</h3>
//                 <p className="text-balance text-sm leading-relaxed text-muted-foreground">
//                   Trigger automations based on specific keywords, emojis, or comment patterns.
//                 </p>
//               </div>
//               <div className="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/keyword-detection-interface-highlight-matching.jpg"
//                   alt="Keyword Detection"
//                   width={300}
//                   height={300}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>

//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-xl font-semibold">Multi-Account Management</h3>
//                 <p className="text-balance text-sm leading-relaxed text-muted-foreground">
//                   Manage unlimited Instagram accounts from one centralized dashboard.
//                 </p>
//               </div>
//               <div className="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/multiple-instagram-accounts-management-interface.jpg"
//                   alt="Multi-Account"
//                   width={300}
//                   height={300}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>

//             <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20">
//               <div className="mb-6">
//                 <h3 className="mb-2 text-xl font-semibold">Lead Capture Forms</h3>
//                 <p className="text-balance text-sm leading-relaxed text-muted-foreground">
//                   Collect emails, phone numbers, and custom data automatically through DM conversations.
//                 </p>
//               </div>
//               <div className="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
//                 <Image
//                   src="/lead-capture-form-instagram-dm-interface.jpg"
//                   alt="Lead Capture"
//                   width={300}
//                   height={300}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Proof */}
//       <section id="customers" className="py-24">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Trusted by growing brands</h2>
//             <p className="text-pretty text-lg text-muted-foreground">
//               Join thousands of businesses automating their Instagram engagement
//             </p>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {[
//               {
//                 metric: "2.5M+",
//                 label: "Messages automated",
//                 description: "Conversations handled without human intervention",
//               },
//               {
//                 metric: "95%",
//                 label: "Response rate",
//                 description: "Average engagement improvement for our customers",
//               },
//               {
//                 metric: "< 30s",
//                 label: "Average response time",
//                 description: "Lightning-fast automated responses that feel human",
//               },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20"
//               >
//                 <div className="mb-2 text-5xl font-bold">{stat.metric}</div>
//                 <div className="mb-2 text-xl font-semibold">{stat.label}</div>
//                 <p className="text-balance text-sm text-muted-foreground">{stat.description}</p>
//               </div>
//             ))}
//           </div>

//           {/* Testimonials */}
//           <div className="mt-16 grid gap-6 md:grid-cols-2">
//             {[
//               {
//                 quote:
//                   "AutomateIG transformed how we handle customer inquiries. We went from missing 60% of comments to responding to everything instantly.",
//                 author: "Simon M",
//                 role: "Marketing Director, GlowBeauty",
//                 image: "/professional-woman-headshot.png",
//               },
//               {
//                 quote:
//                   "The AI responses are so natural that our customers can't tell it's automated. It's like having a 24/7 customer service team.",
//                 author: "Marcus Johnson",
//                 role: "Founder, UrbanFit",
//                 image: "/professional-man-headshot.png",
//               },
//             ].map((testimonial, index) => (
//               <div
//                 key={index}
//                 className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20"
//               >
//                 <p className="mb-6 text-pretty text-lg leading-relaxed">"{testimonial.quote}"</p>
//                 <div className="flex items-center gap-4">
//                   <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
//                     <Image
//                       src={testimonial.image || "/placeholder.svg"}
//                       alt={testimonial.author}
//                       width={100}
//                       height={100}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <div className="font-semibold">{testimonial.author}</div>
//                     <div className="text-sm text-muted-foreground">{testimonial.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing */}
//       <section id="pricing" className="py-24">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing</h2>
//             <p className="text-pretty text-lg text-muted-foreground">Start free, scale as you grow</p>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-3">
//             {[
//               {
//                 name: "Starter",
//                 price: "$29",
//                 description: "Perfect for small businesses getting started",
//                 features: [
//                   "1 Instagram account",
//                   "Up to 1,000 messages/month",
//                   "Basic automation workflows",
//                   "Email support",
//                   "Analytics dashboard",
//                 ],
//               },
//               {
//                 name: "Professional",
//                 price: "$99",
//                 description: "For growing businesses with higher volume",
//                 features: [
//                   "5 Instagram accounts",
//                   "Up to 10,000 messages/month",
//                   "Advanced AI responses",
//                   "Priority support",
//                   "Custom integrations",
//                   "A/B testing",
//                 ],
//                 highlighted: true,
//               },
//               {
//                 name: "Enterprise",
//                 price: "Custom",
//                 description: "For large teams with custom needs",
//                 features: [
//                   "Unlimited accounts",
//                   "Unlimited messages",
//                   "Dedicated account manager",
//                   "Custom AI training",
//                   "SLA guarantee",
//                   "White-label options",
//                 ],
//               },
//             ].map((plan, index) => (
//               <div
//                 key={index}
//                 className={`rounded-2xl border p-8 transition-all ${
//                   plan.highlighted
//                     ? "border-foreground bg-foreground text-background"
//                     : "border-border bg-card hover:border-foreground/20"
//                 }`}
//               >
//                 <div className="mb-6">
//                   <h3 className="mb-2 text-2xl font-semibold">{plan.name}</h3>
//                   <p
//                     className={`text-balance text-sm ${
//                       plan.highlighted ? "text-background/70" : "text-muted-foreground"
//                     }`}
//                   >
//                     {plan.description}
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <span className="text-5xl font-bold">{plan.price}</span>
//                   {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
//                 </div>
//                 <Button
//                   className={`mb-6 w-full ${
//                     plan.highlighted ? "bg-background text-foreground hover:bg-background/90" : ""
//                   }`}
//                   variant={plan.highlighted ? "secondary" : "default"}
//                   asChild
//                 >
//                   <Link href="/signup">{plan.price === "Custom" ? "Contact sales" : "Start free trial"}</Link>
//                 </Button>
//                 <ul className="space-y-3">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="flex items-start gap-3">
//                       <Check
//                         className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
//                           plan.highlighted ? "text-background" : "text-foreground"
//                         }`}
//                       />
//                       <span className="text-sm leading-relaxed">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center md:p-20">
//             <div className="relative z-10">
//               <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
//                 Ready to automate your Instagram?
//               </h2>
//               <p className="mb-10 text-pretty text-lg text-muted-foreground">
//                 Start your 14-day free trial today. No credit card required.
//               </p>
//               <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//                 <Button size="lg" className="w-full sm:w-auto" asChild>
//                   <Link href="/signup">
//                     Get started free <ArrowRight className="ml-2 h-5 w-5" />
//                   </Link>
//                 </Button>
//                 <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
//                   <Link href="/contact">Talk to sales</Link>
//                 </Button>
//               </div>
//             </div>
//             {/* Decorative gradient */}
//             <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-1/10 blur-3xl" />
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border py-12">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="grid gap-8 md:grid-cols-4">
//             <div>
//               <div className="mb-4 text-xl font-semibold">AutomateIG</div>
//               <p className="text-balance text-sm text-muted-foreground">Instagram automation that feels human.</p>
//             </div>
//             <div>
//               <div className="mb-4 font-semibold">Product</div>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="#features" className="transition-colors hover:text-foreground">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#pricing" className="transition-colors hover:text-foreground">
//                     Pricing
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/integrations" className="transition-colors hover:text-foreground">
//                     Integrations
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/changelog" className="transition-colors hover:text-foreground">
//                     Changelog
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <div className="mb-4 font-semibold">Company</div>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="/about" className="transition-colors hover:text-foreground">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/blog" className="transition-colors hover:text-foreground">
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/careers" className="transition-colors hover:text-foreground">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/contact" className="transition-colors hover:text-foreground">
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <div className="mb-4 font-semibold">Legal</div>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="/privacy" className="transition-colors hover:text-foreground">
//                     Privacy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/terms" className="transition-colors hover:text-foreground">
//                     Terms
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/security" className="transition-colors hover:text-foreground">
//                     Security
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
//             © 2025 AutomateIG. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }


import { Header } from "@/components/global/landing/landing/header"
import { HeroSection } from "@/components/global/landing/landing/hero-section"
import { StatsSection } from "@/components/global/landing/landing/stats-section"
import { FeaturesGrid } from "@/components/global/landing/landing/features-grid"
import { VideoShowcasePremium } from "@/components/global/landing/landing/video-showcase-premium"
import { AdvancedDMSimulation } from "@/components/global/landing/landing/advanced-dm-simulation"
import { MetaTrustSection } from "@/components/global/landing/landing/meta-trust-section"
import { IntegrationsSection } from "@/components/global/landing/landing/integrations-section"
import { HowItWorks } from "@/components/global/landing/landing/how-it-works"
import { UseCasesSection } from "@/components/global/landing/landing/use-cases-section"
import { ResultsSection } from "@/components/global/landing/landing/results-section"
import { TestimonialsSection } from "@/components/global/landing/landing/testimonials-section"
import { ROICalculator } from "@/components/global/landing/landing/roi-calculator"
import { PricingSection } from "@/components/global/landing/landing/pricing-section"
import { FAQSection } from "@/components/global/landing/landing/faq-section"
import { FinalCTA } from "@/components/global/landing/landing/final-cta"
import { Footer } from "@/components/global/landing/landing/footer"
import { HorizontalScroll } from "@/components/global/landing/landing/horizontal-scroll"
import { AutomationReels } from "@/components/global/landing/landing/automation-reels"
import { VideoCarousel } from "@/components/global/landing/landing/video-carousel"


export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      {/* <StatsSection /> */}
      <MetaTrustSection />

      {/* Video showcase - Floating style */}
      {/* <VideoShowcasePremium
        title="See yazzil Transform Your Instagram DMs"
        description="Watch how businesses automate thousands of conversations and close more sales"
        videoUrl="/my-video.mp4"
        accent="orange"
        style="floating"
      /> */}

      {/* <FeaturesGrid /> */}

      {/* <HorizontalScroll /> */}

      <AdvancedDMSimulation />

      {/* <AutomationReels /> */}

      {/* Video showcase - Split style */}
      {/* <VideoShowcasePremium
        title="Connect Everything in Seconds"
        description="See how easy it is to integrate yazzil with your favorite tools"
        videoUrl="/my-video.mp4"
        accent="green"
        style="split"
      /> */}


      <IntegrationsSection />
      <HowItWorks />

      <VideoCarousel />

      {/* Video showcase - Card style */}
      {/* <VideoShowcasePremium
        title="Real Businesses, Real Results"
        description="Hear success stories from businesses just like yours"
        videoUrl="/my-video.mp4"
        accent="purple"
        style="card"
      /> */}

      <UseCasesSection />
      <ResultsSection />

      {/* Video showcase - Fullwidth style */}
      {/* <VideoShowcasePremium
        title="Why Top Brands Choose yazzil"
        description="Discover what makes yazzil the #1 Instagram automation platform"
        videoUrl="/my-video.mp4"
        accent="red"
        style="fullwidth"
      /> */}

      <TestimonialsSection />
      <ROICalculator />

      {/* Video showcase - Floating style */}
      {/* <VideoShowcasePremium
        title="Get Started in Under 2 Minutes"
        description="Watch our quick setup guide and start automating today"
        videoUrl="/my-video.mp4" 
        accent="yellow"
        style="floating"
      /> */}

      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
