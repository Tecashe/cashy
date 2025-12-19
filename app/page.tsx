import { redirect } from "next/navigation"

export default async function HomePage() {
   
    const { auth } = await import("@clerk/nextjs/server")
    const { userId } = await auth()

    if (userId) {
      redirect("/dashboard")
    } else {
      redirect("/sign-in")
    }
  
}
