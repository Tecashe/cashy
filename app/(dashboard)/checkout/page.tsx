"use client"

import { Suspense } from "react"
import { CheckoutContent } from "./checkout-content"

function LoadingFallback() {
  return null
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
