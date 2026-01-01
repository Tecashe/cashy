import { put } from "@vercel/blob"

/**
 * Uploads a single file to Vercel Blob with production-ready organization
 */
export async function uploadFile(file: File) {
  try {
    // Generate a unique path for the file
    const path = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    const blob = await put(path, file, {
      access: "public",
    })

    console.log("[FileUpload] Successfully uploaded to Vercel Blob:", blob.url)
    return blob.url
  } catch (error) {
    console.error("[FileUpload] Error uploading to Vercel Blob:", error)
    throw error
  }
}

/**
 * Uploads multiple files in parallel
 */
export async function uploadMultipleFiles(files: File[]) {
  return Promise.all(files.map(uploadFile))
}

export function validateImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  return allowedTypes.includes(file.type)
}

export function validateDocument(file: File) {
  const allowedTypes = ["application/pdf", "text/plain", "text/csv", "application/json"]
  return allowedTypes.includes(file.type)
}
