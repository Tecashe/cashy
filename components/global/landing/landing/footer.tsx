import { Instagram, Twitter, Linkedin, Youtube, Facebook } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
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
  )
}
