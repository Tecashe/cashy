import { redirect } from "next/navigation"

export default async function HomePage() {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (hasClerkKeys) {
    const { auth } = await import("@clerk/nextjs/server")
    const { userId } = await auth()

    if (userId) {
      redirect("/dashboard")
    } else {
      redirect("/sign-in")
    }
  } else {
    // Mock auth for development - redirect directly to dashboard
    redirect("/dashboard")
  }
}
