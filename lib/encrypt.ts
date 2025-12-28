

// ============================================
// Encryption utility: lib/encryption.ts
// ============================================

import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex")
const ALGORITHM = "aes-256-gcm"

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv)
  
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  
  const authTag = cipher.getAuthTag()
  
  return JSON.stringify({
    iv: iv.toString("hex"),
    data: encrypted,
    tag: authTag.toString("hex"),
  })
}

export function decrypt(encryptedData: string): string {
  const { iv, data, tag } = JSON.parse(encryptedData)
  
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "hex")
  )
  
  decipher.setAuthTag(Buffer.from(tag, "hex"))
  
  let decrypted = decipher.update(data, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}