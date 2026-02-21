import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, Landmark, Megaphone, Laptop } from "lucide-react"

export default function SolutionsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden radial--gradient">
                <div className="container relative mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm">
                            Use Cases & Solutions
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                            Built for your specific industry.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            See how Yazzil is optimized to solve the unique bottlenecks of e-commerce brands, marketing agencies, and high-volume creators.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl space-y-32">

                    {/* Solution: E-commerce */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-8">
                            <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <ShoppingBag className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">For E-Commerce Brands</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Turn your Instagram profile into a storefront that never sleeps. Stop abandoning carts because of unanswered DM questions.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Automate 'Where is my order?' tracking lookups.",
                                    "Create interactive sizing quizzes right in the DMs.",
                                    "Trigger discount codes when users comment on drop reveals.",
                                    "Recover abandoned carts by sending organic Instagram DM reminders."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" variant="outline" className="rounded-full">See E-Commerce Guide</Button>
                        </div>
                        <div className="order-1 lg:order-2 aspect-square md:aspect-video lg:aspect-square bg-muted rounded-3xl overflow-hidden border border-border">
                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="E-commerce Dashboard" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Solution: Agencies */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="aspect-square md:aspect-video lg:aspect-square bg-muted rounded-3xl overflow-hidden border border-border">
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Agency Analytics" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-8">
                            <div className="h-14 w-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                                <Landmark className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">For Marketing Agencies</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Manage multiple client accounts under one centralized roof. Prove ROI definitively with deep conversion tracking.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Manage 50+ client Instagram accounts from one dashboard.",
                                    "White-label the client reporting dashboard.",
                                    "Assign team permissions for seamless collaboration.",
                                    "Lower Customer Acquisition Cost (CAC) through DM funnels."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" variant="outline" className="rounded-full">View Agency Partners Program</Button>
                        </div>
                    </div>

                    {/* Solution: Creators */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-8">
                            <div className="h-14 w-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                                <Megaphone className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">For Creators & Coaches</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                You can't respond to every single fan organically but your fans still crave that 1-on-1 interaction. Scale your presence effortlessly.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Distribute lead magnets automatically via DM.",
                                    "Pre-qualify high ticket consulting leads using bots.",
                                    "Drive skyrocketing engagement by incentivizing comments.",
                                    "Build your private off-platform email list."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" variant="outline" className="rounded-full">Creator Monetization Tips</Button>
                        </div>
                        <div className="order-1 lg:order-2 aspect-square md:aspect-video lg:aspect-square bg-muted rounded-3xl overflow-hidden border border-border">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Creator Phone" className="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}
