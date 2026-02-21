// Run: node scripts/cleanup-duplicate-seed.mjs
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    // Find all uploads
    const uploads = await prisma.salesUpload.findMany({
        include: { _count: { select: { items: true } } },
        orderBy: { uploadedAt: "asc" },
    })

    console.log("Current uploads:")
    uploads.forEach((u) =>
        console.log(`  id=${u.id} | file=${u.fileName} | source=${u.source} | rows=${u._count.items} | date=${u.uploadedAt.toISOString()}`)
    )

    // Keep the SQL-seeded one (upload_enterprise_001), delete the rest that are mpesa csv imports
    const toDelete = uploads.filter((u) => u.id !== "upload_enterprise_001" && u.fileName === "yazzil_enterprise.csv")

    if (toDelete.length === 0) {
        console.log("\n✅ No duplicates found!")
    } else {
        for (const u of toDelete) {
            console.log(`\nDeleting duplicate upload: ${u.id} (${u._count.items} items)`)
            await prisma.salesUploadItem.deleteMany({ where: { uploadId: u.id } })
            await prisma.salesUpload.delete({ where: { id: u.id } })
        }
        console.log(`\n✅ Removed ${toDelete.length} duplicate upload(s)`)
    }

    // Final count
    const total = await prisma.salesUploadItem.aggregate({ _sum: { amount: true } })
    const count = await prisma.salesUploadItem.count()
    console.log(`\nFinal state: ${count} items | Total: $${(total._sum.amount || 0).toFixed(2)}`)

    await prisma.$disconnect()
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
