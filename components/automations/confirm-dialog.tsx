"use client"

import { useState, useCallback } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface ConfirmOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export function useConfirm() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsLoading(true)
    try {
      await options?.onConfirm()
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const handleCancel = useCallback(() => {
    options?.onCancel?.()
    setOpen(false)
  }, [options])

  const dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              {options?.variant === "danger" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 flex-shrink-0 mt-0.5"
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0 mt-0.5"
                >
                  <AlertCircle className="h-5 w-5 text-primary" />
                </motion.div>
              )}
              <div className="flex-1">
                <AlertDialogTitle className={options?.variant === "danger" ? "text-destructive" : ""}>
                  {options?.title}
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-2">{options?.description}</AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 justify-end mt-6"
          >
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              {options?.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={
                options?.variant === "danger"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isLoading ? "Loading..." : options?.confirmText || "Confirm"}
            </AlertDialogAction>
          </motion.div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { confirm, dialog }
}
