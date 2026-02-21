import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-24 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Our Story
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        We are democratizing <br className="hidden md:block" /> high-scale engagement.
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        Yazzil was founded on a simple principle: businesses of all sizes deserve the technological capabilities of an enterprise support team without the massive overhead.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 bg-card border-y border-border">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                                <p>In 2024, the gap between casual creators and massive retail brands widened dramatically. E-commerce converted heavily to "Conversational Commerce"—meaning if you weren't selling directly inside social media DMs, you weren't selling.</p>
                                <p>But the tools to actually manage thousands of DMs automatically were gatekept by multi-thousand-dollar enterprise software contracts that smaller brands couldn't afford.</p>
                                <p className="text-foreground font-medium">We built Yazzil to shatter that barrier.</p>
                                <p>We combine massive language models with a visually fluid workflow builder, allowing anyone to click, drag, and deploy an automated sales team in twenty minutes.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Team collaborating" className="rounded-2xl w-full h-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Office space" className="rounded-2xl w-full h-full object-cover mt-8" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-extrabold text-primary mb-2">12+</div>
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Team Members</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold text-primary mb-2">3.2M</div>
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Messages sent daily</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold text-primary mb-2">40+</div>
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Countries Served</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold text-primary mb-2">99%</div>
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Server Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
