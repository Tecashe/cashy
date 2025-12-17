'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, FileText, Scale, Shield, AlertTriangle, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img src="/branded-original.png" alt="Yazzil logo" className="h-16 w-16" />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 radial--gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Terms of Service
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Terms of Service</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Please read these terms carefully before using Yazzil. By using our service, you agree to be bound by
                these terms.
              </p>
              <p className="text-sm text-muted-foreground">Last updated: June 6, 2025</p>
            </div>
          </div>
        </section>

        {/* Terms Overview */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-bold mb-2">Service Agreement</h3>
                  <p className="text-sm text-muted-foreground">Terms governing your use of Yazzil</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Scale className="h-8 w-8 mx-auto mb-4 text-green-500" />
                  <h3 className="font-bold mb-2">Fair Usage</h3>
                  <p className="text-sm text-muted-foreground">Guidelines for responsible platform use</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-bold mb-2">User Rights</h3>
                  <p className="text-sm text-muted-foreground">Your rights and responsibilities</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-orange" />
                  <h3 className="font-bold mb-2">Limitations</h3>
                  <p className="text-sm text-muted-foreground">Service limitations and liability</p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using Yazzil&apos;s services, you agree to be bound by these Terms of Service and all
                    applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                    from using or accessing this site and our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    Yazzil provides social media automation, influencer marketing, and lead qualification services
                    through our web-based platform. Our services include but are not limited to automated responses,
                    content scheduling, influencer discovery, campaign management, and analytics reporting.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Creation</h3>
                    <p className="text-muted-foreground">
                      To use our services, you must create an account by providing accurate and complete information.
                      You are responsible for maintaining the confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </p>

                    <h3 className="text-lg font-semibold">Account Security</h3>
                    <p className="text-muted-foreground">
                      You must notify us immediately of any unauthorized use of your account or any other breach of
                      security. We will not be liable for any loss or damage arising from your failure to comply with
                      this security obligation.
                    </p>

                    <h3 className="text-lg font-semibold">Account Termination</h3>
                    <p className="text-muted-foreground">
                      We reserve the right to terminate or suspend your account at any time for violations of these
                      terms or for any other reason we deem appropriate. You may also terminate your account at any time
                      through your account settings.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Acceptable Use Policy</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Permitted Uses</h3>
                    <p className="text-muted-foreground">
                      You may use our services for legitimate business purposes in accordance with these terms and all
                      applicable laws. This includes automating social media interactions, managing influencer
                      campaigns, and analyzing social media performance.
                    </p>

                    <h3 className="text-lg font-semibold">Prohibited Activities</h3>
                    <p className="text-muted-foreground">You agree not to:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Use our services for any unlawful purpose or in violation of any applicable laws</li>
                      <li>Send spam, unsolicited messages, or engage in harassment</li>
                      <li>Attempt to gain unauthorized access to our systems or other users accounts</li>
                      <li>Use our services to distribute malware, viruses, or other harmful code</li>
                      <li>Violate the terms of service of connected social media platforms</li>
                      <li>Engage in any activity that could damage, disable, or impair our services</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Social Media Platform Compliance</h2>
                  <p className="text-muted-foreground">
                    When using our services with social media platforms, you must comply with their respective terms of
                    service, community guidelines, and API usage policies. We are not responsible for any violations of
                    third-party platform policies or any resulting account suspensions or terminations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Payment Terms</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Subscription Fees</h3>
                    <p className="text-muted-foreground">
                      Our services are provided on a subscription basis. Fees are charged in advance on a monthly or
                      annual basis, depending on your chosen plan. All fees are non-refundable except as required by
                      law.
                    </p>

                    <h3 className="text-lg font-semibold">Price Changes</h3>
                    <p className="text-muted-foreground">
                      We reserve the right to change our pricing at any time. We will provide at least 30 days&apos; notice
                      of any price increases. Your continued use of our services after a price change constitutes
                      acceptance of the new pricing.
                    </p>

                    <h3 className="text-lg font-semibold">Late Payments</h3>
                    <p className="text-muted-foreground">
                      If payment is not received by the due date, we may suspend or terminate your access to our
                      services. You remain responsible for all charges incurred during the suspension period.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Our Rights</h3>
                    <p className="text-muted-foreground">
                      All content, features, and functionality of our services, including but not limited to text,
                      graphics, logos, icons, images, audio clips, and software, are owned by Yazzil and are protected
                      by copyright, trademark, and other intellectual property laws.
                    </p>

                    <h3 className="text-lg font-semibold">Your Content</h3>
                    <p className="text-muted-foreground">
                      You retain ownership of any content you submit to our services. By submitting content, you grant
                      us a non-exclusive, worldwide, royalty-free license to use, modify, and distribute your content
                      solely for the purpose of providing our services.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Privacy and Data Protection</h2>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Our collection, use, and protection of your personal information is
                    governed by our Privacy Policy, which is incorporated into these terms by reference. By using our
                    services, you consent to the collection and use of your information as described in our Privacy
                    Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Disclaimers and Limitations of Liability</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Availability</h3>
                    <p className="text-muted-foreground">
                      While we strive to provide reliable service, we do not guarantee that our services will be
                      available at all times or free from interruptions. We may experience downtime for maintenance,
                      updates, or due to factors beyond our control.
                    </p>

                    <h3 className="text-lg font-semibold">Limitation of Liability</h3>
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, Yazzil shall not be liable for any indirect, incidental,
                      special, consequential, or punitive damages, including but not limited to loss of profits, data,
                      or business opportunities, arising from your use of our services.
                    </p>

                    <h3 className="text-lg font-semibold">Third-Party Services</h3>
                    <p className="text-muted-foreground">
                      Our services may integrate with third-party platforms and services. We are not responsible for the
                      availability, content, or practices of these third-party services. Your use of third-party
                      services is subject to their respective terms and conditions.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
                  <p className="text-muted-foreground">
                    You agree to indemnify, defend, and hold harmless Yazzil and its officers, directors, employees, and
                    agents from and against any claims, liabilities, damages, losses, and expenses arising from your use
                    of our services, your violation of these terms, or your violation of any rights of another party.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                  <p className="text-muted-foreground">
                    Either party may terminate this agreement at any time. Upon termination, your right to use our
                    services will cease immediately. We may retain certain information as required by law or for
                    legitimate business purposes. Provisions that by their nature should survive termination will remain
                    in effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">12. Governing Law and Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    These terms are governed by the laws of the State of California, United States, without regard to
                    conflict of law principles. Any disputes arising from these terms or your use of our services will
                    be resolved through binding arbitration in accordance with the rules of the American Arbitration
                    Association.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We will notify you of any material changes
                    by email or through our platform. Your continued use of our services after such changes constitutes
                    acceptance of the modified terms. If you do not agree to the changes, you must stop using our
                    services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> legal@yazzil.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Address:</strong> 17283 Innovation Drive, San Francisco, CA 94105, United States
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <div className="flex justify-center mb-4">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our legal team is available to help clarify any questions about our terms of service.
              </p>
              <Button size="lg">Contact Legal Team</Button>
            </Card>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/branded-original.png" alt="Yazzil logo" className="h-16 w-16" />
              </div>

              <p className="text-sm text-muted-foreground">
                The all-in-one platform for social media automation, influencer marketing, and lead qualification.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" style={{ color: "#E4405F" }} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" style={{ color: "#1877F2" }} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" style={{ color: "#1DA1F2" }} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" style={{ color: "#0A66C2" }} />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#solutions" className="text-muted-foreground hover:text-foreground">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-muted-foreground hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Yazzil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
