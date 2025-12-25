// import { SignUp } from "@clerk/nextjs"

// export default function SignUpPage() {
//   return (
//     <div className="flex flex-col items-center gap-6">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//           Join Yazzil
//         </h1>
//         <p className="mt-2 text-slate-600 dark:text-slate-400">Start automating your Instagram today</p>
//       </div>
//       <SignUp/>
//     </div>
//   )
// }

import { SignUp } from "@clerk/nextjs"
import Link from "next/link"


type SignUpProps = {}

const Page = (props: SignUpProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Get Started
        </h1>
        <p className="text-muted-foreground text-sm">
          Create your account to get started
        </p>
      </div>

      {/* SignUp Component */}
      <div className="w-full max-w-sm mb-6">
        <SignUp/>
        {/* <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
              card: "bg-card/80 backdrop-blur-sm border border-border shadow-2xl rounded-xl",
              headerTitle: "text-card-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-card-foreground font-medium",
              formFieldInput:
                "bg-background border-2 border-input focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 hover:border-ring/60",
              footerActionLink: "text-muted-foreground hover:text-foreground",
              identityPreviewText: "text-card-foreground",
              identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldError: "text-red",
              socialButtonsBlockButton:
                "border-2 border-input hover:border-ring bg-background hover:bg-accent transition-all duration-200",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonArrow: "text-muted-foreground",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              showOptionalFields: false,
            },
          }}
        /> */}
      </div>

      {/* Terms and Privacy */}
      <div className="w-full max-w-sm">
        <div className="text-center px-4 py-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-foreground hover:text-foreground/80 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-foreground hover:text-foreground/80 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page