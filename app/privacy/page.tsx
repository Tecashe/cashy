'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Shield, Eye, Users, Globe, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col dark">
      {/*Navigation */}
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
                Privacy Policy
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Privacy Policy
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We&apos;re committed to protecting your privacy and being transparent about how we collect, use, and protect
                your information, including data from Meta platforms.
              </p>
              <p className="text-sm text-muted-foreground">Last updated: December 15, 2024</p>
            </div>
          </div>
        </section>

        {/* Privacy Overview */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-green-500" />
                  <h3 className="font-bold mb-2">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security for all your data</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Eye className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-bold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">Clear information about data usage</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-bold mb-2">User Control</h3>
                  <p className="text-sm text-muted-foreground">You control your data and privacy settings</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 mx-auto mb-4 text-orange" />
                  <h3 className="font-bold mb-2">Global Compliance</h3>
                  <p className="text-sm text-muted-foreground">GDPR, CCPA, and Meta compliance</p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <p className="text-muted-foreground">
                      When you create an account, we collect basic information such as your name, email address, and
                      company information. This helps us provide personalized service and communicate with you about
                      your account.
                    </p>

                    <h3 className="text-lg font-semibold">Meta Platform Data</h3>
                    <p className="text-muted-foreground">
                      With your explicit consent and through authorized Meta APIs, we collect data from your connected Instagram accounts to provide our automation services. This includes:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li><strong>Comments Management:</strong> Comments on your posts, replies, and comment metadata to help you manage interactions</li>
                      <li><strong>Messages Management:</strong> Direct messages and conversations to provide automated response services</li>
                      <li><strong>Basic Display Information:</strong> Your profile information, posts, and media that you choose to share</li>
                      <li><strong>Insights Data:</strong> Analytics and performance metrics for your content and account</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We only access data that is necessary for the specific services you have requested and authorized. 
                      We comply with all Meta Platform Terms and Data Policy requirements.
                    </p>

                    <h3 className="text-lg font-semibold">Usage Information</h3>
                    <p className="text-muted-foreground">
                      We collect information about how you use our platform, including features accessed, time spent,
                      and interaction patterns. This helps us improve our service and provide better user experiences.
                    </p>

                    <h3 className="text-lg font-semibold">Technical Information</h3>
                    <p className="text-muted-foreground">
                      We automatically collect technical information such as IP addresses, browser types, device
                      information, and operating systems. This information is used for security, analytics, and service
                      optimization.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Provision</h3>
                    <p className="text-muted-foreground">
                      We use your information to provide, maintain, and improve our social media automation services.
                      This includes processing your automations, managing your campaigns, and providing analytics.
                      We process Meta platform data solely to provide the services you have requested.
                    </p>

                    <h3 className="text-lg font-semibold">Meta Data Processing</h3>
                    <p className="text-muted-foreground">
                      Data obtained from Meta platforms is used exclusively for:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>Automating comment responses and management on your posts</li>
                      <li>Managing and responding to direct messages on your behalf</li>
                      <li>Displaying your content within our platform for management purposes</li>
                      <li>Providing analytics and insights about your social media performance</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We do not use Meta platform data for advertising, marketing to other users, or any purpose 
                      not explicitly authorized by you and permitted by Meta&apos;s terms.
                    </p>

                    <h3 className="text-lg font-semibold">User Profile Building</h3>
                    <p className="text-muted-foreground">
                      We obtain your explicit consent before building or augmenting user profiles using data from 
                      Meta platforms or any other source. You can withdraw this consent at any time through your 
                      account settings.
                    </p>

                    <h3 className="text-lg font-semibold">Communication</h3>
                    <p className="text-muted-foreground">
                      We may use your contact information to send you service updates, security alerts, and support
                      messages. You can opt out of marketing communications at any time.
                    </p>

                    <h3 className="text-lg font-semibold">Security and Fraud Prevention</h3>
                    <p className="text-muted-foreground">
                      We use your information to protect our platform and users from fraud, abuse, and security threats.
                      This includes monitoring for suspicious activity and implementing security measures.
                    </p>

                    <h3 className="text-lg font-semibold">Legal Compliance</h3>
                    <p className="text-muted-foreground">
                      We may use your information to comply with legal obligations, respond to legal requests, and
                      protect our rights and the rights of others.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Meta Data Sharing Restrictions</h3>
                    <p className="text-muted-foreground">
                      Data obtained from Meta platforms is subject to strict sharing restrictions:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>We do not share, sell, or transfer Meta platform data to third parties for advertising or marketing purposes</li>
                      <li>We do not use Meta data to create advertising audiences or profiles for other users</li>
                      <li>Any sharing complies with Meta&apos;s Platform Terms and Data Policy</li>
                    </ul>

                    <h3 className="text-lg font-semibold">Service Providers</h3>
                    <p className="text-muted-foreground">
                      We work with trusted third-party service providers who help us operate our platform. These
                      providers have no independent right to access or use Meta platform data that you have given us access to.
                    </p>

                    <h3 className="text-lg font-semibold">Legal Requirements</h3>
                    <p className="text-muted-foreground">
                      We may disclose your information if required by law, court order, or government request, or to
                      protect the safety and security of our users and platform. We will notify affected users when
                      legally permitted to do so. We strictly ensure that this process is legal and that the requesting authority 
                      have a lawful procedure that ensures this safety of the affected person.
                    </p>

                    <h3 className="text-lg font-semibold">Business Transfers</h3>
                    <p className="text-muted-foreground">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred to
                      the new entity. We will notify you of any such transfer and any changes to this privacy policy.
                      Any transfer will comply with applicable data protection laws and Meta&apos;s requirements.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Data Security and Protection</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Encryption and Security</h3>
                    <p className="text-muted-foreground">
                      All data, including information from Meta platforms, is encrypted in transit using TLS 1.3 and 
                      at rest using AES-256 encryption. We implement industry-standard security protocols to protect 
                      your information from unauthorized access, including compliance with Meta&apos;s security requirements.
                    </p>

                    <h3 className="text-lg font-semibold">Access Controls</h3>
                    <p className="text-muted-foreground">
                      We implement strict access controls and authentication measures. Only authorized personnel have
                      access to your data, and all access is logged and monitored. Access to Meta platform data is 
                      further restricted to personnel directly involved in providing the services you have requested.
                    </p>

                    <h3 className="text-lg font-semibold">Data Integrity</h3>
                    <p className="text-muted-foreground">
                      We maintain the integrity of your data through regular backups, monitoring systems, and 
                      validation procedures. We do not falsify, corrupt, or unauthorized destroy any data, 
                      including Meta platform data.
                    </p>

                    <h3 className="text-lg font-semibold">Regular Audits</h3>
                    <p className="text-muted-foreground">
                      We conduct regular security audits and penetration testing to identify and address potential
                      vulnerabilities.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Consent Management</h3>
                    <p className="text-muted-foreground">
                      You have complete control over the consent you provide for data processing:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>You can withdraw consent for Meta platform data access at any time through your account settings</li>
                      <li>You can modify which Meta data types we can access and process</li>
                      <li>You can revoke authorization for specific automation features</li>
                      <li>Withdrawing consent may limit some features but will not affect your basic account access</li>
                    </ul>

                    <h3 className="text-lg font-semibold">Access and Portability</h3>
                    <p className="text-muted-foreground">
                      You have the right to access your personal information and request a copy of your data in a
                      portable format. You can download your data through your account settings or by contacting us.
                      This includes data we&apos;ve collected from Meta platforms on your behalf.
                    </p>

                    <h3 className="text-lg font-semibold">Correction and Updates</h3>
                    <p className="text-muted-foreground">
                      You can update your account information at any time through your account settings. If you notice
                      any inaccuracies in your data, please let us know so we can correct them promptly.
                    </p>

                    <h3 className="text-lg font-semibold">Deletion Rights</h3>
                    <p className="text-muted-foreground">
                      You can request deletion of your account and associated data at any time. We will delete your 
                      Meta platform data within 30 days of your request, except where retention is required by law. 
                      Some anonymized information may be retained for legitimate business purposes.
                    </p>

                    <h3 className="text-lg font-semibold">Data Subject Rights</h3>
                    <p className="text-muted-foreground">
                      If Meta communicates any data subject rights request to us regarding your information, we will 
                      promptly notify you and assist in fulfilling the request in accordance with applicable laws.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Data Retention and Deletion</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">General Data Retention</h3>
                    <p className="text-muted-foreground">
                      We retain your information for as long as necessary to provide our services and comply with legal
                      obligations. Account information is retained while your account is active and for up to 90 days
                      after account closure for customer service purposes.
                    </p>

                    <h3 className="text-lg font-semibold">Meta Platform Data Retention</h3>
                    <p className="text-muted-foreground">
                      Data from Meta platforms is retained according to the following schedule:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>Active automation data: Retained while automations are active</li>
                      <li>Historical analytics data: Retained for up to 2 years for reporting purposes</li>
                      <li>Cached content: Automatically deleted every 30 days</li>
                      <li>All Meta data: Completely deleted within 30 days of account termination or consent withdrawal</li>
                    </ul>

                    <h3 className="text-lg font-semibold">Automatic Deletion</h3>
                    <p className="text-muted-foreground">
                      We implement automatic deletion procedures to ensure data is not retained longer than necessary.
                      Users are notified before any significant data deletion occurs.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Third-Party Integrations and Meta Compliance</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Meta Platform Integration</h3>
                    <p className="text-muted-foreground">
                      Our integration with Meta platforms (Facebook and Instagram) is governed by:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>Meta&apos;s Platform Terms and Data Policy</li>
                      <li>Facebook and Instagram Terms of Service</li>
                      <li>Meta&apos;s Developer Policies</li>
                      <li>This Privacy Policy</li>
                    </ul>

                    <h3 className="text-lg font-semibold">API Usage Compliance</h3>
                    <p className="text-muted-foreground">
                      We use Meta&apos;s APIs in strict compliance with their terms, including:
                    </p>
                    <ul className="text-muted-foreground list-disc ml-6 space-y-1">
                      <li>Only accessing data necessary for requested services</li>
                      <li>Implementing proper rate limiting and usage controls</li>
                      <li>Maintaining up-to-date API integrations</li>
                      <li>Respecting user privacy settings on Meta platforms</li>
                    </ul>

                    <h3 className="text-lg font-semibold">User Authentication</h3>
                    <p className="text-muted-foreground">
                      We use Meta&apos;s official authentication mechanisms to ensure secure access to your accounts. 
                      We never store your Meta platform passwords or use inauthentic authentication methods.
                    </p>
                  </div>
                </section>


                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not intended for children under 13 years of age (or the applicable age of digital 
                    consent in your jurisdiction). We do not knowingly collect personal information from children under 
                    the applicable age. If we become aware that we have collected such information, we will take steps 
                    to delete it promptly and notify the relevant authorities as required.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time to reflect changes in our practices, legal
                    requirements, or Meta&apos;s terms. We will notify you of any material changes by email or through our 
                    platform at least 30 days before the changes take effect. Your continued use of our services after 
                    such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Contact Us and Data Protection</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy, our privacy practices, or your data rights, 
                    please contact us:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> privacy@yazzil.com
                    </p>
                    {/* <p className="text-muted-foreground">
                      <strong>Address:</strong> 00100 Nairobi, Kenya
                    </p> */}
                    <p className="text-muted-foreground">
                      <strong>Data Protection Officer:</strong> dpo@yazzil.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Meta Data Subject Requests:</strong> meta-privacy@yazzil.com
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
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our privacy team is here to help. Contact us with any questions or concerns about your data, 
                including Meta platform data handling.
              </p>
              <Button size="lg">Contact Privacy Team</Button>
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