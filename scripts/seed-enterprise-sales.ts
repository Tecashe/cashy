// scripts/seed-enterprise-sales.ts
// Run with: npx ts-node --project tsconfig.json -e "require('./scripts/seed-enterprise-sales.ts')"
// Or: npx tsx scripts/seed-enterprise-sales.ts

import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

interface CSVRow {
    date: string
    amount: string
    product: string
    customer: string
    description: string
    currency: string
    quantity: string
}

function parseCSV(text: string): CSVRow[] {
    const lines = text.split("\n").filter((l) => l.trim())
    const headers = lines[0].split(",")
    return lines.slice(1).map((line) => {
        const values = line.split(",")
        return headers.reduce((obj, h, i) => {
            obj[h.trim()] = values[i]?.trim() || ""
            return obj
        }, {} as Record<string, string>) as CSVRow
    })
}

async function main() {
    const csvPath = path.join(__dirname, "yazzil_enterprise.csv")
    const text = fs.readFileSync(csvPath, "utf-8")
    const rows = parseCSV(text).filter((r) => r.date && r.amount)

    console.log(`Found ${rows.length} rows to seed`)

    // Check if already seeded
    const existing = await prisma.salesUploadItem.count()
    console.log(`Existing SalesUploadItems: ${existing}`)

    // Create a SalesUpload record for this import
    const upload = await prisma.salesUpload.create({
        data: {
            fileName: "yazzil_enterprise.csv",
            status: "processed",
            rowCount: rows.length,
            source: "mpesa",
        },
    })

    console.log(`Created upload record: ${upload.id}`)

    // Insert all rows
    let inserted = 0
    for (const row of rows) {
        const [month, day, year] = row.date.split("/")
        const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
        )

        await prisma.salesUploadItem.create({
            data: {
                uploadId: upload.id,
                date,
                amount: parseFloat(row.amount),
                product: row.product,
                customer: row.customer,
                description: row.description,
                currency: row.currency || "USD",
                quantity: parseInt(row.quantity) || 1,
                paymentMethod: "mpesa",
            },
        })
        inserted++
    }

    console.log(`✅ Seeded ${inserted} sales records!`)
    await prisma.$disconnect()
}

main().catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
})
