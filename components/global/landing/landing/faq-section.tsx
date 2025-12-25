"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does yazzil work with Instagram's API?",
    answer:
    "yazzil is built using Instagram's official Graph API, which means your account is 100% safe and compliant with all platform guidelines. We follow all of Meta's best practices to ensure your automation is secure and won't risk your account.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most users are up and running in under 2 minutes. Simply connect your Instagram account, set up your first automation flow using our visual builder, and you're done. We also provide templates to make it even faster.",
  },
  
  // {
  //   question: "How is yazzil different from Manychat?",
  //   answer:
  //     "yazzil is built specifically for Instagram, while Manychat is a multi-platform tool. This means we offer deeper Instagram integration, faster setup, better story and comment automation, and a more intuitive interface designed specifically for Instagram businesses.",
  // },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with yazzil for any reason, just contact our support team and we'll process a full refund, no questions asked.",
  },
  {
    question: "Can I integrate yazzil with my existing tools?",
    answer:
      "yazzil integrates with 50+ popular tools including Shopify, Stripe, HubSpot, Salesforce, Zoom, Calendly, and more. We also support Zapier and Make for custom integrations with thousands of other apps.",
  },
]

export function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-orange">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to know about yazzil</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="scroll-reveal bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-orange/50 transition-all"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-orange flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}
              >
                <div className="px-8 pb-6 text-muted-foreground leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="text-center mt-16 scroll-reveal">
          <p className="text-lg text-muted-foreground mb-4">Still have questions?</p>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-orange text-orange hover:bg-orange hover:text-black bg-transparent"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
