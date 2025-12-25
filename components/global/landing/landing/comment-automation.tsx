import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function CommentAutomation() {
  const benefits = [
    "Auto-reply to post comments",
    "Send DMs to commenters automatically",
    "Filter spam and negative comments",
    "Boost engagement rate instantly",
    "Keyword-based auto-responses",
    "Turn comments into conversations",
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-instagram-orange/5 via-instagram-yellow/5 to-instagram-pink/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-instagram-orange/10 border border-instagram-orange/20 mb-6">
              <span className="text-sm font-semibold text-instagram-orange">COMMENT AUTOMATION</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Never Miss a{" "}
              <span className="bg-gradient-to-r from-instagram-orange to-instagram-yellow bg-clip-text text-transparent">
                Comment Again
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comments are gold for engagement, but responding to hundreds manually is impossible. yazzil automatically
              replies to comments and sends personalized DMs to turn engagement into sales.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-instagram-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-instagram-orange" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-instagram-orange hover:bg-instagram-orange/90 text-white">
              Automate Comments
            </Button>
          </div>

          {/* Instagram Mockup */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-foreground/10 bg-white max-w-md mx-auto">
              <div className="aspect-[9/16]">
                <img
                  src="/instagram-post-comments-with-automated-replies.jpg"
                  alt="Instagram Comment Automation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-instagram-yellow/20 blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-instagram-orange/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
