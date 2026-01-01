// import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
// import { NextResponse } from "next/server"

// export async function POST(request: Request): Promise<NextResponse> {
//   const body = (await request.json()) as HandleUploadBody

//   try {
//     const jsonResponse = await handleUpload({
//       body,
//       request,
//       onBeforeGenerateToken: async () => {
//         return {
//           allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
//           maximumSizeInBytes: 8 * 1024 * 1024, // 8MB
//         }
//       },
//       onUploadCompleted: async () => {},
//     })

//     return NextResponse.json(jsonResponse)
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 400 })
//   }
// }
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ message: "Missing filename" }, { status: 400 })
  }

  if (!request.body) {
    return NextResponse.json({ message: "Missing request body" }, { status: 400 })
  }

  try {
    const blob = await put(filename, request.body, {
      access: "public",
      contentType: request.headers.get("content-type") || "application/octet-stream",
    })

    return NextResponse.json(blob)
  } catch (error: any) {
    console.error("[API Upload] Vercel Blob error:", error)
    return NextResponse.json(
      {
        message: "Upload failed. Ensure Vercel Blob is connected in the 'Connect' section.",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
