import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function DMAutomation() {
  const benefits = [
    "Instant responses to every DM",
    "Qualify leads automatically",
    "Send product catalogs & links",
    "Schedule follow-up messages",
    "Handle FAQs without human input",
    "Personalize based on user behavior",
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-instagram-purple/5 via-instagram-pink/5 to-instagram-orange/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-instagram-purple/10 border border-instagram-purple/20 mb-6">
              <span className="text-sm font-semibold text-instagram-purple">DM AUTOMATION</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Turn Every DM Into a{" "}
              <span className="bg-gradient-to-r from-instagram-purple to-instagram-pink bg-clip-text text-transparent">
                Sales Opportunity
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Stop losing customers because you can&apos;t respond fast enough. yazzil automatically handles every Instagram
              DM with intelligent, personalized responses that feel human.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-instagram-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-instagram-purple" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="instagram-gradient-static text-white hover:opacity-90 transition-opacity">
              Start Automating DMs
            </Button>
          </div>

          {/* Instagram Mockup */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-foreground/10 bg-white max-w-md mx-auto">
              <div className="aspect-[9/16]">
                <img
                  src="/instagram-dm-interface-mockup-showing-automated-me.jpg"
                  alt="Instagram DM Automation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full instagram-gradient opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-instagram-orange/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
