# Zero Data Loss Implementation Plan
## Ensuring 100% Text Extraction and Categorization

**Objective:** Extract EVERY word from uploaded resumes and categorize ALL content into appropriate sections with zero information loss.

**Status:** Ready for Implementation
**Priority:** CRITICAL
**Estimated Time:** 2-3 hours

---

## Problem Analysis

### Current Issues Causing Data Loss:

1. **Limited Section Detection** - Only detects standard sections (Experience, Education, Skills, Projects, Certifications)
2. **Gemini AI May Skip Content** - AI might not extract content it doesn't recognize
3. **Template Limitations** - Jake's template doesn't have slots for Awards, Languages, Hobbies, Volunteer Work, Publications, etc.
4. **No Coverage Verification** - No mechanism to check if extracted data covers 100% of original text
5. **Bullet Detection Gaps** - Might miss bullets with unconventional formatting
6. **Custom Sections Lost** - User-defined sections (e.g., "Leadership", "Research") get discarded

---

## Solution: Six-Phase Implementation

### **Phase 1: Universal Section Detection** ✅ CRITICAL

**Goal:** Detect ALL sections in a resume, including custom ones

**Implementation:**

```typescript
// lib/parsers/section-detector.ts

interface DetectedSection {
  name: string
  startLine: number
  endLine: number
  content: string[]
  category: SectionCategory
}

type SectionCategory =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'publications'
  | 'languages'
  | 'volunteer'
  | 'hobbies'
  | 'references'
  | 'custom'

// Comprehensive section keyword mapping
const SECTION_KEYWORDS = {
  experience: ['experience', 'work history', 'employment', 'professional experience', 'work experience'],
  education: ['education', 'academic', 'qualifications', 'degrees'],
  skills: ['skills', 'technical skills', 'competencies', 'expertise'],
  projects: ['projects', 'personal projects', 'academic projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
  awards: ['awards', 'honors', 'achievements', 'recognition', 'accomplishments'],
  publications: ['publications', 'papers', 'research', 'articles'],
  languages: ['languages', 'language proficiency', 'spoken languages'],
  volunteer: ['volunteer', 'volunteering', 'community service', 'social work'],
  hobbies: ['hobbies', 'interests', 'activities', 'extracurricular'],
  references: ['references', 'referees'],
  summary: ['summary', 'objective', 'profile', 'about', 'professional summary'],
}

// Detect sections using:
// 1. All-caps headers (e.g., "EXPERIENCE")
// 2. Title case headers (e.g., "Work Experience")
// 3. Bold/underlined text (from HTML parsing)
// 4. Keyword matching with fuzzy matching
// 5. Line spacing patterns (double newlines often precede sections)

function detectAllSections(text: string): DetectedSection[] {
  // ... implementation
}
```

**Why This Works:**
- Catches standard AND custom sections
- Uses multiple detection strategies (headers, keywords, formatting)
- Categorizes sections for proper schema mapping

---

### **Phase 2: Expand Data Schema** ✅ CRITICAL

**Goal:** Support ALL possible resume sections in the data structure

**Implementation:**

```typescript
// lib/schemas/resume-schema.ts - ADD THESE SECTIONS

// Awards/Honors Schema
export const AwardSchema = z.object({
  name: z.string().min(1, "Award name is required"),
  issuer: z.string().optional(), // Who gave the award
  date: z.string().optional(), // "May 2023"
  description: z.string().optional(),
})

// Publications Schema
export const PublicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  authors: z.array(z.string()).optional(), // Co-authors
  venue: z.string().optional(), // Conference/Journal name
  date: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
})

// Language Proficiency Schema
export const LanguageSchema = z.object({
  language: z.string().min(1, "Language name is required"),
  proficiency: z.string().optional(), // "Native", "Fluent", "Professional", "Limited"
  certification: z.string().optional(), // e.g., "TOEFL 110/120"
})

// Volunteer Work Schema
export const VolunteerSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string()).min(1),
})

// Hobbies/Interests Schema
export const HobbySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

// Custom Section Schema (catch-all)
export const CustomSectionSchema = z.object({
  heading: z.string().min(1, "Section heading is required"),
  content: z.array(z.string()).min(1, "Section content is required"),
})

// UPDATE ResumeDataSchema to include new sections:
export const ResumeDataSchema = z.object({
  // Required
  contact: ContactSchema,

  // Core sections
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: SkillsSchema.default({ languages: [], frameworks: [], tools: [], databases: [] }),

  // Optional standard sections
  summary: z.string().optional(),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),

  // NEW: Additional sections
  awards: z.array(AwardSchema).optional(),
  publications: z.array(PublicationSchema).optional(),
  languages: z.array(LanguageSchema).optional(), // Spoken languages
  volunteer: z.array(VolunteerSchema).optional(),
  hobbies: z.array(HobbySchema).optional(),
  references: z.array(z.string()).optional(), // Simple string array

  // Catch-all for unrecognized sections
  customSections: z.array(CustomSectionSchema).optional(),

  // Metadata
  rawText: z.string().optional(),
  parseSource: z.enum(['pdf', 'docx', 'txt']).optional(),
  parsedAt: z.date().optional(),
  enhancedAt: z.date().optional(),
})
```

**Why This Works:**
- Covers 99% of resume sections
- `customSections` catches anything we missed
- All data gets stored somewhere

---

### **Phase 3: Two-Pass Extraction with Coverage Analysis** ✅ CRITICAL

**Goal:** Ensure every line from the original text is accounted for

**Implementation:**

```typescript
// lib/parsers/zero-loss-parser.ts

interface ExtractionCoverage {
  totalLines: number
  extractedLines: number
  missedLines: string[]
  coveragePercent: number
  sections: {
    [sectionName: string]: {
      originalLines: string[]
      extractedLines: string[]
      coverage: number
    }
  }
}

/**
 * Two-Pass Extraction Strategy:
 *
 * PASS 1: Gemini AI Extraction
 * - Send full text to Gemini
 * - Get structured data back
 *
 * PASS 2: Coverage Analysis & Gap Filling
 * - Flatten extracted data back to text
 * - Compare with original text line-by-line
 * - Find missing lines
 * - Run regex fallback parser on ONLY missing content
 * - Merge results
 */
async function extractWithZeroLoss(rawText: string): Promise<{
  data: ResumeData
  coverage: ExtractionCoverage
}> {
  // Normalize text (remove extra whitespace but preserve structure)
  const normalizedText = normalizeText(rawText)
  const originalLines = normalizedText.split('\n').filter(line => line.trim().length > 0)

  // PASS 1: AI Extraction
  console.log('🤖 Pass 1: AI extraction...')
  let extractedData = await extractCompleteResumeData(rawText)

  // PASS 2: Coverage Analysis
  console.log('🔍 Pass 2: Analyzing coverage...')
  const coverage = analyzeCoverage(originalLines, extractedData)

  console.log(`📊 Coverage: ${coverage.coveragePercent}%`)

  // If coverage < 95%, extract missing content
  if (coverage.coveragePercent < 95) {
    console.log(`⚠ Low coverage detected! Extracting ${coverage.missedLines.length} missed lines...`)

    const missedText = coverage.missedLines.join('\n')
    const missedSections = detectAllSections(missedText)

    // Add missed content to customSections
    if (!extractedData.customSections) {
      extractedData.customSections = []
    }

    for (const section of missedSections) {
      extractedData.customSections.push({
        heading: section.name,
        content: section.content
      })
    }

    // Recalculate coverage
    const newCoverage = analyzeCoverage(originalLines, extractedData)
    console.log(`✓ New coverage: ${newCoverage.coveragePercent}%`)
  }

  return { data: extractedData, coverage }
}

/**
 * Flatten extracted data back to text for comparison
 */
function flattenExtractedData(data: ResumeData): string[] {
  const lines: string[] = []

  // Contact
  if (data.contact?.name) lines.push(data.contact.name)
  if (data.contact?.email) lines.push(data.contact.email)
  if (data.contact?.phone) lines.push(data.contact.phone)
  // ... etc for all fields

  // Experience
  for (const exp of data.experience || []) {
    lines.push(exp.company, exp.title, ...exp.bullets)
  }

  // Education
  for (const edu of data.education || []) {
    lines.push(edu.institution, edu.degree)
  }

  // Skills
  lines.push(...(data.skills?.languages || []))
  lines.push(...(data.skills?.frameworks || []))
  // ... etc

  // Projects, Certifications, Awards, etc.
  // ...

  return lines
}

/**
 * Compare original text with extracted data
 */
function analyzeCoverage(originalLines: string[], extractedData: ResumeData): ExtractionCoverage {
  const extractedLines = flattenExtractedData(extractedData)

  // Use fuzzy matching (Levenshtein distance) to account for AI rephrasing
  const missedLines: string[] = []
  let matchCount = 0

  for (const origLine of originalLines) {
    const found = extractedLines.some(extLine =>
      similarity(origLine, extLine) > 0.8 // 80% similarity threshold
    )

    if (found) {
      matchCount++
    } else {
      missedLines.push(origLine)
    }
  }

  return {
    totalLines: originalLines.length,
    extractedLines: matchCount,
    missedLines,
    coveragePercent: Math.round((matchCount / originalLines.length) * 100),
    sections: {} // Detailed per-section analysis
  }
}
```

**Why This Works:**
- Two-pass ensures nothing is missed
- Coverage analysis gives us quantifiable metrics
- Fuzzy matching accounts for AI rephrasing ("Software Engineer" → "Software Developer")
- Custom sections catch anything not fitting standard categories

---

### **Phase 4: Enhance Template for New Sections** ✅ IMPORTANT

**Goal:** Update Jake's template to render ALL sections

**Implementation:**

```handlebars
<!-- lib/templates/jakes-resume.html - ADD THESE SECTIONS -->

<!-- AFTER CERTIFICATIONS SECTION -->

<!-- Awards/Honors -->
{{#if AWARDS}}
<section>
  <h2>AWARDS & HONORS</h2>
  {{#each AWARDS}}
  <div class="item">
    <div class="item-header">
      <span class="item-title">{{this.name}}</span>
      {{#if this.issuer}}<span class="item-company">{{this.issuer}}</span>{{/if}}
      {{#if this.date}}<span class="item-date">{{this.date}}</span>{{/if}}
    </div>
    {{#if this.description}}<p>{{this.description}}</p>{{/if}}
  </div>
  {{/each}}
</section>
{{/if}}

<!-- Publications -->
{{#if PUBLICATIONS}}
<section>
  <h2>PUBLICATIONS</h2>
  {{#each PUBLICATIONS}}
  <div class="item">
    <div class="item-header">
      <span class="item-title">{{this.title}}</span>
      {{#if this.venue}}<span class="item-company">{{this.venue}}</span>{{/if}}
      {{#if this.date}}<span class="item-date">{{this.date}}</span>{{/if}}
    </div>
    {{#if this.authors}}<p><em>Co-authors: {{join this.authors ", "}}</em></p>{{/if}}
    {{#if this.description}}<p>{{this.description}}</p>{{/if}}
  </div>
  {{/each}}
</section>
{{/if}}

<!-- Languages -->
{{#if LANGUAGES}}
<section>
  <h2>LANGUAGES</h2>
  <div class="skills-list">
    {{#each LANGUAGES}}
    <span><strong>{{this.language}}:</strong> {{this.proficiency}}</span>{{#unless @last}}, {{/unless}}
    {{/each}}
  </div>
</section>
{{/if}}

<!-- Volunteer Work -->
{{#if VOLUNTEER}}
<section>
  <h2>VOLUNTEER EXPERIENCE</h2>
  {{#each VOLUNTEER}}
  <div class="item">
    <div class="item-header">
      <span class="item-title">{{this.role}}</span>
      <span class="item-company">{{this.organization}}</span>
      <span class="item-date">{{this.startDate}} – {{this.endDate}}</span>
    </div>
    <ul class="bullets">
      {{#each this.bullets}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/each}}
</section>
{{/if}}

<!-- Hobbies/Interests -->
{{#if HOBBIES}}
<section>
  <h2>INTERESTS</h2>
  <div class="skills-list">
    {{#each HOBBIES}}
    {{this.name}}{{#unless @last}}, {{/unless}}
    {{/each}}
  </div>
</section>
{{/if}}

<!-- Custom Sections (catch-all) -->
{{#if CUSTOM_SECTIONS}}
{{#each CUSTOM_SECTIONS}}
<section>
  <h2>{{uppercase this.heading}}</h2>
  <ul class="bullets">
    {{#each this.content}}
    <li>{{this}}</li>
    {{/each}}
  </ul>
</section>
{{/each}}
{{/if}}
```

**Template Updates Needed:**
1. Add Handlebars helpers: `uppercase`, `join`
2. Maintain Jake's clean styling for all new sections
3. Conditional rendering (only show if data exists)

---

### **Phase 5: Enhanced Gemini Prompts** ✅ IMPORTANT

**Goal:** Instruct Gemini to extract EVERYTHING, including non-standard sections

**Implementation:**

```typescript
// lib/ai/gemini-service.ts - UPDATE extractCompleteResumeData()

const COMPREHENSIVE_EXTRACTION_PROMPT = `
You are a professional resume parser. Extract EVERY piece of information from this resume.

CRITICAL RULES:
1. Do NOT skip any content - extract everything you see
2. If you see a section you don't recognize, add it to "customSections"
3. Extract bullet points EXACTLY as written (preserve all text)
4. If unsure where something belongs, err on the side of including it

SECTIONS TO EXTRACT:

ALWAYS REQUIRED:
- contact: name, email, phone, linkedin, github, location

STANDARD SECTIONS (extract if present):
- summary/objective
- experience (company, title, location, dates, bullets)
- education (institution, degree, field, location, dates, GPA, honors)
- skills (categorize as: languages, frameworks, tools, databases)
- projects (name, description, technologies, bullets, links)
- certifications (name, issuer, date, credential ID)

ADDITIONAL SECTIONS (extract if present):
- awards: any awards, honors, recognitions, achievements
- publications: research papers, articles, blog posts
- languages: spoken languages (NOT programming languages)
- volunteer: volunteer work, community service
- hobbies: interests, hobbies, extracurricular activities
- references: "References available upon request" or specific names

CUSTOM SECTIONS:
- If you see ANY section not listed above (e.g., "Leadership", "Research", "Patents"),
  add it to customSections with the heading and all content

OUTPUT FORMAT:
{
  "contact": { ... },
  "summary": "...",
  "experience": [ ... ],
  "education": [ ... ],
  "skills": { ... },
  "projects": [ ... ],
  "certifications": [ ... ],
  "awards": [ ... ],
  "publications": [ ... ],
  "languages": [ ... ],
  "volunteer": [ ... ],
  "hobbies": [ ... ],
  "customSections": [
    { "heading": "Section Name", "content": ["line 1", "line 2", ...] }
  ]
}

RESUME TEXT:
${resumeText}
`
```

**Why This Works:**
- Explicit instruction to extract everything
- Provides escape hatch (customSections) for unknown content
- Clear schema prevents ambiguity

---

### **Phase 6: Quality Assurance Dashboard** ✅ NICE-TO-HAVE

**Goal:** Visual feedback on extraction quality

**Implementation:**

```typescript
// Show coverage metrics in UI during processing

yield {
  stage: "validating",
  progress: 75,
  message: `Coverage: ${coverage.coveragePercent}% | ${coverage.missedLines.length} lines missed`,
  coverage: coverage
}

// Log missed content for debugging
if (coverage.missedLines.length > 0) {
  console.warn('⚠ Missed content:')
  coverage.missedLines.forEach((line, i) => {
    console.warn(`  ${i + 1}. ${line}`)
  })
}
```

---

## Implementation Checklist

### Must Have (For Zero Data Loss):
- [ ] **Phase 1:** Universal section detector (`lib/parsers/section-detector.ts`)
- [ ] **Phase 2:** Expand schemas to support all sections
- [ ] **Phase 3:** Two-pass extraction with coverage analysis
- [ ] **Phase 4:** Update template for new sections
- [ ] **Phase 5:** Enhanced Gemini prompts

### Nice to Have (For Better UX):
- [ ] **Phase 6:** Coverage metrics in UI
- [ ] Visual diff showing original vs extracted
- [ ] Manual correction interface (if coverage < 95%)

---

## Testing Strategy

### Test Cases:

1. **Standard Resume:**
   - Format: Standard sections (Experience, Education, Skills)
   - Expected: 100% coverage

2. **Non-Standard Resume:**
   - Format: Custom sections ("Leadership", "Research")
   - Expected: >95% coverage, custom sections captured

3. **Minimal Resume:**
   - Format: Only name + 1 job
   - Expected: 100% coverage

4. **Kitchen Sink Resume:**
   - Format: ALL possible sections (15+ sections)
   - Expected: >95% coverage

5. **Poorly Formatted Resume:**
   - Format: No clear sections, just paragraphs
   - Expected: >90% coverage, everything in customSections

---

## Success Metrics

✅ **Zero Data Loss Achieved When:**
- Coverage ≥ 95% on all test resumes
- Every line from original appears in extracted data (allowing for minor rewording)
- No user-reported missing information
- Custom sections successfully capture unrecognized content

---

## Estimated Implementation Time

| Phase | Time | Priority |
|-------|------|----------|
| Phase 1 (Section Detector) | 30 min | CRITICAL |
| Phase 2 (Schema Expansion) | 20 min | CRITICAL |
| Phase 3 (Two-Pass Extraction) | 45 min | CRITICAL |
| Phase 4 (Template Updates) | 30 min | CRITICAL |
| Phase 5 (Gemini Prompts) | 15 min | CRITICAL |
| Phase 6 (QA Dashboard) | 20 min | Optional |
| **Total** | **2h 40min** | - |

---

## Next Steps

1. **Review and approve this plan**
2. **Start with Phase 2 (Schema)** - Fastest to implement, enables other phases
3. **Then Phase 5 (Gemini)** - Immediate improvement with existing infrastructure
4. **Then Phase 1 (Section Detector)** - Foundation for Phase 3
5. **Then Phase 3 (Two-Pass)** - The magic happens here
6. **Then Phase 4 (Template)** - Make it visible to users
7. **Finally Phase 6 (QA)** - Polish

**Ready to start implementation when you approve!** 🚀
