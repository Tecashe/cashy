"use client"

import { useEffect, useRef } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Wokabi",
    role: "E-commerce Owner",
    company: "Luxe Boutique",
    image: "/wokabi.png",
    content:
      "yazzil transformed our Instagram sales. We went from manually responding to 50 DMs a day to automating 500+ conversations. Our revenue tripled in 2 months!",
    rating: 5,
    color: "orange",
  },
  {
    name: "Marcus Johnson",
    role: "Fitness Coach",
    company: "FitLife Training",
    image: "/coach.jpg",
    content:
      "I was skeptical about automation, but yazzil feels so natural. My clients love the instant responses, and I've booked 3x more consultations without lifting a finger.",
    rating: 5,
    color: "green",
  },
  {
    name: "Priya P",
    role: "Social Media Manager",
    company: "Digital Growth Agency",
    image: "/priya.png",
    content:
      "Managing 20+ client accounts was overwhelming. yazzil's automation saved us 30 hours per week. It's like having a full-time team working 24/7.",
    rating: 5,
    color: "purple",
  },
  {
    name: "Alex Rivera",
    role: "Restaurant Owner",
    company: "Taco Paradise",
    image: "/rivera.png",
    content:
      "We use yazzil for reservations and catering inquiries. Response time went from hours to seconds. Customer satisfaction is through the roof!",
    rating: 5,
    color: "red",
  },
  {
    name: "Emma Thompson",
    role: "Beauty Influencer",
    company: "@GlowWithEmma",
    image: "/emma.jpg",
    content:
      "With 500K followers, I couldn't keep up with DMs. yazzil handles brand inquiries, fan questions, and product recommendations automatically. Game changer!",
    rating: 5,
    color: "yellow",
  },
  {
    name: "David Kim",
    role: "Real Estate Agent",
    company: "Prime Properties",
    image: "/kim.png",
    content:
      "yazzil qualifies leads while I'm showing properties. I close more deals because I'm talking to serious buyers, not answering basic questions all day.",
    rating: 5,
    color: "maroon",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

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
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Loved by <span className="text-orange">10,000+</span> Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real users have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="scroll-reveal bg-card border-2 border-border rounded-3xl p-8 hover:border-${testimonial.color} transition-all duration-300 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className={`w-12 h-12 bg-${testimonial.color}/10 rounded-xl flex items-center justify-center mb-6`}>
                <Quote className={`w-6 h-6 text-${testimonial.color}`} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 text-${testimonial.color} fill-${testimonial.color}`} />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6 text-balance">{testimonial.content}</p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-20 text-center scroll-reveal">
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading brands worldwide</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/shopify-logo.png" alt="Shopify" className="h-8 object-contain" />
            <img src="/zoho.png" alt="Stripe" className="h-8 object-contain" />
            <img src="/airtable.png" alt="airtable" className="h-8 object-contain" />
            <img src="/salesforce.png" alt="Salesforce" className="h-8 object-contain" />
            <img src="/hubspot.png" alt="HubSpot" className="h-8 object-contain" />
          </div>
        </div>
        {/* <div className="mt-20 text-center scroll-reveal">
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading brands worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-muted-foreground">
                {brand}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}
