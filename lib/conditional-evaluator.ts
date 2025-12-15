interface Condition {
  field: string
  operator: "equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "exists"
  value: any
}

interface BranchConfig {
  conditions: Condition[]
  logic: "AND" | "OR"
}

interface EvaluationContext {
  messageContent?: string
  participantName?: string
  participantUsername?: string
  tags?: string[]
  messageCount?: number
  [key: string]: any
}

export function evaluateCondition(condition: Condition, context: EvaluationContext): boolean {
  const fieldValue = context[condition.field]

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value

    case "contains":
      if (typeof fieldValue !== "string") return false
      return fieldValue.toLowerCase().includes(String(condition.value).toLowerCase())

    case "starts_with":
      if (typeof fieldValue !== "string") return false
      return fieldValue.toLowerCase().startsWith(String(condition.value).toLowerCase())

    case "ends_with":
      if (typeof fieldValue !== "string") return false
      return fieldValue.toLowerCase().endsWith(String(condition.value).toLowerCase())

    case "greater_than":
      return Number(fieldValue) > Number(condition.value)

    case "less_than":
      return Number(fieldValue) < Number(condition.value)

    case "exists":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== ""

    default:
      return false
  }
}

export function evaluateBranch(branch: BranchConfig, context: EvaluationContext): boolean {
  if (branch.conditions.length === 0) return true

  const results = branch.conditions.map((condition) => evaluateCondition(condition, context))

  if (branch.logic === "AND") {
    return results.every((result) => result)
  } else {
    return results.some((result) => result)
  }
}
