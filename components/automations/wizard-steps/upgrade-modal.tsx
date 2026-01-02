import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Check, ArrowRight, Sparkles, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaymentModal } from '@/components/billing/payment-modal'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  featureName: string
  requiredTier: 'free'|'pro' | 'enterprise'
  benefits?: string[]
}

export function UpgradeModal({ 
  open, 
  onClose, 
  featureName, 
  requiredTier,
  benefits = [
    'Unlimited automations',
    'Advanced action types',
    'Priority support',
    'Custom integrations'
  ]
}: UpgradeModalProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: requiredTier }),
      })

      if (!response.ok) throw new Error("Failed to create payment intent")

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setShowPayment(true)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      alert("Failed to initiate payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!clientSecret) return

    try {
      const intentId = clientSecret.split("_secret_")[0]

      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentId,
          tier: requiredTier,
          saveCard: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to confirm payment")

      setShowPayment(false)
      onClose()
      
      // Refresh to show new features
      window.location.reload()
    } catch (error) {
      console.error("Error confirming payment:", error)
      alert("Payment successful but failed to update subscription. Please contact support.")
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && !showPayment && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 shadow-2xl border border-border/50"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50" />
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-30"
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="relative p-8 pb-6">
                  {/* Icon header */}
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        delay: 0.2,
                        duration: 0.8 
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/25">
                        <Lock className="h-10 w-10 text-primary-foreground" />
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 rounded-full border-2 border-primary"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Title and description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 text-center"
                  >
                    <h2 className="mb-2 text-2xl font-bold tracking-tight">
                      Unlock {featureName}
                    </h2>
                    <p className="text-muted-foreground">
                      Upgrade to <span className="font-semibold text-primary capitalize">{requiredTier}</span> to access this powerful feature
                    </p>
                  </motion.div>

                  {/* Benefits list */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 space-y-3"
                  >
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 rounded-lg bg-card/50 p-3 backdrop-blur-sm border border-border/50"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col gap-3"
                  >
                    <Button
                      onClick={handleUpgrade}
                      disabled={isLoading}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="group relative w-full overflow-hidden bg-gradient-to-r from-primary to-primary/80 py-6 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                    >
                      <motion.div
                        animate={{
                          x: isHovered ? [0, 300] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      {isLoading ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Upgrade to {requiredTier}
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Maybe Later
                    </Button>
                  </motion.div>

                  {/* Trust badge */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 text-center text-xs text-muted-foreground"
                  >
                    <Zap className="inline h-3 w-3 text-primary" /> Cancel anytime · 14-day money-back guarantee
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        tier={requiredTier}
        clientSecret={clientSecret}
        isLoading={isLoading}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}

// Example usage component
export default function UpgradeModalDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Upgrade Modal Demo</h1>
        <p className="text-muted-foreground">Click the button below to see the modal</p>
        <Button onClick={() => setIsOpen(true)} size="lg">
          Open Upgrade Modal
        </Button>
      </div>

      <UpgradeModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        featureName="Send SMS Action"
        requiredTier="pro"
        benefits={[
          'Send SMS to leads automatically',
          'Unlimited automations',
          'Advanced action types',
          'Priority support'
        ]}
      />
    </div>
  )
}