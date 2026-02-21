// node scripts/check-db.mjs
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const count = await prisma.salesUploadItem.count()
const agg = await prisma.salesUploadItem.aggregate({ _sum: { amount: true } })
const uploads = await prisma.salesUpload.findMany({ include: { _count: { select: { items: true } } } })
console.log("Total items:", count)
console.log("Total USD:", agg._sum.amount?.toFixed(2))
uploads.forEach(u => console.log("Upload:", u.id.slice(0, 20), "|", u.fileName, "|", "items:", u._count.items))
await prisma.$disconnect()
