interface VariableContext {
  name?: string
  username?: string
  firstName?: string
  lastName?: string
  businessName?: string
  customVariables?: Record<string, string>
}

export function replaceVariables(message: string, context: VariableContext): string {
  let result = message

  // Standard variables
  if (context.name) {
    result = result.replace(/\{name\}/gi, context.name)
  }

  if (context.username) {
    result = result.replace(/\{username\}/gi, context.username)
  }

  if (context.firstName) {
    result = result.replace(/\{first_?name\}/gi, context.firstName)
  }

  if (context.lastName) {
    result = result.replace(/\{last_?name\}/gi, context.lastName)
  }

  if (context.businessName) {
    result = result.replace(/\{business_?name\}/gi, context.businessName)
  }

  // Custom variables
  if (context.customVariables) {
    for (const [key, value] of Object.entries(context.customVariables)) {
      const regex = new RegExp(`\\{${key}\\}`, "gi")
      result = result.replace(regex, value)
    }
  }

  return result
}

export function extractVariables(message: string): string[] {
  const regex = /\{([^}]+)\}/g
  const matches = []
  let match

  while ((match = regex.exec(message)) !== null) {
    matches.push(match[1])
  }

  return Array.from(new Set(matches))
}
