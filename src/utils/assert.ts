type Assert = (condition: unknown, message?: string) => asserts condition

export const assert: Assert = (condition: unknown, message?: string): asserts condition => {
  if (!condition) throw new Error(message)
}
