import { embed } from "ai"
import { prisma } from "./db"

/**
 * Generates vector embeddings for a given text using OpenAI via AI Gateway
 */
export async function generateEmbeddings(text: string) {
  try {
    const { embedding } = await embed({
      model: "openai/text-embedding-3-small",
      value: text.replace(/\n/g, " "),
    })
    return embedding
  } catch (error) {
    console.error("[Vector Search] Embedding generation failed:", error)
    throw error
  }
}

/**
 * Performs a semantic search over knowledge base documents using cosine similarity
 */
export async function searchKnowledgeBase(query: string, userId: string, limit = 4) {
  try {
    const queryEmbedding = await generateEmbeddings(query)
    const vectorString = `[${queryEmbedding.join(",")}]`

    // We use a raw query because Prisma doesn't natively support pgvector operators yet
    // This assumes the 'embedding' column in KnowledgeDocument is of type 'vector(1536)'
    const results = await prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        title, 
        content, 
        type,
        1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM "KnowledgeDocument"
      WHERE "userId" = ${userId}
      AND 1 - (embedding <=> ${vectorString}::vector) > 0.6
      ORDER BY similarity DESC
      LIMIT ${limit}
    `

    return results.map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      type: doc.type,
      similarity: doc.similarity,
    }))
  } catch (error) {
    console.error("[Vector Search] Semantic search failed:", error)
    // Fallback to simple keyword search if vector search fails
    return prisma.knowledgeDocument.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
    })
  }
}
