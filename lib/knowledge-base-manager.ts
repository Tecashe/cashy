export interface KnowledgeBase {
  id: string
  userId: string
  name: string
  description?: string
  businessInfo: string
  faqs: Array<{
    question: string
    answer: string
  }>
  productInfo?: string
  policyInfo?: string
  aiInstructions: string
  responseStyle: {
    tone: string
    maxLength: number
    useEmojis: boolean
    includeLinks: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export class KnowledgeBaseManager {
  static formatKnowledgeBaseForAI(kb: KnowledgeBase): string {
    let formatted = `# Business Information\n${kb.businessInfo}\n\n`

    if (kb.productInfo) {
      formatted += `# Products & Services\n${kb.productInfo}\n\n`
    }

    if (kb.policyInfo) {
      formatted += `# Policies & Terms\n${kb.policyInfo}\n\n`
    }

    if (kb.faqs.length > 0) {
      formatted += `# Frequently Asked Questions\n\n`
      kb.faqs.forEach((faq, index) => {
        formatted += `Q${index + 1}: ${faq.question}\nA${index + 1}: ${faq.answer}\n\n`
      })
    }

    formatted += `# Response Guidelines\n${kb.aiInstructions}\n`
    formatted += `Tone: ${kb.responseStyle.tone}\n`
    formatted += `Max Length: ${kb.responseStyle.maxLength} characters\n`
    formatted += `Use Emojis: ${kb.responseStyle.useEmojis ? "Yes" : "No"}\n`
    formatted += `Include Links: ${kb.responseStyle.includeLinks ? "Yes" : "No"}\n`

    return formatted
  }

  static searchKnowledgeBase(kb: KnowledgeBase, query: string): string[] {
    const results: string[] = []
    const lowerQuery = query.toLowerCase()

    // Search FAQs
    kb.faqs.forEach((faq) => {
      if (faq.question.toLowerCase().includes(lowerQuery)) {
        results.push(`Q: ${faq.question}\nA: ${faq.answer}`)
      }
    })

    // Search product info
    if (kb.productInfo && kb.productInfo.toLowerCase().includes(lowerQuery)) {
      results.push(`Product Info: ${kb.productInfo}`)
    }

    return results
  }

  static validateKnowledgeBase(kb: Partial<KnowledgeBase>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!kb.name || kb.name.trim().length === 0) {
      errors.push("Name is required")
    }

    if (!kb.businessInfo || kb.businessInfo.trim().length === 0) {
      errors.push("Business information is required")
    }

    if (kb.businessInfo && kb.businessInfo.length > 10000) {
      errors.push("Business information is too long (max 10,000 characters)")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
