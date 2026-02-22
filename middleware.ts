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



// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from 'next/server'

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)", 
//   "/sign-up(.*)",
//   "/",
//   "/api(.*)",  // Add this
//   "/privacy", // Add this for your privacy policy issue
//   "/terms",  // Add this if you have one
// ])

// const isOnboardingRoute = createRouteMatcher(['/onboarding'])

// export default clerkMiddleware(async (auth, request) => {
//   const { userId } = await auth()

//   // Allow public routes
//   if (isPublicRoute(request)) {
//     return NextResponse.next()
//   }

//   // Require auth for protected routes
//   if (!userId && !isPublicRoute(request)) {
//     const signInUrl = new URL('/sign-in', request.url)
//     signInUrl.searchParams.set('redirect_url', request.url)
//     return NextResponse.redirect(signInUrl)
//   }

//   // Check onboarding status for authenticated users
//   if (userId && !isOnboardingRoute(request)) {
//     try {
//       // Check if user has completed onboarding
//       const response = await fetch(new URL('/api/onboarding', request.url), {
//         headers: {
//           'Authorization': request.headers.get('authorization') || '',
//         },
//       })

//       if (response.ok) {
//         const { isOnboarded } = await response.json()

//         // Redirect to onboarding if not completed
//         if (!isOnboarded && !request.nextUrl.pathname.startsWith('/onboarding')) {
//           return NextResponse.redirect(new URL('/onboarding', request.url))
//         }

//         // Redirect from onboarding if already completed
//         if (isOnboarded && request.nextUrl.pathname.startsWith('/onboarding')) {
//           return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//       }
//     } catch (error) {
//       console.error('Onboarding check failed:', error)
//       // Continue to route on error
//     }
//   }

//   return NextResponse.next()
// })

// // export default clerkMiddleware(async (auth, request) => {
// //   if (!isPublicRoute(request)) {
// //     await auth.protect()
// //   }
// // })

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// }





import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhook(.*)", // Webhooks are public (they use signature verification)
  "/api/pesapal/ipn(.*)", // Pesapal IPN notifications
  "/api/pesapal/callback(.*)", // Pesapal payment callbacks
  "/privacy",
  "/terms",
  "/onboarding(.*)", // Onboarding should be accessible
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Require auth for protected routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}