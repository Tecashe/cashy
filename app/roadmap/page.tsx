import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckCircle2, CircleDashed } from "lucide-react"

export default function RoadmapPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative">
                <div className="absolute inset-0 radial--gradient opacity-50" />
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Product Roadmap
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        What we're building next.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Transparency is embedded in our DNA. See what features our engineering team is cooking up for the next few quarters.
                    </p>
                </div>
            </section>

            {/* Roadmap Quarters */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl space-y-24">

                    {/* Current Quarter */}
                    <div className="relative pl-8 md:pl-0">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
                        <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-border translate-x-3.5" />

                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                            <div className="md:text-right">
                                <div className="inline-flex items-center gap-2 mb-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    Q3 2026 (In Progress)
                                </div>
                            </div>

                            <div className="space-y-6">
                                <RoadmapItem
                                    status="progress"
                                    title="WhatsApp Business API Integration"
                                    description="Native support to deploy your AutomateIG visual workflows simultaneously on WhatsApp numbers."
                                />
                                <RoadmapItem
                                    status="progress"
                                    title="A/B Testing for Workflows"
                                    description="Run traffic splits between two different welcome responses to see which copy converts higher."
                                />
                                <RoadmapItem
                                    status="done"
                                    title="Advanced Multi-Agent Routing"
                                    description="Complex SLA routing rules to hand off human chat tickets to specific team members based on intent."
                                />
                            </div>

                        </div>
                    </div>

                    {/* Next Quarter */}
                    <div className="relative pl-8 md:pl-0">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
                        <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-border translate-x-3.5" />

                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                            <div className="md:text-right">
                                <div className="inline-flex items-center gap-2 mb-4 bg-muted text-foreground px-4 py-1 rounded-full text-sm font-bold border border-border relative z-10">
                                    Q4 2026 (Planned)
                                </div>
                            </div>

                            <div className="space-y-6">
                                <RoadmapItem
                                    status="planned"
                                    title="TikTok DMs Support"
                                    description="Expanding the Meta-centric ecosystem to cover TikTok's new direct messaging APIs."
                                />
                                <RoadmapItem
                                    status="planned"
                                    title="Predictive AI Analytics"
                                    description="Let the LLM look over your engagement data and proactively suggest flow improvements."
                                />
                                <RoadmapItem
                                    status="planned"
                                    title="Custom Domain Link Shortening"
                                    description="Fully white-labeled URL routing for all checkout links sent via DMs."
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}

function RoadmapItem({ title, description, status }: { title: string, description: string, status: "done" | "progress" | "planned" }) {

    const getIcon = () => {
        switch (status) {
            case "done": return <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0 bg-background" />
            case "progress": return <CircleDashed className="text-primary w-6 h-6 shrink-0 animate-spin-slow bg-background" />
            case "planned": return <Circle className="text-muted-foreground w-6 h-6 shrink-0 bg-background" />
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 relative">
            <div className="absolute -left-12 md:-left-[3.7rem] top-6 z-10">
                {getIcon()}
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
        </div>
    )
}
