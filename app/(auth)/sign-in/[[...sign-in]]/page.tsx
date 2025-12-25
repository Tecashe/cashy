// import { SignIn } from "@clerk/nextjs"

// export default function SignInPage() {
//   return (
//     <div className="flex flex-col items-center gap-6">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//           Welcome to Yazzil
//         </h1>
//         <p className="mt-2 text-slate-600 dark:text-slate-400">Automate your Instagram and create amazing content</p>
//       </div>
//       <SignIn/>
//     </div>
//   )
// }

import { SignIn } from "@clerk/nextjs"

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account
        </p>
      </div>

      {/* SignIn Component */}
      <div className="w-full max-w-sm">
        <SignIn/>
        {/* <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
              card: "bg-card/80 backdrop-blur-sm border border-border shadow-2xl rounded-xl",
              headerTitle: "text-card-foreground",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-card-foreground",
              formFieldInput:
                "bg-background border-2 border-input focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 hover:border-ring/60",
              footerActionLink: "text-muted-foreground hover:text-foreground",
              identityPreviewText: "text-card-foreground",
              identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldWarning: "text-yellow",
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
    </div>
  )
}

export default Page
