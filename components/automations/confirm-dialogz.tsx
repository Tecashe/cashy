"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger" | "warning" | "success"
  onConfirm: () => void | Promise<void>
}

const variantStyles = {
  default: {
    icon: Info,
    iconBg: "from-blue-500/10 to-cyan-500/10",
    iconBorder: "border-blue-500/20",
    iconColor: "text-blue-500",
    confirmBg: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
  },
  danger: {
    icon: AlertTriangle,
    iconBg: "from-red-500/10 to-orange-500/10",
    iconBorder: "border-red-500/20",
    iconColor: "text-red-500",
    confirmBg: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "from-yellow-500/10 to-orange-500/10",
    iconBorder: "border-yellow-500/20",
    iconColor: "text-yellow-500",
    confirmBg: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "from-green-500/10 to-emerald-500/10",
    iconBorder: "border-green-500/20",
    iconColor: "text-green-500",
    confirmBg: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const style = variantStyles[variant]
  const Icon = style.icon

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
                  {/* Gradient background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

                  <div className="relative space-y-6 p-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-lg",
                          style.iconBg,
                          style.iconBorder,
                        )}
                      >
                        <Icon className={cn("h-8 w-8", style.iconColor)} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 text-center">
                      <DialogPrimitive.Title className="text-2xl font-semibold tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="text-base text-muted-foreground leading-relaxed">
                        {description}
                      </DialogPrimitive.Description>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="flex-1 h-11"
                      >
                        {cancelText}
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn("flex-1 h-11 text-white shadow-lg", style.confirmBg)}
                      >
                        {isLoading ? "Processing..." : confirmText}
                      </Button>
                    </div>
                  </div>

                  {/* Close button */}
                  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 opacity-70 transition-all hover:opacity-100 hover:bg-muted/50">
                    <X className="h-4 w-4" />
                  </DialogPrimitive.Close>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

// Hook for easier usage
export function useConfirm() {
  const [state, setState] = React.useState<{
    open: boolean
    title: string
    description: string
    variant: "default" | "danger" | "warning" | "success"
    confirmText?: string
    cancelText?: string
    onConfirm: () => void | Promise<void>
  }>({
    open: false,
    title: "",
    description: "",
    variant: "default",
    onConfirm: () => {},
  })

  const confirm = React.useCallback((options: Omit<typeof state, "open">) => {
    return new Promise<boolean>((resolve) => {
      setState({
        ...options,
        open: true,
        onConfirm: async () => {
          await options.onConfirm()
          resolve(true)
        },
      })
    })
  }, [])

  const dialog = (
    <ConfirmDialog
      {...state}
      onOpenChange={(open) => {
        setState((prev) => ({ ...prev, open }))
      }}
    />
  )

  return { confirm, dialog }
}
