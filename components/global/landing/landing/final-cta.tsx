import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
            Ready to <span className="text-orange">10x Your Instagram Engagement?</span>
          </h2>

          <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 10,000+ Instagram businesses using yazzil to automate their DMs, story replies, and comments. Start
            your free 14-day trial today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-orange text-black hover:bg-orange/90 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 h-auto font-semibold w-full sm:w-auto"
              >
                Start with a FREE plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a
              href="https://calendly.com/tecashe111/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-8 md:px-10 py-6 md:py-7 h-auto border-2 border-muted text-white hover:border-orange hover:text-orange bg-transparent w-full"
              >
                Schedule a Demo
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground">No credit card required • Setup in 2 minutes </p>

          {/* Trust badges */}
          {/* <div className="mt-16 pt-16 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6">Trusted by leading Instagram brands</p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-30">
              <div className="text-2xl font-bold text-muted-foreground">BRAND</div>
              <div className="text-2xl font-bold text-muted-foreground">BRAND</div>
              <div className="text-2xl font-bold text-muted-foreground">BRAND</div>
              <div className="text-2xl font-bold text-muted-foreground">BRAND</div>
              <div className="text-2xl font-bold text-muted-foreground">BRAND</div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
