import { MessageSquare, Sparkles, MessageCircle, BarChart3, Zap, Shield } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: MessageSquare,
      title: "DM Automation",
      description:
        "Automatically respond to Instagram DMs with personalized messages. Handle FAQs, qualify leads, and close sales while you sleep.",
      color: "orange",
    },
    {
      icon: Sparkles,
      title: "Story Reply Automation",
      description:
        "Engage with every story reply instantly. Turn casual viewers into loyal customers with automated, personalized responses.",
      color: "green",
    },
    {
      icon: MessageCircle,
      title: "Comment Automation",
      description:
        "Never miss a comment again. Auto-reply to comments, send DMs to commenters, and boost your engagement rate effortlessly.",
      color: "red",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track every conversation, measure response rates, and optimize your automation with detailed insights and reports.",
      color: "yellow",
    },
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description:
        "Connect your Instagram account and start automating in under 2 minutes. No coding, no complexity, just results.",
      color: "purple",
    },
    {
      icon: Shield,
      title: "100% Instagram Safe",
      description:
        "Built with Instagram's official API. Your account is completely safe and compliant with all platform guidelines.",
      color: "maroon",
    },
  ]

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    orange: { bg: "bg-orange/10", icon: "bg-orange", border: "border-orange/30" },
    green: { bg: "bg-green/10", icon: "bg-green", border: "border-green/30" },
    red: { bg: "bg-red/10", icon: "bg-red", border: "border-red/30" },
    yellow: { bg: "bg-yellow/10", icon: "bg-yellow", border: "border-yellow/30" },
    purple: { bg: "bg-purple/10", icon: "bg-purple", border: "border-purple/30" },
    maroon: { bg: "bg-maroon/10", icon: "bg-maroon", border: "border-maroon/30" },
  }

  return (
    <section id="features" className="py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything You Need
            <br />
            <span className="text-orange">All-in-one Instagram automation platform</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Powerful automation tools that work together to scale your Instagram presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color]
            return (
              <div
                key={index}
                className={`p-6 lg:p-8 rounded-2xl ${colors.bg} border-2 ${colors.border} hover:scale-105 transition-all hover:shadow-2xl group scroll-reveal`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${colors.icon} flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-black" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-white">{feature.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
