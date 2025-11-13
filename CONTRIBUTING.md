# Contributing to KairosCV

Thank you for your interest in contributing to KairosCV! This document provides guidelines and conventions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what's best for the community
- Show empathy toward others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.17.0
- pnpm ≥ 8.0.0
- Git
- Google Gemini API key (for testing AI features)

### First-Time Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KairosCV.git
   cd KairosCV
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/KairosCV.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

6. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 💻 Development Setup

### Running the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in CI mode
pnpm test:run
```

### Building for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

### Core Directories

```
KairosCV/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # React components
├── lib/              # Business logic and utilities
│   ├── ai/          # AI service implementations
│   ├── parsers/     # Resume parsing logic
│   ├── pdf/         # PDF generation
│   ├── templates/   # Resume templates
│   ├── config.ts    # Configuration management
│   ├── constants.ts # Application constants
│   └── types.ts     # TypeScript type definitions
├── hooks/           # Custom React hooks
└── __tests__/       # Test files (mirrors lib/ structure)
```

### File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `file-uploader.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `resume-processor.ts`)
- **Types**: `types.ts` or `<module>.types.ts`
- **Tests**: `<filename>.test.ts` or `<filename>.spec.ts`
- **Constants**: `constants.ts` or `<module>.constants.ts`

---

## 📝 Coding Standards

### TypeScript

#### Type Safety

- **Always use TypeScript** for new code
- **Avoid `any` type** - use `unknown` if type is truly unknown
- **Define interfaces** for all data structures
- **Use type imports** when importing only types

```typescript
// ✅ Good
import type { ResumeData } from '@/lib/types'

// ❌ Avoid
import { ResumeData } from '@/lib/types'
```

#### Type Definitions

- **Centralize types** in `lib/types.ts`
- **Use meaningful names** that describe the data
- **Document complex types** with JSDoc comments

```typescript
/**
 * Contact information for a resume
 */
export interface ContactInfo {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
}
```

### Code Organization

#### Constants

Extract all magic numbers and strings to `lib/constants.ts`:

```typescript
// ❌ Bad
if (file.size > 5 * 1024 * 1024) {
  throw new Error("File too large")
}

// ✅ Good
import { MAX_FILE_SIZE, ERROR_MESSAGES } from '@/lib/constants'

if (file.size > MAX_FILE_SIZE) {
  throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE)
}
```

#### Configuration

Access environment variables through `lib/config.ts`:

```typescript
// ❌ Bad
const apiKey = process.env.GEMINI_API_KEY

// ✅ Good
import { config } from '@/lib/config'
const apiKey = config.gemini.apiKey
```

### Function Guidelines

#### Function Size

- Keep functions **small and focused** (ideally < 50 lines)
- Extract complex logic into **helper functions**
- Use **meaningful function names** that describe what they do

#### JSDoc Comments

All exported functions should have JSDoc comments:

```typescript
/**
 * Enhance a resume bullet point using AI
 *
 * Transforms basic statements into achievement-focused bullet points
 * with metrics and impact-oriented language.
 *
 * @param bulletPoint - Original bullet point text
 * @param jobTitle - Job title for context
 * @param company - Company name for context
 * @returns Enhanced, ATS-optimized bullet point
 *
 * @example
 * ```typescript
 * const enhanced = await enhanceBulletPoint(
 *   "Worked on API",
 *   "Software Engineer",
 *   "Tech Corp"
 * )
 * // Returns: "Architected RESTful API serving 10K+ requests/day"
 * ```
 */
export async function enhanceBulletPoint(
  bulletPoint: string,
  jobTitle: string,
  company: string
): Promise<string> {
  // Implementation
}
```

#### Error Handling

- **Always handle errors gracefully**
- **Use try-catch blocks** for async operations
- **Log errors** with context
- **Return user-friendly error messages**

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error("Operation failed:", error)
  throw new Error(ERROR_MESSAGES.OPERATION_FAILED)
}
```

### React Components

#### Component Structure

```typescript
'use client' // Only if needed

import type { FC } from 'react'
import { useState } from 'react'

interface Props {
  // Props interface
}

/**
 * Component description
 *
 * @param props - Component props
 */
export const ComponentName: FC<Props> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState()

  // Event handlers
  const handleClick = () => {
    // Handler logic
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

#### Hooks

- Use **custom hooks** for reusable logic
- Name hooks with `use` prefix
- Document hook behavior and return values

```typescript
/**
 * Hook for managing WebSocket connections
 *
 * @param url - WebSocket URL
 * @returns Connection state and control functions
 */
export function useWebSocket(url: string) {
  // Hook implementation
}
```

### Styling

- Use **Tailwind CSS** for styling
- Follow **mobile-first** approach
- Use **semantic class names**
- Extract repeated patterns into components

```tsx
// ✅ Good - Mobile-first, semantic
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <Card>Content</Card>
</div>
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```
feat(ai): add support for GPT-4 model

Implemented GPT-4 integration as an alternative to Gemini.
Users can now choose their preferred AI model in settings.

Closes #123
```

```
fix(parser): handle resumes with special characters

Fixed an issue where LaTeX special characters in resumes
caused PDF generation to fail.

Fixes #456
```

### Best Practices

- **Use present tense**: "Add feature" not "Added feature"
- **Be specific**: Describe what changed and why
- **Reference issues**: Include issue numbers
- **Keep it concise**: Subject line under 72 characters

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with latest main
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   pnpm test:run
   ```

3. **Build successfully**
   ```bash
   pnpm build
   ```

4. **Lint your code**
   ```bash
   pnpm lint
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new features
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. At least **one approval** required
2. All **tests must pass**
3. No **merge conflicts**
4. **Documentation updated** if needed

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = 'test'

      // Act
      const result = functionName(input)

      // Assert
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      // Test edge cases
    })

    it('should handle error case', () => {
      // Test error handling
    })
  })
})
```

### Testing Best Practices

- **Test behavior, not implementation**
- **Write descriptive test names**
- **Test edge cases and error conditions**
- **Keep tests isolated and independent**
- **Mock external dependencies**

### Coverage Goals

- **Aim for 80%+ coverage** for core logic
- **100% coverage** for critical paths (payment, security, etc.)
- **Don't sacrifice quality** for coverage numbers

---

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for all exported functions
- **Inline comments** for complex logic
- **Type definitions** with descriptions
- **README updates** for new features

### Documentation Files

- **README.md**: Project overview and setup
- **CONTRIBUTING.md**: This file
- **API.md**: API endpoint documentation
- **ARCHITECTURE.md**: System architecture
- **CHANGELOG.md**: Version history

### Documentation Standards

- Use **clear, concise language**
- Include **code examples**
- Provide **context and reasoning**
- Keep **documentation up-to-date**

---

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test with latest version**
3. **Gather reproduction steps**

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other relevant information.
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

---

## 🎯 Development Priorities

### High Priority

- Bug fixes affecting core functionality
- Security vulnerabilities
- Performance improvements
- Test coverage improvements

### Medium Priority

- New features
- UI/UX enhancements
- Documentation improvements
- Code refactoring

### Low Priority

- Nice-to-have features
- Minor style tweaks
- Experimental features

---

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (when available)

---

## 📞 Questions?

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and feature requests
- **Email**: [contact@kairoscv.com](mailto:contact@kairoscv.com)

---

**Thank you for contributing to KairosCV! 🎉**
