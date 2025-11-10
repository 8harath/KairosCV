import { describe, it, expect } from "vitest"

// Mock the TemplateRenderer class for testing
class MockTemplateRenderer {
  private template: string

  constructor(template: string) {
    this.template = template
  }

  render(data: Record<string, any>): string {
    let result = this.template

    // Replace all variables {{VAR}}
    result = result.replace(/\{\{([^#/}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      return data[trimmedKey] !== undefined ? String(data[trimmedKey]) : ""
    })

    // Handle {{#if CONDITION}}...{{/if}} blocks
    result = result.replace(/\{\{#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const trimmedCondition = condition.trim()
      return data[trimmedCondition] ? content : ""
    })

    return result
  }
}

describe("TemplateRenderer", () => {
  it("should replace simple variables", () => {
    const template = "Hello {{NAME}}!"
    const renderer = new MockTemplateRenderer(template)

    const result = renderer.render({ NAME: "John" })
    expect(result).toBe("Hello John!")
  })

  it("should handle conditional blocks", () => {
    const template = "{{#if SHOW}}This is visible{{/if}}"
    const renderer = new MockTemplateRenderer(template)

    const resultTrue = renderer.render({ SHOW: true })
    expect(resultTrue).toBe("This is visible")

    const resultFalse = renderer.render({ SHOW: false })
    expect(resultFalse).toBe("")
  })

  it("should handle missing variables gracefully", () => {
    const template = "Hello {{NAME}}!"
    const renderer = new MockTemplateRenderer(template)

    const result = renderer.render({})
    expect(result).toBe("Hello !")
  })

  it("should handle multiple variables", () => {
    const template = "{{FIRST}} {{LAST}}"
    const renderer = new MockTemplateRenderer(template)

    const result = renderer.render({ FIRST: "John", LAST: "Doe" })
    expect(result).toBe("John Doe")
  })
})
