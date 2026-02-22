import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative">
                <div className="absolute inset-0 radial--gradient opacity-50" />
                <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Pricing
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Start with a free trial. <br />Scale as you grow.</h1>
                    <p className="text-lg text-muted-foreground">Every plan includes a 14-day free trial. No credit card required upfront.</p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Freemium Plan */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors">
                            <h3 className="text-2xl font-bold mb-2">Freemium</h3>
                            <p className="text-muted-foreground mb-6 h-12">14-day free trial to get started.</p>
                            <div className="mb-2">
                                <span className="text-5xl font-extrabold">$49</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <p className="text-sm text-green-500 mb-4">14-day free trial</p>
                            <Button className="w-full rounded-xl" variant="outline">Start Free Trial</Button>
                            <ul className="mt-8 space-y-4">
                                <FeatureItem text="1 Instagram Account" />
                                <FeatureItem text="Up to 100 Messages/mo" />
                                <FeatureItem text="Basic Keyword Triggering" />
                                <FeatureItem text="Standard Analytics" />
                                <MissingFeature text="Advanced AI Chatbots" />
                                <MissingFeature text="CRM Integrations" />
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-card border-2 border-primary relative rounded-3xl p-8 transform md:-translate-y-4 shadow-2xl shadow-primary/20">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                                MOST POPULAR
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-muted-foreground mb-6 h-12">For growing D2C brands that need to scale.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold">$79</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <Button className="w-full rounded-xl">Start Free Trial</Button>
                            <ul className="mt-8 space-y-4">
                                <FeatureItem text="Up to 5 Instagram Accounts" />
                                <FeatureItem text="Up to 5,000 Messages/mo" />
                                <FeatureItem text="AI Chatbots & NLP" />
                                <FeatureItem text="Shopify & CRM Integrations" />
                                <FeatureItem text="Lead Capture Forms" />
                                <FeatureItem text="Priority Email Support" />
                            </ul>
                        </div>

                        {/* Business Plan */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors">
                            <h3 className="text-2xl font-bold mb-2">Business</h3>
                            <p className="text-muted-foreground mb-6 h-12">For teams and agencies scaling operations.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold">$149</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <Button className="w-full rounded-xl" variant="outline">Get Started</Button>
                            <ul className="mt-8 space-y-4">
                                <FeatureItem text="Up to 15 Instagram Accounts" />
                                <FeatureItem text="Up to 25,000 Messages/mo" />
                                <FeatureItem text="AI Responses & Human Handoff" />
                                <FeatureItem text="Team Collaboration Tools" />
                                <FeatureItem text="Advanced Analytics" />
                                <FeatureItem text="Dedicated Support" />
                            </ul>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors">
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <p className="text-muted-foreground mb-6 h-12">For large agencies and high-volume corporate retail.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold">Custom</span>
                            </div>
                            <Button className="w-full rounded-xl" variant="outline">Contact Sales</Button>
                            <ul className="mt-8 space-y-4">
                                <FeatureItem text="Unlimited Accounts" />
                                <FeatureItem text="Unlimited Messages" />
                                <FeatureItem text="White-Label Reporting" />
                                <FeatureItem text="Dedicated Account Manager" />
                                <FeatureItem text="Custom API Integrations" />
                                <FeatureItem text="SLA Guarantees" />
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Link */}
            <section className="py-24 text-center">
                <p className="text-muted-foreground text-lg">Have questions about our pricing? Check out the <a href="/help" className="text-primary hover:underline">Help Center</a> or <a href="/contact" className="text-primary hover:underline">Contact Sales</a>.</p>
            </section>

            <Footer />
        </main>
    )
}

function FeatureItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3">
            <Check className="text-primary w-5 h-5 shrink-0" />
            <span className="text-muted-foreground">{text}</span>
        </li>
    )
}

function MissingFeature({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 opacity-50">
            <X className="w-5 h-5 shrink-0" />
            <span className="text-muted-foreground">{text}</span>
        </li>
    )
}
