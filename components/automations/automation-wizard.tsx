// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"
// import { SetupStep } from "./wizard-steps/setup-step"
// import { TriggerStep } from "./wizard-steps/trigger-step"
// import { ActionsStep } from "./wizard-steps/actions-step"
// import { ReviewStep } from "./wizard-steps/review-step"
// import type { AutomationFlow, LogicOperator } from "@/lib/types/automation"
// import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
// import { motion, AnimatePresence } from "framer-motion"
// import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"

// interface AutomationWizardProps {
//   automation?: any
//   accounts: any[]
//   tags: any[]
// }

// const STEPS = [
//   { id: 1, name: "Setup", description: "Basic information" },
//   { id: 2, name: "Triggers", description: "When to activate" },
//   { id: 3, name: "Actions", description: "What to do" },
//   { id: 4, name: "Review", description: "Review & activate" },
// ]

// export function AutomationWizard({ automation, accounts, tags }: AutomationWizardProps) {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [isSaving, setIsSaving] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<string[]>([])

//   const [flow, setFlow] = useState<AutomationFlow>({
//     id: automation?.id,
//     name: automation?.name || "",
//     description: automation?.description || "",
//     instagramAccountId: automation?.instagramAccountId || "",
//     triggers: automation?.triggers || [],
//     triggerLogic: "OR" as LogicOperator,
//     actions:
//       automation?.actions?.map((a: any) => ({
//         id: a.id,
//         type: a.type,
//         config: a.content,
//       })) || [],
//     isActive: automation?.isActive || false,
//   })

//   useEffect(() => {
//     if (!automation?.id) {
//       const savedProgress = localStorage.getItem("automation-wizard-progress")
//       if (savedProgress) {
//         try {
//           const parsed = JSON.parse(savedProgress)
//           setFlow(parsed.flow)
//           setCurrentStep(parsed.currentStep)
//         } catch (error) {
//           console.error("Failed to parse saved progress:", error)
//         }
//       }
//     }
//   }, [automation?.id])

//   useEffect(() => {
//     if (!automation?.id) {
//       localStorage.setItem(
//         "automation-wizard-progress",
//         JSON.stringify({
//           flow,
//           currentStep,
//         }),
//       )
//     }
//   }, [flow, currentStep, automation?.id])

//   const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
//     const errors: string[] = []

//     if (step === 1) {
//       if (!flow.name.trim()) errors.push("Please enter a name for your automation")
//       if (!flow.instagramAccountId) errors.push("Please select an Instagram account")
//     }

//     if (step === 2) {
//       if (flow.triggers.length === 0) errors.push("Please add at least one trigger")

//       flow.triggers.forEach((trigger, index) => {
//         const triggerInfo = TRIGGER_TYPES[trigger.type]
//         if (triggerInfo?.requiresConfig) {
//           if (trigger.type === "keyword" && (!trigger.config?.keywords || trigger.config.keywords.length === 0)) {
//             errors.push(`Trigger ${index + 1} (${triggerInfo.label}): Please configure keywords`)
//           }
//           if (trigger.type === "comment" && (!trigger.config?.keywords || trigger.config.keywords.length === 0)) {
//             errors.push(`Trigger ${index + 1} (${triggerInfo.label}): Please configure keywords`)
//           }
//         }
//       })
//     }

//     if (step === 3) {
//       if (flow.actions.length === 0) errors.push("Please add at least one action")

//       flow.actions.forEach((action, index) => {
//         if (action.type === "send_message" && !action.config?.message) {
//           errors.push(`Action ${index + 1}: Please enter a message`)
//         }
//         if (action.type === "reply_to_comment" && !action.config?.message) {
//           errors.push(`Action ${index + 1}: Please enter a reply message`)
//         }
//       })
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     }
//   }

//   const validateCurrentStep = (): boolean => {
//     const validation = validateStep(currentStep)
//     return validation.isValid
//   }

//   useEffect(() => {
//     setValidationErrors([])
//   }, [currentStep])

//   const handleNext = () => {
//     const validation = validateStep(currentStep)
//     setValidationErrors(validation.errors)

//     if (validation.isValid) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }

//   const handleSave = async () => {
//     const validation = validateStep(currentStep)
//     if (!validation.isValid) {
//       setValidationErrors(validation.errors)
//       return
//     }

//     setIsSaving(true)
//     try {
//       const primaryTrigger = flow.triggers[0]

//       const actionsData = flow.actions.map((action, index) => ({
//         type: action.type,
//         content: action.config,
//         order: index,
//       }))

//       if (automation?.id) {
//         await updateAutomation(automation.id, {
//           name: flow.name,
//           description: flow.description,
//           instagramAccountId: flow.instagramAccountId,
//           triggerType: primaryTrigger.type,
//           triggerConditions: primaryTrigger.config,
//           actions: actionsData,
//         })
//       } else {
//         await createAutomation({
//           name: flow.name,
//           description: flow.description,
//           instagramAccountId: flow.instagramAccountId,
//           triggerType: primaryTrigger.type,
//           triggerConditions: primaryTrigger.config,
//           actions: actionsData,
//         })
//       }

//       if (!automation?.id) {
//         localStorage.removeItem("automation-wizard-progress")
//       }

//       router.push("/automations")
//     } catch (error) {
//       console.error("Failed to save automation:", error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return (
//     <div className="relative mx-auto max-w-5xl px-4 py-8">
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl" />
//         <div
//           className="absolute right-1/4 bottom-0 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       <motion.div
//         className="mb-8 flex items-center gap-5"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => router.push("/automations")}
//           className="h-10 w-10 rounded-lg hover:bg-muted/50"
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
//             {automation ? "Edit Automation" : "Create Automation"}
//           </h1>
//           <p className="mt-1.5 text-base text-muted-foreground">{STEPS[currentStep - 1].description}</p>
//         </div>

//         <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium ring-1 ring-border/50">
//           <Sparkles className="h-4 w-4 text-primary" />
//           Step {currentStep} of {STEPS.length}
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//       >
//         <Card className="mb-8 overflow-hidden border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
//           <div className="flex items-center justify-between">
//             {STEPS.map((step, index) => (
//               <div key={step.id} className="flex flex-1 items-center">
//                 <motion.div
//                   className="flex items-center gap-3"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <div
//                     className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
//                       currentStep > step.id
//                         ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg ring-2 ring-primary/20"
//                         : currentStep === step.id
//                           ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary ring-2 ring-primary/50 shadow-md"
//                           : "bg-muted/50 text-muted-foreground ring-1 ring-border/50"
//                     }`}
//                   >
//                     {currentStep > step.id ? (
//                       <motion.div
//                         initial={{ scale: 0, rotate: -180 }}
//                         animate={{ scale: 1, rotate: 0 }}
//                         transition={{ duration: 0.4, ease: "easeOut" }}
//                       >
//                         <Check className="h-5 w-5" />
//                       </motion.div>
//                     ) : (
//                       step.id
//                     )}

//                     {currentStep === step.id && (
//                       <motion.div
//                         className="absolute inset-0 rounded-xl bg-primary/30"
//                         animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
//                         transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//                       />
//                     )}
//                   </div>

//                   <div className="hidden sm:block">
//                     <p
//                       className={`text-sm font-semibold leading-tight ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
//                     >
//                       {step.name}
//                     </p>
//                   </div>
//                 </motion.div>

//                 {index < STEPS.length - 1 && (
//                   <div className="relative mx-3 h-1 flex-1 overflow-hidden rounded-full bg-border/50">
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
//                       initial={{ scaleX: 0 }}
//                       animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
//                       transition={{ duration: 0.5, ease: "easeInOut" }}
//                       style={{ transformOrigin: "left" }}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </motion.div>

//       <motion.div
//         className="mb-8 min-h-[500px]"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentStep}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {currentStep === 1 && <SetupStep flow={flow} setFlow={setFlow} accounts={accounts} />}
//             {currentStep === 2 && <TriggerStep flow={flow} setFlow={setFlow} accounts={accounts} />}
//             {currentStep === 3 && <ActionsStep flow={flow} setFlow={setFlow} tags={tags} />}
//             {currentStep === 4 && <ReviewStep flow={flow} setFlow={setFlow} accounts={accounts} />}
//           </motion.div>
//         </AnimatePresence>

//         {validationErrors.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4"
//           >
//             <h4 className="font-semibold text-destructive mb-2">Please fix the following issues:</h4>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm text-destructive">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         )}
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <Card className="sticky bottom-6 border border-border/50 bg-background/80 p-5 shadow-2xl backdrop-blur-xl">
//           <div className="flex items-center justify-between gap-6">
//             <Button
//               variant="outline"
//               size="lg"
//               onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
//               disabled={currentStep === 1}
//               className="min-w-[120px] border-border/50 hover:bg-muted/50"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>

//             <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:hidden">
//               <Sparkles className="h-4 w-4 text-primary" />
//               {currentStep} / {STEPS.length}
//             </div>

//             {currentStep < STEPS.length ? (
//               <Button
//                 size="lg"
//                 onClick={handleNext}
//                 className="min-w-[120px] shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 Next
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             ) : (
//               <Button
//                 size="lg"
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="group relative min-w-[120px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <span className="relative z-10">{isSaving ? "Saving..." : automation ? "Update" : "Create"}</span>
//                 {!isSaving && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//                 )}
//               </Button>
//             )}
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
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
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"

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
  const [validationErrors, setValidationErrors] = useState<string[]>([])

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

  useEffect(() => {
    if (!automation?.id) {
      const savedProgress = localStorage.getItem("automation-wizard-progress")
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress)
          setFlow(parsed.flow)
          setCurrentStep(parsed.currentStep)
        } catch (error) {
          console.error("Failed to parse saved progress:", error)
        }
      }
    }
  }, [automation?.id])

  useEffect(() => {
    if (!automation?.id) {
      localStorage.setItem(
        "automation-wizard-progress",
        JSON.stringify({
          flow,
          currentStep,
        }),
      )
    }
  }, [flow, currentStep, automation?.id])

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (step === 1) {
      if (!flow.name.trim()) errors.push("Please enter a name for your automation")
      if (!flow.instagramAccountId) errors.push("Please select an Instagram account")
    }

    if (step === 2) {
      if (flow.triggers.length === 0) errors.push("Please add at least one trigger")

      flow.triggers.forEach((trigger, index) => {
        const triggerInfo = TRIGGER_TYPES[trigger.type]
        if (triggerInfo?.requiresConfig) {
          if (trigger.type === "comment") {
            const listenMode = trigger.config?.listenMode || "any"
            if (listenMode === "keywords" && (!trigger.config?.keywords || trigger.config.keywords.length === 0)) {
              errors.push(`Trigger ${index + 1} (${triggerInfo.label}): Please add at least one keyword`)
            }
          }

          if (trigger.type === "keyword" && (!trigger.config?.keywords || trigger.config.keywords.length === 0)) {
            errors.push(`Trigger ${index + 1} (${triggerInfo.label}): Please configure keywords`)
          }
        }
      })
    }

    if (step === 3) {
      if (flow.actions.length === 0) errors.push("Please add at least one action")

      flow.actions.forEach((action, index) => {
        if (action.type === "send_message" && !action.config?.message) {
          errors.push(`Action ${index + 1}: Please enter a message`)
        }
        if (action.type === "reply_to_comment" && !action.config?.message) {
          errors.push(`Action ${index + 1}: Please enter a reply message`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const validateCurrentStep = (): boolean => {
    const validation = validateStep(currentStep)
    return validation.isValid
  }

  useEffect(() => {
    setValidationErrors([])
  }, [currentStep])

  const handleNext = () => {
    const validation = validateStep(currentStep)
    setValidationErrors(validation.errors)

    if (validation.isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSave = async () => {
    const validation = validateStep(currentStep)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

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

      if (!automation?.id) {
        localStorage.removeItem("automation-wizard-progress")
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
            {currentStep === 4 && <ReviewStep flow={flow} setFlow={setFlow} accounts={accounts} />}
          </motion.div>
        </AnimatePresence>

        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4"
          >
            <h4 className="font-semibold text-destructive mb-2">Please fix the following issues:</h4>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">
                  {error}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
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
                onClick={handleNext}
                className="min-w-[120px] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSave}
                disabled={isSaving}
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
