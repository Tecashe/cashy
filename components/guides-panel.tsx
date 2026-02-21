"use client"

import { BookOpen, Zap, Link2, MessageSquare, ShoppingBag, Settings2, ChevronRight, ExternalLink } from "lucide-react"
import { useState } from "react"

interface Guide {
    id: string
    icon: React.ElementType
    title: string
    description: string
    tag: string
    tagColor: string
    steps: string[]
    docsUrl?: string
}

const GUIDES: Guide[] = [
    {
        id: "automations",
        icon: Zap,
        title: "Create Your First Automation",
        description: "Automate responses, follow-ups, and workflows triggered by customer actions.",
        tag: "Popular",
        tagColor: "bg-violet-500/10 text-violet-600",
        steps: [
            "Go to your dashboard and click Automations in the sidebar",
            "Click 'New Automation' and give it a name",
            "Choose a trigger — e.g. New Message, Order Placed, or Time-based",
            "Add actions: Send Message, Update Tag, Notify Team, or Wait",
            "Use If/Else nodes to branch logic based on conditions",
            "Save and toggle the automation ON to activate it",
        ],
    },
    {
        id: "integrations",
        icon: Link2,
        title: "Connect Third-Party Accounts",
        description: "Link WhatsApp, email, payment gateways, and CRM tools to unlock full platform power.",
        tag: "Setup",
        tagColor: "bg-blue-500/10 text-blue-600",
        steps: [
            "Navigate to Settings → Integrations in your dashboard",
            "Select the service you want to connect (WhatsApp, Stripe, Gmail, etc.)",
            "Follow the OAuth or API key setup for that service",
            "Test the connection using the built-in test button",
            "Once verified, the integration appears as Active",
            "Automations and chatbots can now use this integration",
        ],
    },
    {
        id: "chatbot",
        icon: MessageSquare,
        title: "Set Up Your AI Chatbot",
        description: "Configure your chatbot's tone, knowledge base, and response style for your brand.",
        tag: "AI",
        tagColor: "bg-emerald-500/10 text-emerald-600",
        steps: [
            "Go to AI Settings in your dashboard sidebar",
            "Choose a tone: Professional, Friendly, Formal, or Custom",
            "Add your FAQs and product information to the knowledge base",
            "Set up fallback responses for questions the AI can't answer",
            "Enable the chatbot on your preferred channels (web widget, WhatsApp, etc.)",
            "Monitor conversations in the Inbox and refine over time",
        ],
    },
    {
        id: "orders",
        icon: ShoppingBag,
        title: "Managing Orders & Inventory",
        description: "Track customer orders, update stock, and handle fulfilment from your dashboard.",
        tag: "Commerce",
        tagColor: "bg-amber-500/10 text-amber-600",
        steps: [
            "Open the Orders section in your dashboard",
            "New orders appear automatically when customers checkout",
            "Click any order to view details, update status, or add notes",
            "Use the Inventory tab to add products and set stock levels",
            "Set low-stock alerts so you're never caught off guard",
            "Export order data as CSV from the Orders → Export button",
        ],
    },
    {
        id: "support",
        icon: MessageSquare,
        title: "Creating a Support Ticket",
        description: "Report issues, request features, or get help from the Yazzil support team.",
        tag: "Help",
        tagColor: "bg-pink-500/10 text-pink-600",
        steps: [
            "Click Support in your dashboard sidebar",
            "Click 'New Ticket' and select a category (Technical, Billing, General)",
            "Write a clear subject line and describe the issue in detail",
            "Attach screenshots if relevant — drag and drop into the message box",
            "Submit the ticket and you'll get an email confirmation",
            "Reply directly in the ticket thread as the team responds",
        ],
    },
    {
        id: "settings",
        icon: Settings2,
        title: "Customising Your Workspace",
        description: "Brand your workspace, set business hours, team members, and notification preferences.",
        tag: "Settings",
        tagColor: "bg-slate-500/10 text-slate-600",
        steps: [
            "Click Settings in the dashboard sidebar",
            "Under Business, add your logo, brand colours, and business name",
            "Set your business hours so the chatbot knows when you're available",
            "Go to Team to invite colleagues and assign them roles",
            "Configure notification preferences under Notifications",
            "Save changes — they take effect immediately across all channels",
        ],
    },
]

function GuideCard({ guide }: { guide: Guide }) {
    const [expanded, setExpanded] = useState(false)
    const Icon = guide.icon

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-violet-400/40 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/5">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-base leading-tight">{guide.title}</h3>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${guide.tagColor}`}>
                                    {guide.tag}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{guide.description}</p>
                        </div>
                    </div>
                </div>

                {expanded && (
                    <ol className="space-y-2.5 mb-4 pl-1">
                        {guide.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-muted-foreground leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ol>
                )}

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors"
                >
                    {expanded ? "Hide steps" : "Show steps"}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
                </button>
            </div>
        </div>
    )
}

export function GuidesPanel() {
    const [search, setSearch] = useState("")
    const filtered = GUIDES.filter(
        (g) =>
            g.title.toLowerCase().includes(search.toLowerCase()) ||
            g.description.toLowerCase().includes(search.toLowerCase()) ||
            g.tag.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 opacity-80" />
                        <span className="text-sm font-medium opacity-80 uppercase tracking-wider">How-to Guides</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Get the most from Yazzil</h1>
                    <p className="text-white/70 max-w-lg leading-relaxed">
                        Step-by-step guides to help you set up automations, connect integrations,
                        configure your AI chatbot, and run your business smarter.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search guides…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                />
            </div>

            {/* Guide grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-2 py-16 text-center text-muted-foreground">
                        <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p>No guides match "{search}"</p>
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/30">
                <div>
                    <p className="font-semibold">Still need help?</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Our support team responds within minutes during business hours.</p>
                </div>
                <a
                    href="../support"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors shrink-0"
                >
                    Open a Support Ticket
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    )
}
