import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, BookOpen, Layers } from "lucide-react"

export default function GuidesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Learning Center
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Step-by-step guides.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Whether you're setting up your first auto-reply or configuring an intricate multi-node lead qualification quiz, we have a tutorial for you.
                    </p>
                </div>
            </section>

            {/* Featured Video Tutorial */}
            <section className="py-12 border-b border-border">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6">Getting Started: The 5-Minute Setup</h2>
                    <div className="aspect-video bg-muted rounded-2xl border border-border overflow-hidden relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-10 h-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutorial Tracks */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Beginners */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <BookOpen className="w-8 h-8 text-primary" />
                                <h2 className="text-3xl font-bold text-foreground">Beginner Track</h2>
                            </div>
                            <div className="space-y-4">
                                <GuideCard title="Connecting your Instagram Professional Account securely" readTime="3 min read" />
                                <GuideCard title="Your first 'Comment to DM' trigger" readTime="5 min read" />
                                <GuideCard title="Understanding the Visual Builder interface" readTime="7 min video" />
                                <GuideCard title="Testing your flows without going live" readTime="4 min read" />
                            </div>
                        </div>

                        {/* Advanced */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <Layers className="w-8 h-8 text-purple-500" />
                                <h2 className="text-3xl font-bold text-foreground">Advanced Tactics</h2>
                            </div>
                            <div className="space-y-4">
                                <GuideCard title="Training the AI on your brand's specific PDF catalogs" readTime="12 min video" />
                                <GuideCard title="Using Webhooks to save lead emails to Google Sheets automatically" readTime="8 min read" />
                                <GuideCard title="Configuring multi-agent handoffs based on AI sentiment analysis" readTime="15 min read" />
                                <GuideCard title="A/B Testing copy variations inside a single flow" readTime="6 min video" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function GuideCard({ title, readTime }: { title: string, readTime: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors pr-8">{title}</h4>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{readTime}</div>
        </div>
    )
}
