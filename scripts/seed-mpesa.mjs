// Simple Node.js seed script - run with: node scripts/seed-mpesa.mjs
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Inline prisma client
const { PrismaClient } = await import("@prisma/client")
const prisma = new PrismaClient()

const csvPath = join(__dirname, "yazzil_enterprise.csv")
const text = readFileSync(csvPath, "utf-8")
const lines = text.split("\n").filter((l) => l.trim())
const rows = lines.slice(1).map((line) => {
    const [date, amount, product, customer, description, currency, quantity] = line.split(",")
    return { date: date?.trim(), amount: amount?.trim(), product: product?.trim(), customer: customer?.trim(), description: description?.trim(), currency: currency?.trim() || "USD", quantity: quantity?.trim() || "1" }
}).filter((r) => r.date && r.amount && !isNaN(parseFloat(r.amount)))

console.log(`Seeding ${rows.length} rows...`)

// Check if already seeded
const existing = await prisma.salesUpload.findFirst({ where: { fileName: "yazzil_enterprise.csv", source: "mpesa" } })
if (existing) {
    console.log("Already seeded! Delete the existing upload first if you want to re-seed.")
    await prisma.$disconnect()
    process.exit(0)
}

const upload = await prisma.salesUpload.create({
    data: {
        fileName: "yazzil_enterprise.csv",
        status: "processed",
        rowCount: rows.length,
        source: "mpesa",
    },
})

let inserted = 0
for (const row of rows) {
    const parts = row.date.split("/")
    const date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]))
    await prisma.salesUploadItem.create({
        data: {
            uploadId: upload.id,
            date,
            amount: parseFloat(row.amount),
            product: row.product,
            customer: row.customer,
            description: row.description,
            currency: row.currency,
            quantity: parseInt(row.quantity) || 1,
            paymentMethod: "mpesa",
        },
    })
    inserted++
}

console.log(`✅ Seeded ${inserted} M-Pesa enterprise sales records!`)
await prisma.$disconnect()
