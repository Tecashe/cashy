// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

// // Check if Clerk is configured
// const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// export default hasClerkKeys
//   ? clerkMiddleware(async (auth, request) => {
//       if (!isPublicRoute(request)) {
//         await auth.protect()
//       }
//     })
//   : function middleware(request: NextRequest) {
//       // Allow all routes when Clerk is not configured (development mode)
//       return NextResponse.next()
//     }

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// }


// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)", 
//   "/sign-up(.*)",
//   "/",  // Add homepage if you want it public
// ])

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect()
//   }
// })

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// }
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", 
  "/sign-up(.*)",
  "/",
  "/api(.*)",  // Add this
  "/privacy",           // Add this for your privacy policy issue
  "/terms",         // Add this if you have one
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}