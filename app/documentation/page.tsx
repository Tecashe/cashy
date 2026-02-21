import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Terminal, Code2, Database, Workflow, ShieldCheck } from "lucide-react"

export default function DocumentationPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            <section className="pt-32 pb-16 relative overflow-hidden border-b border-border">
                <div className="container mx-auto px-6 max-w-7xl">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mb-6">
                        Developer Documentation
                    </Badge>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Welcome to the Docs.
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Everything you need to build advanced automated workflows, consume our REST APIs, and integrate Yazzil into your application.
                            </p>
                        </div>
                        <div className="flex bg-muted/50 rounded-lg p-1 w-full max-w-sm border border-border">
                            <input type="text" placeholder="Search docs (Press '/')" className="bg-transparent border-none outline-none text-sm w-full px-4 py-2" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Core Concepts */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <Workflow className="w-10 h-10 text-primary mb-6" />
                            <h2 className="text-2xl font-bold mb-3">Core Concepts</h2>
                            <p className="text-muted-foreground mb-6">Understand the fundamental building blocks of conversational automation: Triggers, Nodes, and Context.</p>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">What is an Automation Canvas?</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Understanding Node Types</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Passing Variables in Chains</a></li>
                                <li><a href="#" className="text-primary hover:underline">View all Core topics &rarr;</a></li>
                            </ul>
                        </div>

                        {/* REST API */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <Terminal className="w-10 h-10 text-blue-500 mb-6" />
                            <h2 className="text-2xl font-bold mb-3">REST API v2</h2>
                            <p className="text-muted-foreground mb-6">Interact directly with your Yazzil data. Export contacts, trigger external flows, and sync performance metrics.</p>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Authentication & Bearer Tokens</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contacts Endpoints</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Rate Limits & Pagination</a></li>
                                <li><a href="#" className="text-primary hover:underline">View API Reference &rarr;</a></li>
                            </ul>
                        </div>

                        {/* Webhooks */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <Code2 className="w-10 h-10 text-purple-500 mb-6" />
                            <h2 className="text-2xl font-bold mb-3">Custom Webhooks</h2>
                            <p className="text-muted-foreground mb-6">Send real-time data from Yazzil directly to your servers or external services the moment an event occurs.</p>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Setting up a Receiving Server</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Validating Webhook Signatures</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Event Types Payload Reference</a></li>
                                <li><a href="#" className="text-primary hover:underline">Read Webhook guide &rarr;</a></li>
                            </ul>
                        </div>

                        {/* Integrations */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <Database className="w-10 h-10 text-orange-500 mb-6" />
                            <h2 className="text-2xl font-bold mb-3">E-Commerce Syncing</h2>
                            <p className="text-muted-foreground mb-6">Guides on properly connecting your Shopify or WooCommerce store to enable live inventory lookups.</p>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Shopify Private App Setup</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">WooCommerce REST API Keys</a></li>
                                <li><a href="#" className="text-primary hover:underline">View Integration docs &rarr;</a></li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <ShieldCheck className="w-10 h-10 text-green-500 mb-6" />
                            <h2 className="text-2xl font-bold mb-3">Security & Compliance</h2>
                            <p className="text-muted-foreground mb-6">Details on our encryption standards, data retention policies, and SOC2 / GDPR compliance stance.</p>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Data Encryption at Rest</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground">Handling PII in Conversations</a></li>
                                <li><a href="#" className="text-primary hover:underline">View Security hub &rarr;</a></li>
                            </ul>
                        </div>

                        {/* QuickStarts */}
                        <div className="bg-card bg-primary/5 border border-primary/20 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col justify-center text-center">
                            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">New here?</h2>
                            <p className="text-muted-foreground text-sm mb-6">If you aren't a developer and just want to get your first bot running in 5 minutes, head over to the Guides.</p>
                            <a href="/guides" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">Go to Beginner Guides</a>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
