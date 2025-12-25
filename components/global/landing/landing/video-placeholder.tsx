import { Play } from "lucide-react"

interface VideoPlaceholderProps {
  title: string
  description: string
  accent?: "orange" | "green" | "red" | "yellow" | "purple" | "maroon"
}

export function VideoPlaceholder({ title, description, accent = "orange" }: VideoPlaceholderProps) {
  const colorClasses: Record<string, { bg: string; border: string; button: string }> = {
    orange: { bg: "bg-orange/5", border: "border-orange/30", button: "bg-orange" },
    green: { bg: "bg-green/5", border: "border-green/30", button: "bg-green" },
    red: { bg: "bg-red/5", border: "border-red/30", button: "bg-red" },
    yellow: { bg: "bg-yellow/5", border: "border-yellow/30", button: "bg-yellow" },
    purple: { bg: "bg-purple/5", border: "border-purple/30", button: "bg-purple" },
    maroon: { bg: "bg-maroon/5", border: "border-maroon/30", button: "bg-maroon" },
  }

  const colors = colorClasses[accent]

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold mb-3">{title}</h3>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>

          {/* Video Placeholder */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 ${colors.border} ${colors.bg} scroll-reveal`}
          >
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full ${colors.button} flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer`}
                >
                  <Play className="w-10 h-10 text-black fill-black ml-1" />
                </div>
                <p className="text-lg font-semibold text-white">[INSERT YOUR VIDEO HERE]</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Drop your Canva video here to showcase this feature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
