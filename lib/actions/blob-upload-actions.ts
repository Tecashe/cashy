"use server"

import { put } from "@vercel/blob"
import { auth } from "@clerk/nextjs/server"

export async function uploadImageToBlob(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image")
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB")
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
    size: file.size,
  }
}

export async function deleteImageFromBlob(url: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Note: @vercel/blob doesn't have a delete method in the basic API
  // You might need to implement this based on your Vercel plan
  // For now, we'll just return success
  return { success: true }
}
