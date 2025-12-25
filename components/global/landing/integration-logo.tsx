import { Card } from "@/components/ui/card"
import { Instagram, Facebook, Twitter, Linkedin, MessageSquare, Database } from "lucide-react"

export default function IntegrationLogos() {
  const platforms = [
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, color: "#E4405F" },
    { name: "WhatsApp", icon: <MessageSquare className="h-6 w-6" />, color: "#25D366" },
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, color: "#1877F2" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, color: "#1DA1F2" },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, color: "#0A66C2" },
    { name: "CRM", icon: <Database className="h-6 w-6" />, color: "#6366F1" },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {platforms.map((platform, i) => (
        <Card
          key={i}
          className="flex flex-col items-center justify-center p-4 border-border/50 bg-background/50 hover:border-primary/50 transition-all"
        >
          <div className="mb-2" style={{ color: platform.color }}>
            {platform.icon}
          </div>
          <span className="text-sm font-medium">{platform.name}</span>
        </Card>
      ))}
    </div>
  )
}
