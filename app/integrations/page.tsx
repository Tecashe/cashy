import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MonitorDown, ShoppingCart, MessageSquare, Briefcase } from "lucide-react"

export default function IntegrationsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 radial--gradient opacity-50" />
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Ecosystem Integrations
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Connect Yazzil <br />to your stack.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Seamlessly integrate your Instagram automation flows directly into the CRM tools, e-commerce platforms, and marketing apps you already use every day.
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search for an integration (e.g. Shopify, Mailchimp)..."
                            className="pl-12 py-6 rounded-full bg-card border-border text-base"
                        />
                    </div>
                </div>
            </section>

            {/* Integrations Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl">

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Categories */}
                        <div className="w-full lg:w-64 space-y-2 shrink-0">
                            <h3 className="font-semibold text-sm tracking-wider text-muted-foreground mb-4 uppercase">Categories</h3>
                            <CategoryLink icon={<MonitorDown />} label="All Integrations" active />
                            <CategoryLink icon={<ShoppingCart />} label="E-Commerce" />
                            <CategoryLink icon={<MessageSquare />} label="CRM & Marketing" />
                            <CategoryLink icon={<Briefcase />} label="Data & Analytics" />
                        </div>

                        {/* Integration Cards */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                            <IntegrationCard
                                name="Shopify"
                                category="E-commerce"
                                description="Fetch real-time order tracking and check product inventory dynamically within DMs."
                                logo="https://cdn.worldvectorlogo.com/logos/shopify.svg"
                            />

                            <IntegrationCard
                                name="WooCommerce"
                                category="E-commerce"
                                description="Sync catalogs and automate abandoned cart notifications."
                                logo="https://cdn.worldvectorlogo.com/logos/woocommerce.svg"
                            />

                            <IntegrationCard
                                name="Mailchimp"
                                category="CRM"
                                description="Export captured email leads automatically into your newsletter audiences."
                                logo="https://cdn.worldvectorlogo.com/logos/mailchimp-1.svg"
                            />

                            <IntegrationCard
                                name="Klaviyo"
                                category="CRM"
                                description="Connect DM opt-ins to your advanced SMS and email flows instantly."
                                logo="https://cdn.worldvectorlogo.com/logos/klaviyo-logo.svg"
                            />

                            <IntegrationCard
                                name="Zapier"
                                category="Automation"
                                description="Connect Yazzil to over 5,000+ web apps using trigger webhooks."
                                logo="https://cdn.worldvectorlogo.com/logos/zapier-2.svg"
                            />

                            <IntegrationCard
                                name="HubSpot"
                                category="Sales CRM"
                                description="Route hyper-qualified Instagram leads straight to your outbound sales reps."
                                logo="https://cdn.worldvectorlogo.com/logos/hubspot.svg"
                            />

                            <IntegrationCard
                                name="Salesforce"
                                category="Enterprise"
                                description="Deep integration to match social profiles to your existing enterprise customer records."
                                logo="https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"
                            />

                            <IntegrationCard
                                name="Stripe"
                                category="Payments"
                                description="Process direct payments safely and trigger DMs upon successful charges."
                                logo="https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                            />

                            <IntegrationCard
                                name="Google Sheets"
                                category="Data"
                                description="Log every single DM lead into a tracking spreadsheet effortlessly."
                                logo="https://cdn.worldvectorlogo.com/logos/google-sheets-1.svg"
                            />

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function CategoryLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <span className="w-5 h-5">{icon}</span>
            {label}
        </button>
    )
}

function IntegrationCard({ name, category, description, logo }: { name: string, category: string, description: string, logo: string }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors flex flex-col items-start cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 mb-4 group-hover:scale-110 transition-transform">
                <img src={logo} alt={name} className="w-full h-full object-contain" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-1">{name}</h4>
            <span className="text-xs text-primary font-medium mb-3">{category}</span>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
    )
}
