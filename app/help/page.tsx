import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from "lucide-react"

export default function HelpCenterPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Search Hero */}
            <section className="pt-32 pb-24 relative overflow-hidden text-center radial--gradient">
                <div className="container mx-auto px-6 max-w-3xl relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Support Portal
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                        How can we help you today?
                    </h1>
                    <div className="relative max-w-xl mx-auto shadow-2xl shadow-background">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                        <Input
                            placeholder="Search for articles, billing help, or troubleshooting..."
                            className="pl-14 py-8 rounded-2xl bg-card border-border text-lg"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="py-24 border-t border-border bg-card">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-6">

                        <FaqItem
                            question="Do I need to give you my Instagram password?"
                            answer="No. Yazzil uses the official Meta API OAuth flow. You will log in securely via Facebook/Instagram and grant permissions to our app. We never see or store your password."
                        />

                        <FaqItem
                            question="Wait, will Instagram ban my account for using automation?"
                            answer="Absolutely not. We are an official Meta Business Partner. Everything we do utilizes the official Meta Graph APIs natively. Old 'scraping' or 'grey-hat' bots used to get accounts banned, but Yazzil operates 100% within Meta's sanctioned terms of service."
                        />

                        <FaqItem
                            question="What happens if I exceed my message limit on the Starter plan?"
                            answer="Your automations will simply pause, and the platform will revert to your native Instagram inbox so you don't lose the messages. We will notify you via email when you hit 80% and 100% of your usage limit, giving you ample time to upgrade your tier."
                        />

                        <FaqItem
                            question="How does the AI Chatbot know what to say?"
                            answer="You train it! You can upload PDFs (like return policies, catalogs, or sizing charts), input your website URL, or provide raw text. Our LLM parses this context and restricts its answers strictly to the data you provide, ensuring it never hallucinates pricing."
                        />

                        <FaqItem
                            question="Can I cancel my subscription at any time?"
                            answer="Yes. All of our standard tiers are month-to-month contracts. You can cancel directly from your billing dashboard with one click. Your service will remain active until the end of that billing cycle."
                        />

                        <FaqItem
                            question="Is there a human hand-off feature?"
                            answer="Yes. You can build logic nodes that pause the bot and ping a specific member of your team via email or Slack if a customer stringently asks for a human, or if the AI determines the inquiry is too complex."
                        />

                    </div>

                </div>
            </section>

            {/* Contact Prompt */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4">Still can't find the answer?</h3>
                    <p className="text-muted-foreground mb-8">Our support team works 24/5 to make sure your automation flows are running smoothly.</p>
                    <a href="/contact" className="inline-block bg-primary text-primary-foreground font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">Submit a Ticket</a>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="border border-border rounded-xl p-6 hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-foreground pr-8 group-hover:text-primary transition-colors">{question}</h4>
                <ChevronDown className="w-5 h-5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed hidden group-hover:block transition-all">{answer}</p>
        </div>
    )
}
