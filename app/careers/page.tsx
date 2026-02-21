import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-24 relative overflow-hidden radial--gradient text-center">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Join the Team
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                        Help us build the future <br />of conversational commerce.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                        We're a fully remote, fast-paced team of builders obsessed with beautiful user experiences and hard technical challenges.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">View Open Roles</Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">Our Culture</Button>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-24 bg-card border-y border-border">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why work at Yazzil?</h2>
                        <p className="text-muted-foreground">Beyond competitive compensation, we offer an environment optimized for deep work.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">1</div>
                            <h3 className="text-xl font-bold">100% Async & Remote</h3>
                            <p className="text-muted-foreground">Work from anywhere in the world. We evaluate output, not the hours you sit in a chair. No pointless status meetings.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">2</div>
                            <h3 className="text-xl font-bold">Absolute Autonomy</h3>
                            <p className="text-muted-foreground">We hire incredibly smart people and get out of their way. You will have ownership over major product decisions.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">3</div>
                            <h3 className="text-xl font-bold">Generous Equipment</h3>
                            <p className="text-muted-foreground">Every new hire gets a $3,000 stiped to build their perfect remote home office setup, on us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Roles */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-10 text-center">Open Positions</h2>

                    <div className="space-y-6">

                        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Senior Full Stack Engineer</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Global Remote (UTC to UTC+4)</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Full-time</span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <Button variant="secondary" className="rounded-full w-full md:w-auto">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Product Designer (UI/UX)</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Global Remote</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Full-time</span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <Button variant="secondary" className="rounded-full w-full md:w-auto">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Customer Success Manager</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Americas (EST/PST)</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Full-time</span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <Button variant="secondary" className="rounded-full w-full md:w-auto">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 text-center text-muted-foreground">
                        Don't see a perfect fit? Send your resume to <a href="mailto:careers@yazzil.com" className="text-primary hover:underline">careers@yazzil.com</a> anyway.
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}
