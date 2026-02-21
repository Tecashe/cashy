// Re-seed exactly the CSV data, total must be $7,250.00
// node scripts/reseed-mpesa.mjs
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Exact rows from yazzil_enterprise.csv (91 rows, total = $7,250.00)
const rows = [
    // Apex Digital Ltd - 13 payments
    { date: "2025-01-06", amount: 119.16, customer: "Apex Digital Ltd" },
    { date: "2025-02-01", amount: 127.87, customer: "Apex Digital Ltd" },
    { date: "2025-03-04", amount: 117.87, customer: "Apex Digital Ltd" },
    { date: "2025-04-12", amount: 131.35, customer: "Apex Digital Ltd" },
    { date: "2025-05-02", amount: 144.86, customer: "Apex Digital Ltd" },
    { date: "2025-06-13", amount: 140.02, customer: "Apex Digital Ltd" },
    { date: "2025-07-12", amount: 150.42, customer: "Apex Digital Ltd" },
    { date: "2025-08-07", amount: 148.67, customer: "Apex Digital Ltd" },
    { date: "2025-09-07", amount: 117.97, customer: "Apex Digital Ltd" },
    { date: "2025-10-09", amount: 126.14, customer: "Apex Digital Ltd" },
    { date: "2025-11-05", amount: 143.20, customer: "Apex Digital Ltd" },
    { date: "2025-12-13", amount: 152.21, customer: "Apex Digital Ltd" },
    { date: "2026-01-14", amount: 117.10, customer: "Apex Digital Ltd" },
    // Bluewave Solutions - 13 payments
    { date: "2025-01-02", amount: 87.53, customer: "Bluewave Solutions" },
    { date: "2025-02-14", amount: 70.13, customer: "Bluewave Solutions" },
    { date: "2025-03-04", amount: 70.68, customer: "Bluewave Solutions" },
    { date: "2025-04-08", amount: 73.89, customer: "Bluewave Solutions" },
    { date: "2025-05-14", amount: 76.24, customer: "Bluewave Solutions" },
    { date: "2025-06-01", amount: 109.07, customer: "Bluewave Solutions" },
    { date: "2025-07-12", amount: 94.82, customer: "Bluewave Solutions" },
    { date: "2025-08-03", amount: 107.55, customer: "Bluewave Solutions" },
    { date: "2025-09-03", amount: 112.40, customer: "Bluewave Solutions" },
    { date: "2025-10-10", amount: 108.42, customer: "Bluewave Solutions" },
    { date: "2025-11-08", amount: 86.81, customer: "Bluewave Solutions" },
    { date: "2025-12-07", amount: 120.16, customer: "Bluewave Solutions" },
    { date: "2026-01-02", amount: 93.77, customer: "Bluewave Solutions" },
    // Kestrel Media - 13 payments
    { date: "2025-01-09", amount: 56.26, customer: "Kestrel Media" },
    { date: "2025-02-14", amount: 56.97, customer: "Kestrel Media" },
    { date: "2025-03-15", amount: 74.99, customer: "Kestrel Media" },
    { date: "2025-04-15", amount: 81.09, customer: "Kestrel Media" },
    { date: "2025-05-07", amount: 82.41, customer: "Kestrel Media" },
    { date: "2025-06-11", amount: 63.25, customer: "Kestrel Media" },
    { date: "2025-07-03", amount: 82.64, customer: "Kestrel Media" },
    { date: "2025-08-13", amount: 87.28, customer: "Kestrel Media" },
    { date: "2025-09-04", amount: 73.27, customer: "Kestrel Media" },
    { date: "2025-10-09", amount: 80.05, customer: "Kestrel Media" },
    { date: "2025-11-01", amount: 71.23, customer: "Kestrel Media" },
    { date: "2025-12-15", amount: 79.05, customer: "Kestrel Media" },
    { date: "2026-01-06", amount: 76.05, customer: "Kestrel Media" },
    // Mara Consulting - 13 payments
    { date: "2025-01-11", amount: 31.29, customer: "Mara Consulting" },
    { date: "2025-02-02", amount: 38.48, customer: "Mara Consulting" },
    { date: "2025-03-02", amount: 46.29, customer: "Mara Consulting" },
    { date: "2025-04-05", amount: 59.50, customer: "Mara Consulting" },
    { date: "2025-05-04", amount: 49.49, customer: "Mara Consulting" },
    { date: "2025-06-07", amount: 57.15, customer: "Mara Consulting" },
    { date: "2025-07-08", amount: 38.04, customer: "Mara Consulting" },
    { date: "2025-08-02", amount: 38.77, customer: "Mara Consulting" },
    { date: "2025-09-03", amount: 43.88, customer: "Mara Consulting" },
    { date: "2025-10-08", amount: 64.42, customer: "Mara Consulting" },
    { date: "2025-11-15", amount: 43.90, customer: "Mara Consulting" },
    { date: "2025-12-07", amount: 64.55, customer: "Mara Consulting" },
    { date: "2026-01-06", amount: 50.27, customer: "Mara Consulting" },
    // Nouri & Co - 13 payments
    { date: "2025-01-04", amount: 76.53, customer: "Nouri & Co" },
    { date: "2025-02-08", amount: 105.91, customer: "Nouri & Co" },
    { date: "2025-03-02", amount: 87.02, customer: "Nouri & Co" },
    { date: "2025-04-02", amount: 94.07, customer: "Nouri & Co" },
    { date: "2025-05-09", amount: 99.12, customer: "Nouri & Co" },
    { date: "2025-06-01", amount: 119.38, customer: "Nouri & Co" },
    { date: "2025-07-11", amount: 109.56, customer: "Nouri & Co" },
    { date: "2025-08-01", amount: 114.93, customer: "Nouri & Co" },
    { date: "2025-09-02", amount: 132.12, customer: "Nouri & Co" },
    { date: "2025-10-10", amount: 126.46, customer: "Nouri & Co" },
    { date: "2025-11-04", amount: 116.60, customer: "Nouri & Co" },
    { date: "2025-12-02", amount: 117.62, customer: "Nouri & Co" },
    { date: "2026-01-14", amount: 82.75, customer: "Nouri & Co" },
    // Thornfield Inc - 14 payments
    { date: "2025-01-04", amount: 63.24, customer: "Thornfield Inc" },
    { date: "2025-02-06", amount: 51.42, customer: "Thornfield Inc" },
    { date: "2025-03-12", amount: 55.04, customer: "Thornfield Inc" },
    { date: "2025-04-09", amount: 65.23, customer: "Thornfield Inc" },
    { date: "2025-05-10", amount: 66.92, customer: "Thornfield Inc" },
    { date: "2025-06-06", amount: 51.44, customer: "Thornfield Inc" },
    { date: "2025-07-02", amount: 58.95, customer: "Thornfield Inc" },
    { date: "2025-08-12", amount: 74.92, customer: "Thornfield Inc" },
    { date: "2025-09-02", amount: 72.90, customer: "Thornfield Inc" },
    { date: "2025-10-14", amount: 61.86, customer: "Thornfield Inc" },
    { date: "2025-11-01", amount: 74.44, customer: "Thornfield Inc" },
    { date: "2025-12-12", amount: 69.65, customer: "Thornfield Inc" },
    { date: "2026-01-04", amount: 49.02, customer: "Thornfield Inc" },
    // Zuri Retail Group - 13 payments
    { date: "2025-01-01", amount: 36.19, customer: "Zuri Retail Group" },
    { date: "2025-02-05", amount: 35.91, customer: "Zuri Retail Group" },
    { date: "2025-03-12", amount: 43.33, customer: "Zuri Retail Group" },
    { date: "2025-04-13", amount: 36.50, customer: "Zuri Retail Group" },
    { date: "2025-05-07", amount: 40.67, customer: "Zuri Retail Group" },
    { date: "2025-06-09", amount: 32.62, customer: "Zuri Retail Group" },
    { date: "2025-07-15", amount: 49.57, customer: "Zuri Retail Group" },
    { date: "2025-08-08", amount: 45.31, customer: "Zuri Retail Group" },
    { date: "2025-09-14", amount: 33.09, customer: "Zuri Retail Group" },
    { date: "2025-10-05", amount: 45.97, customer: "Zuri Retail Group" },
    { date: "2025-11-04", amount: 36.37, customer: "Zuri Retail Group" },
    { date: "2025-12-14", amount: 38.87, customer: "Zuri Retail Group" },
    { date: "2026-01-11", amount: 39.62, customer: "Zuri Retail Group" },
]

const csvTotal = rows.reduce((s, r) => s + r.amount, 0)
console.log(`Rows: ${rows.length}, Expected total: $${csvTotal.toFixed(2)}`)

// Clear everything first
await prisma.salesUploadItem.deleteMany({})
await prisma.salesUpload.deleteMany({})
console.log("Cleared existing data")

// Create upload batch
const upload = await prisma.salesUpload.create({
    data: {
        id: "upload_enterprise_001",
        fileName: "yazzil_enterprise.csv",
        status: "processed",
        rowCount: rows.length,
        source: "mpesa",
    },
})

// Insert all rows
for (const row of rows) {
    const [y, m, d] = row.date.split("-")
    await prisma.salesUploadItem.create({
        data: {
            uploadId: upload.id,
            date: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
            amount: row.amount,
            product: "Enterprise Plan",
            customer: row.customer,
            description: "Enterprise plan — monthly retainer",
            currency: "USD",
            quantity: 1,
            paymentMethod: "mpesa",
        },
    })
}

const final = await prisma.salesUploadItem.aggregate({ _sum: { amount: true } })
console.log(`✅ Seeded ${rows.length} rows. DB total: $${(final._sum.amount || 0).toFixed(2)}`)
await prisma.$disconnect()
