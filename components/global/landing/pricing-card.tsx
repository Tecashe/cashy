import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface PricingCardProps {
  title: string
  price: number
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
}: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col overflow-hidden border-border/50 ${popular ? "border-primary/50 shadow-md shadow-primary/10" : "bg-background/50"}`}
    >
      <CardHeader className="pb-2">
        {popular && (
          <Badge variant="outline" className="mb-2 w-fit border-primary/20 bg-primary/10 text-primary">
            Most Popular
          </Badge>
        )}
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
