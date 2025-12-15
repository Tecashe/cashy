import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Join InstaFlow
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Start automating your Instagram today</p>
      </div>
      <SignUp/>
    </div>
  )
}
