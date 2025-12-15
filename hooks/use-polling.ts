"use client"

import { useEffect, useRef, useState } from "react"

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: {
    interval?: number
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {},
) {
  const { interval = 5000, enabled = true, onSuccess, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!enabled) return

    const poll = async () => {
      try {
        setIsLoading(true)
        const result = await fetchFn()
        setData(result)
        setError(null)
        onSuccess?.(result)
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An error occurred")
        setError(error)
        onError?.(error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    poll()

    // Set up polling
    intervalRef.current = setInterval(poll, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, fetchFn])

  return { data, isLoading, error }
}