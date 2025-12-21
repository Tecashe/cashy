"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"
import { SetupStep } from "./wizard-steps/setup-step"
import { TriggerStep } from "./wizard-steps/trigger-step"
import { ActionsStep } from "./wizard-steps/actions-step"
import { ReviewStep } from "./wizard-steps/review-step"
import type { AutomationFlow, LogicOperator } from "@/lib/types/automation"
import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="relative mx-auto max-w-5xl px-4 py-8">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-0 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <motion.div
        className="mb-8 flex items-center gap-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/automations")}
          className="h-10 w-10 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {automation ? "Edit Automation" : "Create Automation"}
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">{STEPS[currentStep - 1].description}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium ring-1 ring-border/50">
          <Sparkles className="h-4 w-4 text-primary" />
          Step {currentStep} of {STEPS.length}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-8 overflow-hidden border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg ring-2 ring-primary/20"
                        : currentStep === step.id
                          ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary ring-2 ring-primary/50 shadow-md"
                          : "bg-muted/50 text-muted-foreground ring-1 ring-border/50"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      step.id
                    )}

                    {currentStep === step.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-primary/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <p
                      className={`text-sm font-semibold leading-tight ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.name}
                    </p>
                  </div>
                </motion.div>

                {index < STEPS.length - 1 && (
                  <div className="relative mx-3 h-1 flex-1 overflow-hidden rounded-full bg-border/50">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="mb-8 min-h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <SetupStep flow={flow} setFlow={setFlow} accounts={accounts} />}
            {currentStep === 2 && <TriggerStep flow={flow} setFlow={setFlow} accounts={accounts} />}
            {currentStep === 3 && <ActionsStep flow={flow} setFlow={setFlow} tags={tags} />}
            {currentStep === 4 && <ReviewStep flow={flow} setFlow={setFlow} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="sticky bottom-6 border border-border/50 bg-background/80 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="min-w-[120px] border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:hidden">
              <Sparkles className="h-4 w-4 text-primary" />
              {currentStep} / {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <Button
                size="lg"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className="min-w-[120px] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSave}
                disabled={isSaving || !canProceed()}
                className="group relative min-w-[120px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10">{isSaving ? "Saving..." : automation ? "Update" : "Create"}</span>
                {!isSaving && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
