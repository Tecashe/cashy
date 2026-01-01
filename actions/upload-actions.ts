"use server"

import { put } from "@vercel/blob"
import { auth } from "@clerk/nextjs/server"

export async function uploadFile(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  const blob = await put(`users/${userId}/${Date.now()}-${file.name}`, file, {
    access: "public",
  })

  return { url: blob.url }
}
