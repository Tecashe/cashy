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
import { AlertCircle } from "lucide-react"

interface ConfirmOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
  onConfirm: () => void | Promise<void>
}

export function useConfirm() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = useCallback(async (opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
    return new Promise<void>((resolve) => {
      const originalConfirm = opts.onConfirm
      opts.onConfirm = async () => {
        setIsLoading(true)
        try {
          await originalConfirm()
        } finally {
          setIsLoading(false)
          setOpen(false)
          resolve()
        }
      }
    })
  }, [])

  const dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {options?.variant === "danger" && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{options?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={isLoading}>{options?.cancelText || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => options?.onConfirm()}
            disabled={isLoading}
            className={options?.variant === "danger" ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {options?.confirmText || "Confirm"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { confirm, dialog }
}
