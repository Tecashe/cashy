import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle, Building2 } from "lucide-react"

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative">
                <div className="absolute inset-0 radial--gradient opacity-50" />
                <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mx-auto mb-6">
                        Get in Touch
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">We're here to help.</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have a question about our enterprise plans, need technical support, or just want to say hi? Drop us a line.</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* Contact Form */}
                        <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl shadow-background/50">
                            <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">First Name</label>
                                        <Input placeholder="John" className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Last Name</label>
                                        <Input placeholder="Doe" className="bg-background" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Work Email</label>
                                    <Input type="email" placeholder="john@company.com" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">How can we help?</label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                        <option value="" disabled selected>Select an option...</option>
                                        <option value="sales">Sales & Enterprise Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Message</label>
                                    <Textarea placeholder="Tell us more about your needs..." className="min-h-[150px] bg-background" />
                                </div>
                                <Button size="lg" className="w-full rounded-xl">Send Message</Button>
                            </form>
                        </div>

                        {/* Alternates */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-8">Other ways to connect</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Email Support</h4>
                                            <p className="text-muted-foreground mb-2">Our team usually replies within 2 hours during business operations.</p>
                                            <a href="mailto:support@yazzil.com" className="text-primary font-medium hover:underline">support@yazzil.com</a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <MessageCircle className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Live Chat</h4>
                                            <p className="text-muted-foreground mb-2">Need an answer right now? Use the chat widget in the corner of your dashboard.</p>
                                            <span className="text-primary font-medium cursor-pointer hover:underline">Open Live Chat</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Building2 className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Corporate Headquarters</h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Yazzil Inc.<br />
                                                17283 Innovation Drive<br />
                                                San Francisco, CA 94105<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>
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
