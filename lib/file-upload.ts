// import { put } from "@vercel/blob"

// /**
//  * Uploads a single file to Vercel Blob with production-ready organization
//  */
// export async function uploadFile(file: File) {
//   try {
//     // Generate a unique path for the file
//     const path = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

//     const blob = await put(path, file, {
//       access: "public",
//     })

//     console.log("[FileUpload] Successfully uploaded to Vercel Blob:", blob.url)
//     return blob.url
//   } catch (error) {
//     console.error("[FileUpload] Error uploading to Vercel Blob:", error)
//     throw error
//   }
// }

// /**
//  * Uploads multiple files in parallel
//  */
// export async function uploadMultipleFiles(files: File[]) {
//   return Promise.all(files.map(uploadFile))
// }

// export function validateImage(file: File) {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
//   return allowedTypes.includes(file.type)
// }

// export function validateDocument(file: File) {
//   const allowedTypes = ["application/pdf", "text/plain", "text/csv", "application/json"]
//   return allowedTypes.includes(file.type)
// }
/**
 * Uploads a single file to Vercel Blob via our internal API route
 */



// export async function uploadFile(file: File) {
//   try {
//     const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

//     const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
//       method: "POST",
//       body: file,
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.message || "Upload failed")
//     }

//     const blob = await response.json()
//     console.log("[FileUpload] Successfully uploaded via API:", blob.url)
//     return blob.url
//   } catch (error) {
//     console.error("[FileUpload] Error uploading file:", error)
//     throw error
//   }
// }

// /**
//  * Uploads multiple files in parallel
//  */
// export async function uploadMultipleFiles(files: File[]) {
//   return Promise.all(files.map(uploadFile))
// }

// export function validateImage(file: File) {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
//   return allowedTypes.includes(file.type)
// }

// export function validateDocument(file: File) {
//   const allowedTypes = ["application/pdf", "text/plain", "text/csv", "application/json"]
//   return allowedTypes.includes(file.type)
// }

/**
 * Uploads a single file to Vercel Blob via our internal API route
 */
export async function uploadFile(file: File) {
  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: "POST",
      body: file,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Upload failed")
    }

    const blob = await response.json()
    console.log("[FileUpload] Successfully uploaded via API:", blob.url)
    return blob.url
  } catch (error) {
    console.error("[FileUpload] Error uploading file:", error)
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
  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
    "application/octet-stream",
    "text/markdown",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  // Also check extension as a fallback
  const extension = file.name.split(".").pop()?.toLowerCase()
  const allowedExtensions = ["pdf", "txt", "csv", "json", "md", "doc", "docx"]

  return allowedTypes.includes(file.type) || (extension && allowedExtensions.includes(extension))
}
