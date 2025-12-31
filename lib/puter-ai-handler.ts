"use server"

// Puter.js integration for free AI responses (testing only)
// Note: This is a CLIENT-SIDE library, so we'll create a server action that uses fetch

interface PuterAIResponse {
  success: boolean
  response: string
  error?: string
}

export async function callPuterAI(message: string, systemPrompt?: string): Promise<PuterAIResponse> {
  try {
    // Puter.js doesn't have a server-side API, so we'll use a simple OpenAI-compatible endpoint
    // For now, return a fallback message that explains setup is needed
    return {
      success: true,
      response: `I received your message: "${message}". However, I need an AI API key to provide intelligent responses. Please configure either Anthropic Claude or DeepSeek in the Integrations tab to enable full AI functionality.`,
    }
  } catch (error) {
    return {
      success: false,
      response: "",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
