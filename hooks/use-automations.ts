// "use client"

// import { useCallback, useState, useTransition } from "react"
// import { useRouter } from "next/navigation"
// import {
//   getAutomations,
//   getTrashedAutomations,
//   moveToTrash,
//   restoreFromTrash,
//   permanentlyDeleteAutomation,
//   emptyTrash,
//   toggleAutomationStatus,
//   duplicateAutomation,
// } from "@/actions/automation-actions"

// export function useAutomations() {
//   const [automations, setAutomations] = useState<any[]>([])
//   const [trashedAutomations, setTrashedAutomations] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   const fetchAutomations = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const data = await getAutomations()
//       setAutomations(data)
//     } catch (error) {
//       console.error("[v0] Error fetching automations:", error)
//       setAutomations([])
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   const fetchTrashedAutomations = useCallback(async () => {
//     try {
//       const data = await getTrashedAutomations()
//       setTrashedAutomations(data)
//     } catch (error) {
//       console.error("[v0] Error fetching trashed automations:", error)
//     }
//   }, [])

//   const handleToggleStatus = useCallback(
//     (automationId: string, isActive: boolean) => {
//       startTransition(async () => {
//         try {
//           const updated = await toggleAutomationStatus(automationId, isActive)
//           setAutomations((prev) => prev.map((a) => (a.id === automationId ? { ...a, isActive: updated.isActive } : a)))
//           router.refresh()
//         } catch (error) {
//           console.error("[v0] Error toggling automation status:", error)
//         }
//       })
//     },
//     [router],
//   )

//   const handleMoveToTrash = useCallback(
//     (automationId: string) => {
//       startTransition(async () => {
//         try {
//           await moveToTrash(automationId)
//           setAutomations((prev) => prev.filter((a) => a.id !== automationId))
//           await fetchTrashedAutomations()
//           router.refresh()
//         } catch (error) {
//           console.error("[v0] Error moving to trash:", error)
//         }
//       })
//     },
//     [router, fetchTrashedAutomations],
//   )

//   const handleRestore = useCallback(
//     (automationId: string) => {
//       startTransition(async () => {
//         try {
//           const restored = await restoreFromTrash(automationId)
//           setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
//           setAutomations((prev) => [restored, ...prev])
//           router.refresh()
//         } catch (error) {
//           console.error("[v0] Error restoring automation:", error)
//         }
//       })
//     },
//     [router],
//   )

//   const handlePermanentlyDelete = useCallback(
//     (automationId: string) => {
//       startTransition(async () => {
//         try {
//           await permanentlyDeleteAutomation(automationId)
//           setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
//           router.refresh()
//         } catch (error) {
//           console.error("[v0] Error permanently deleting automation:", error)
//         }
//       })
//     },
//     [router],
//   )

//   const handleEmptyTrash = useCallback(() => {
//     startTransition(async () => {
//       try {
//         await emptyTrash()
//         setTrashedAutomations([])
//         router.refresh()
//       } catch (error) {
//         console.error("[v0] Error emptying trash:", error)
//       }
//     })
//   }, [router])

//   const handleDuplicate = useCallback(
//     (automationId: string, userId: string) => {
//       startTransition(async () => {
//         try {
//           const duplicated = await duplicateAutomation(automationId, userId)
//           setAutomations((prev) => [duplicated, ...prev])
//           router.refresh()
//         } catch (error) {
//           console.error("[v0] Error duplicating automation:", error)
//         }
//       })
//     },
//     [router],
//   )

//   return {
//     automations,
//     trashedAutomations,
//     isLoading,
//     isPending,
//     fetchAutomations,
//     fetchTrashedAutomations,
//     handleToggleStatus,
//     handleMoveToTrash,
//     handleRestore,
//     handlePermanentlyDelete,
//     handleEmptyTrash,
//     handleDuplicate,
//   }
// }



"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  getAutomations,
  getTrashedAutomations,
  moveToTrash,
  restoreFromTrash,
  permanentlyDeleteAutomation,
  emptyTrash,
  toggleAutomationStatus,
  duplicateAutomation,
} from "@/actions/automation-actions"

export function useAutomations() {
  const [automations, setAutomations] = useState<any[]>([])
  const [trashedAutomations, setTrashedAutomations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const fetchAutomations = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAutomations()
      setAutomations(data)
    } catch (error) {
      console.error("[v0] Error fetching automations:", error)
      setAutomations([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchTrashedAutomations = useCallback(async () => {
    try {
      const data = await getTrashedAutomations()
      setTrashedAutomations(data)
    } catch (error) {
      console.error("[v0] Error fetching trashed automations:", error)
    }
  }, [])

  const handleToggleStatus = useCallback(
    (automationId: string, isActive: boolean) => {
      startTransition(async () => {
        try {
          const updated = await toggleAutomationStatus(automationId, isActive)
          setAutomations((prev) => prev.map((a) => (a.id === automationId ? { ...a, isActive: updated.isActive } : a)))
          router.refresh()
        } catch (error) {
          console.error("[v0] Error toggling automation status:", error)
        }
      })
    },
    [router],
  )

  const handleMoveToTrash = useCallback(
    (automationId: string) => {
      startTransition(async () => {
        try {
          await moveToTrash(automationId)
          setAutomations((prev) => prev.filter((a) => a.id !== automationId))
          await fetchTrashedAutomations()
          router.refresh()
        } catch (error) {
          console.error("[v0] Error moving to trash:", error)
        }
      })
    },
    [router, fetchTrashedAutomations],
  )

  const handleRestore = useCallback(
    (automationId: string) => {
      startTransition(async () => {
        try {
          const restored = await restoreFromTrash(automationId)
          setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
          setAutomations((prev) => [restored, ...prev])
          router.refresh()
        } catch (error) {
          console.error("[v0] Error restoring automation:", error)
        }
      })
    },
    [router],
  )

  const handlePermanentlyDelete = useCallback(
    (automationId: string) => {
      startTransition(async () => {
        try {
          await permanentlyDeleteAutomation(automationId)
          setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
          router.refresh()
        } catch (error) {
          console.error("[v0] Error permanently deleting automation:", error)
        }
      })
    },
    [router],
  )

  const handleEmptyTrash = useCallback(() => {
    startTransition(async () => {
      try {
        await emptyTrash()
        setTrashedAutomations([])
        router.refresh()
      } catch (error) {
        console.error("[v0] Error emptying trash:", error)
      }
    })
  }, [router])

  const handleDuplicate = useCallback(
    (automationId: string) => {
      startTransition(async () => {
        try {
          const duplicated = await duplicateAutomation(automationId)
          setAutomations((prev) => [duplicated, ...prev])
          router.refresh()
        } catch (error) {
          console.error("[v0] Error duplicating automation:", error)
        }
      })
    },
    [router],
  )

  return {
    automations,
    trashedAutomations,
    isLoading,
    isPending,
    fetchAutomations,
    fetchTrashedAutomations,
    handleToggleStatus,
    handleMoveToTrash,
    handleRestore,
    handlePermanentlyDelete,
    handleEmptyTrash,
    handleDuplicate,
  }
}
