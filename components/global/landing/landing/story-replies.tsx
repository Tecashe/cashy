import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function StoryReplies() {
  const benefits = [
    "Auto-reply to every story reaction",
    "Send custom messages based on emoji",
    "Convert viewers into customers",
    "Track story engagement metrics",
    "Personalized responses at scale",
    "Never miss a story opportunity",
  ]

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Instagram Mockup - Left side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-foreground/10 bg-white max-w-md mx-auto">
              <div className="aspect-[9/16]">
                <img
                  src="/instagram-story-replies-interface-with-automated-r.jpg"
                  alt="Instagram Story Replies Automation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-instagram-pink/20 blur-3xl"></div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full instagram-gradient opacity-20 blur-3xl"></div>
          </div>

          {/* Content - Right side */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-instagram-pink/10 border border-instagram-pink/20 mb-6">
              <span className="text-sm font-semibold text-instagram-pink">STORY AUTOMATION</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Engage With Every{" "}
              <span className="bg-gradient-to-r from-instagram-pink to-instagram-orange bg-clip-text text-transparent">
                Story Reply
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your stories get hundreds of reactions but you can&apos;s respond to them all? yazzil automatically engages
              with every story reply, turning casual viewers into loyal followers.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-instagram-pink/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-instagram-pink" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-instagram-pink hover:bg-instagram-pink/90 text-white">
              Automate Story Replies
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
