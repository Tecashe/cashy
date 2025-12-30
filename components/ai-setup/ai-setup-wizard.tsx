"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bot, Store, Brain, Plug, TestTube, CheckCircle2 } from "lucide-react"
import { BusinessInfoStep } from "./steps/business-info-step"
import { ProductSetupStep } from "./steps/product-setup-step"
import { KnowledgeBaseStep } from "./steps/knowledge-base-step"
import { IntegrationStep } from "./steps/integration-step"
import { AIConfigStep } from "./steps/ai-config-step"
import { TestingStep } from "./steps/testing-step"

type SetupStep = {
  id: string
  title: string
  description: string
  icon: any
  component: any
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: "business",
    title: "Business Information",
    description: "Tell us about your business so the AI can represent you accurately",
    icon: Bot,
    component: BusinessInfoStep,
  },
  {
    id: "products",
    title: "Products & Services",
    description: "Upload your product catalog so the AI can show and sell your items",
    icon: Store,
    component: ProductSetupStep,
  },
  {
    id: "knowledge",
    title: "Knowledge Base",
    description: "Add FAQs, policies, and business info for the AI to reference",
    icon: Brain,
    component: KnowledgeBaseStep,
  },
  {
    id: "integrations",
    title: "Connect Services",
    description: "Link Stripe for payments, Google Calendar for bookings, and more",
    icon: Plug,
    component: IntegrationStep,
  },
  {
    id: "ai-config",
    title: "AI Personality",
    description: "Configure how the AI talks and what it can do",
    icon: Bot,
    component: AIConfigStep,
  },
  {
    id: "test",
    title: "Test & Launch",
    description: "Test your AI assistant before going live",
    icon: TestTube,
    component: TestingStep,
  },
]

export function AISetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [setupData, setSetupData] = useState<Record<string, any>>({})

  const progress = (completedSteps.size / SETUP_STEPS.length) * 100
  const CurrentStepComponent = SETUP_STEPS[currentStep].component

  const handleStepComplete = (stepId: string, data: any) => {
    setSetupData((prev) => ({ ...prev, [stepId]: data }))
    setCompletedSteps((prev) => new Set([...prev, stepId]))
  }

  const handleNext = () => {
    if (currentStep < SETUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Setup Progress</span>
              <span className="text-muted-foreground">
                {completedSteps.size} of {SETUP_STEPS.length} steps completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {SETUP_STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = completedSteps.has(step.id)

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? "border-primary bg-primary/5"
                  : isCompleted
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"}`}
                />
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
              </div>
              <div className="mt-2">
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {(() => {
              const Icon = SETUP_STEPS[currentStep].icon
              return <Icon className="h-8 w-8 text-primary" />
            })()}
            <div>
              <CardTitle className="text-2xl">{SETUP_STEPS[currentStep].title}</CardTitle>
              <CardDescription className="text-base mt-1">{SETUP_STEPS[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={setupData[SETUP_STEPS[currentStep].id]}
            onComplete={(data: any) => handleStepComplete(SETUP_STEPS[currentStep].id, data)}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === SETUP_STEPS.length - 1}
          />
        </CardContent>
      </Card>
    </div>
  )
}
