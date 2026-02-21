import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function CaseStudiesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 radial--gradient opacity-50" />
                <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Customer Success
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        The proof is in <br />the performance.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Discover how leading brands are using Yazzil to automate their engagement, scale their support, and drive unprecedented social revenue.
                    </p>
                </div>
            </section>

            {/* Featured Case Study */}
            <section className="py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-card border-x border-t border-border rounded-t-3xl p-8 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <img src="https://cdn.worldvectorlogo.com/logos/gymshark-1.svg" alt="Apparel Brand logo" className="h-8 mb-8 brightness-0 invert opacity-80" />
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">How an Athleisure Giant increased holiday sales by 314% via DM automation.</h2>
                            <p className="text-lg text-muted-foreground">Faced with thousands of repetitive sizing questions during Black Friday, they deployed a Yazzil interactive sizing quiz that converted curious followers into paying customers in exactly 4 chat bubbles.</p>

                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border mt-8">
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">314%</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Sales Lift</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">2.4s</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Avg Response</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">$4M</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Recovered Carts</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-square lg:aspect-auto h-[400px] bg-muted rounded-2xl overflow-hidden border border-border">
                            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Dashboard stats" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {/* Read full case study bar */}
                    <Link href="/blog/case-study-automation-increased-sales-300-percent" className="block bg-primary text-primary-foreground p-6 rounded-b-3xl text-center font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        Read the full case study <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Grid Case Studies */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h3 className="text-2xl font-bold mb-10">More Success Stories</h3>
                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="h-48 bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Boutique" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="h-6 mb-6 opacity-70 uppercase tracking-widest text-xs font-bold font-mono">
                                    Marketing Agency
                                </div>
                                <h4 className="text-xl font-bold mb-4 pr-4 leading-snug">Scaling client acquisition while dropping CAC by 40%.</h4>
                                <p className="text-sm text-muted-foreground mb-8 line-clamp-3">Using keyword opt-ins on Instagram Reels, this agency captured high-quality B2B leads via simple DMs instead of clunky landing pages.</p>
                                <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:underline">
                                    Read Story <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="h-48 bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9ab6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tech Startup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="h-6 mb-6 opacity-70 uppercase tracking-widest text-xs font-bold font-mono">
                                    Tech Startup
                                </div>
                                <h4 className="text-xl font-bold mb-4 pr-4 leading-snug">Deflecting 85% of tier-1 support tickets using intent NLP.</h4>
                                <p className="text-sm text-muted-foreground mb-8 line-clamp-3">Replacing their offshore support team with a finely tuned Yazzil chatbot resulted in higher customer satisfaction scores and a massive drop in overhead.</p>
                                <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:underline">
                                    Read Story <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="h-48 bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fitness Creator" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="h-6 mb-6 opacity-70 uppercase tracking-widest text-xs font-bold font-mono">
                                    Fitness Influencer
                                </div>
                                <h4 className="text-xl font-bold mb-4 pr-4 leading-snug">Generating $150k in a weekend selling PDF meal plans.</h4>
                                <p className="text-sm text-muted-foreground mb-8 line-clamp-3">By asking followers to reply to her Instagram Story to get early access, she created immense FOMO and delivered checkout links automatically while she slept.</p>
                                <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:underline">
                                    Read Story <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
