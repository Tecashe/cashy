import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageSquareHeart, Zap, BarChart3, Users, Webhook } from "lucide-react"

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden radial--gradient">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="container relative mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm">
                            <Sparkles className="w-4 h-4 mr-2" /> All Features
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                            Built for speed, scale, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">revenue.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Everything you need to automate your Instagram DMs, capture leads effortlessly, and provide 24/7 customer support without writing a single line of code.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Feature 1 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquareHeart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Conversational AI Bot</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Train your bot on your specific FAQs, brand tone, and catalogs. Our LLM-powered engine handles complex customer inquiries instantly, freeing your human team for high-level issues.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Instant Comment-to-DM</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Turn your comment section into a sales funnel. Automatically send a private DM containing a specific product link the moment a user comments a trigger word on your reels or posts.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Webhook className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Visual Drag & Drop Builder</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                No coding required. Build intricate logic trees, multi-step qualification quizzes, and seamless human hand-offs using our intuitive node-based canvas.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Lead Capture via DM</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Stop forcing users to leave the app. Collect email addresses, phone numbers, and custom fields conversationally inside Instagram and sync them automatically to your CRM.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Deep Analytics & ROI</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                You can't improve what you don't measure. Track exactly how many messages were automated, flow drop-off rates, and direct revenue attributed to specific chat sequences.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all group">
                            <div className="h-12 w-12 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Story Reply Automations</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Capitalize on your most engaged audience. Create personalized automated replies triggered when users react to your Story or participate in Story polls and question boxes.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-border bg-muted/20">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Ready to test these features?</h2>
                    <p className="text-lg text-muted-foreground mb-10">Start your 14-day free trial today. No credit card required.</p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">Get Started</Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">Talk to Sales</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
