"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { SetupStep } from "./wizard-steps/setup-step"
import { TriggerStep } from "./wizard-steps/trigger-step"
import { ActionsStep } from "./wizard-steps/actions-step"
import { ReviewStep } from "./wizard-steps/review-step"
import type { AutomationFlow, LogicOperator } from "@/lib/types/automation"
import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"

interface AutomationWizardProps {
  automation?: any
  accounts: any[]
  tags: any[]
}

const STEPS = [
  { id: 1, name: "Setup", description: "Basic information" },
  { id: 2, name: "Triggers", description: "When to activate" },
  { id: 3, name: "Actions", description: "What to do" },
  { id: 4, name: "Review", description: "Review & activate" },
]

export function AutomationWizard({ automation, accounts, tags }: AutomationWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const [flow, setFlow] = useState<AutomationFlow>({
    id: automation?.id,
    name: automation?.name || "",
    description: automation?.description || "",
    instagramAccountId: automation?.instagramAccountId || "",
    triggers: automation?.triggers || [],
    triggerLogic: "OR" as LogicOperator,
    actions:
      automation?.actions?.map((a: any) => ({
        id: a.id,
        type: a.type,
        config: a.content,
      })) || [],
    isActive: automation?.isActive || false,
  })

  const canProceed = () => {
    if (currentStep === 1) {
      return flow.name && flow.instagramAccountId
    }
    if (currentStep === 2) {
      return flow.triggers.length > 0
    }
    if (currentStep === 3) {
      return flow.actions.length > 0
    }
    return true
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const primaryTrigger = flow.triggers[0]

      const actionsData = flow.actions.map((action, index) => ({
        type: action.type,
        content: action.config,
        order: index,
      }))

      if (automation?.id) {
        await updateAutomation(automation.id, {
          name: flow.name,
          description: flow.description,
          instagramAccountId: flow.instagramAccountId,
          triggerType: primaryTrigger.type,
          triggerConditions: primaryTrigger.config,
          actions: actionsData,
        })
      } else {
        await createAutomation({
          name: flow.name,
          description: flow.description,
          instagramAccountId: flow.instagramAccountId,
          triggerType: primaryTrigger.type,
          triggerConditions: primaryTrigger.config,
          actions: actionsData,
        })
      }

      router.push("/automations")
    } catch (error) {
      console.error("Failed to save automation:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/automations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{automation ? "Edit Automation" : "Create Automation"}</h1>
          <p className="text-sm text-muted-foreground">{STEPS[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-2 border-primary bg-background text-primary"
                        : "border bg-background text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{step.name}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && <SetupStep flow={flow} setFlow={setFlow} accounts={accounts} />}
        {currentStep === 2 && <TriggerStep flow={flow} setFlow={setFlow} accounts={accounts} />}
        {currentStep === 3 && <ActionsStep flow={flow} setFlow={setFlow} tags={tags} />}
        {currentStep === 4 && <ReviewStep flow={flow} setFlow={setFlow} />}
      </div>

      {/* Navigation */}
      <Card className="sticky bottom-0 p-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </div>
          {currentStep < STEPS.length ? (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving || !canProceed()}>
              {isSaving ? "Saving..." : automation ? "Update" : "Create"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
