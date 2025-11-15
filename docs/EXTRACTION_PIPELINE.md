# Multi-Layer Extraction Pipeline

## Overview

KairosCV uses a **5-layer extraction pipeline** to ensure **zero data loss** when converting resumes to optimized PDFs. Each layer adds verification and validation to ensure every piece of information is captured correctly.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Raw Resume Upload                         │
│                  (PDF / DOCX / TXT)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Raw Text Extraction                               │
│  • PDF: pdf-parse + OCR fallback                            │
│  • DOCX: mammoth (HTML conversion)                          │
│  • TXT: Direct read                                         │
│  • Vision API cross-verification (Gemini 1.5 Flash)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: Structured Data Extraction (Gemini AI)            │
│  • Extract ALL sections with AI intelligence                │
│  • Contact info, experience, education, skills, etc.        │
│  • Custom sections for unrecognized content                 │
│  • Returns structured JSON matching schema                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Field Classification & Validation                 │
│  • Validate name vs job title                               │
│  • Validate company vs institution                          │
│  • Categorize skills (language/framework/tool/database)     │
│  • Verify job titles and company names                      │
│  • Confidence scoring for each field                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: Completeness Verification                         │
│  • Compare extracted JSON against raw text                  │
│  • Identify missing content with AI                         │
│  • Re-extract if confidence < 70% and gaps > 3              │
│  • Merge multiple extraction passes                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: Data Normalization & Cleanup                      │
│  • Fill defaults for missing required fields                │
│  • Zod schema validation                                    │
│  • Deduplication (via edge-case-handler)                    │
│  • Date normalization                                       │
│  • Confidence scoring                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           JSON Storage (uploads/json/[fileId].json)          │
│           • Debugging and audit trail                       │
│           • Re-processing without re-parsing                │
│           • API: GET /api/json/[fileId]                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Jake's Resume Template Mapping                  │
│              • Convert JSON to HTML template                │
│              • Puppeteer PDF generation                     │
│              • ATS-optimized output                         │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### Layer 1: Raw Text Extraction

**Input:** Binary file (PDF/DOCX/TXT)
**Output:** Plain text string
**Location:** `lib/parsers/pdf-parser-enhanced.ts`, `lib/parsers/docx-parser-enhanced.ts`

**Strategies:**
- **PDF:** Uses `pdf-parse` with fallback to `pdf.js` for complex layouts
- **DOCX:** Uses `mammoth` with HTML conversion for better formatting preservation
- **Vision API:** Gemini 1.5 Flash vision model cross-verifies PDF extraction

**Confidence Metrics:**
- Text extraction confidence: 0-100%
- Vision match percentage: 0-100%
- Metadata: multi-column detection, table detection

### Layer 2: Structured Data Extraction

**Input:** Raw text string
**Output:** Partial JSON (all fields optional)
**Location:** `lib/ai/gemini-service.ts` (`extractCompleteResumeData`)

**AI Prompt Strategy:**
- Comprehensive schema definition
- Zero data loss rule (extract EVERYTHING)
- Custom sections for unrecognized content
- Structured JSON output

**Fields Extracted:**
- Contact: name, email, phone, LinkedIn, GitHub, website, location
- Experience: company, title, location, dates, bullets
- Education: institution, degree, field, GPA, honors, coursework
- Skills: languages, frameworks, tools, databases
- Projects: name, description, technologies, bullets, links
- Certifications: name, issuer, date, credential ID/URL
- Awards, Publications, Languages (spoken), Volunteer, Hobbies
- Custom sections (catch-all)

### Layer 3: Field Classification & Validation

**Input:** Partial JSON from Layer 2
**Output:** Validated and corrected JSON
**Location:** `lib/ai/field-classifier.ts`

**Validation Functions:**

1. **`classifyField(text, context)`**
   - Determines correct field for ambiguous text
   - Example: "John Smith" → name vs "Software Engineer" → job_title

2. **`validateFieldPlacement(field, value, expectedType)`**
   - Verifies value is in correct field
   - Suggests corrections if misplaced

3. **`categorizeSkillsBatch(skills)`**
   - Categorizes skills into: languages, frameworks, tools, databases
   - Example: "React" → framework, "Python" → language

**Confidence Scores:**
- Each classification returns confidence (0-1)
- Low confidence triggers warnings

### Layer 4: Completeness Verification

**Input:** Validated JSON + Raw text
**Output:** Completeness report + Re-extracted data (if needed)
**Location:** `lib/extraction/multi-layer-extractor.ts`

**Verification Process:**

1. **`verifyDataCompleteness(rawText, extractedData)`**
   - AI compares raw text against JSON
   - Identifies missing content
   - Returns list of gaps

2. **Re-extraction Logic:**
   ```typescript
   if (confidence < 0.7 && missingContent.length > 3) {
     // Second extraction pass
     secondExtraction = await extractCompleteResumeData(rawText)
     finalData = mergeExtractions(primary, secondary)
   }
   ```

3. **Merging Strategy:**
   - Deduplication by key fields (company, institution, name)
   - Union of arrays (skills, bullets, etc.)
   - Primary takes precedence when conflicts occur

### Layer 5: Data Normalization & Cleanup

**Input:** Complete but potentially messy JSON
**Output:** Clean, validated `ResumeData`
**Location:** `lib/schemas/resume-schema.ts`, `lib/parsers/edge-case-handler.ts`

**Normalization Steps:**

1. **Fill Defaults:** `fillDefaults(partialData)`
   - Adds required fields with sensible defaults
   - Example: Missing name → "Unknown"

2. **Zod Validation:** `safeValidateResumeData(data)`
   - Type-safe validation
   - Detailed error messages

3. **Edge Case Handling:** `handleAllEdgeCases(data, rawText)`
   - Duplicate removal (experience, education, etc.)
   - Date normalization (various formats → standard)
   - Bullet point cleanup

4. **Confidence Scoring:** `scoreResume(data)`
   - Overall quality score (0-100%)
   - Section-by-section breakdown
   - Quality level (EXCELLENT, GOOD, FAIR, POOR)

## JSON Storage

**Location:** `uploads/json/[fileId].json`

**Schema:**
```json
{
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA"
  },
  "summary": "Experienced software engineer...",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Google",
      "location": "Mountain View, CA",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "bullets": [
        "Built scalable microservices...",
        "Improved performance by 40%..."
      ]
    }
  ],
  "education": [...],
  "skills": {
    "languages": ["Python", "JavaScript"],
    "frameworks": ["React", "Django"],
    "tools": ["Docker", "Kubernetes"],
    "databases": ["PostgreSQL", "Redis"]
  },
  "projects": [...],
  "certifications": [...],
  "awards": [...],
  "publications": [...],
  "languageProficiency": [...],
  "volunteer": [...],
  "hobbies": [...],
  "references": [...],
  "customSections": [...]
}
```

**API Access:**
```bash
# View extracted JSON
GET /api/json/[fileId]

# Example
curl http://localhost:3000/api/json/abc123
```

## Configuration

**Environment Variables:**
```bash
# Required for AI extraction and validation
GEMINI_API_KEY=your_api_key_here
```

**Performance Settings:**
- Layer 2 timeout: 30s (AI extraction)
- Layer 3 timeout: 10s (field validation)
- Layer 4 timeout: 15s (completeness check)
- Layer 5 timeout: 5s (normalization)

## Error Handling

**Graceful Degradation:**

1. **Layer 2 Fails (AI unavailable):**
   - Fallback to regex-based parser (`parseResumeEnhanced`)
   - Lower accuracy but still functional

2. **Layer 3 Fails (Validation unavailable):**
   - Skip validation, use extracted data as-is
   - Warning logged to console

3. **Layer 4 Fails (Completeness check fails):**
   - Proceed with single extraction
   - Warning about potential gaps

4. **Layer 5 Fails (Normalization fails):**
   - Return partially validated data
   - PDF generation may have issues

## Monitoring

**Console Logs:**
```
✅ Layer 1: Text extracted (pdf-parse, 95% confidence)
✅ Layer 2: Structured data extracted
✅ Layer 3: Skills categorized correctly
✅ Layer 4: Data completeness verified (98% confidence)
✅ Layer 5: Data normalized and validated
📄 Resume JSON saved: /uploads/json/abc123.json
```

**Warnings:**
```
⚠️  Name field might be incorrect. Suggested: job_title
⚠️  Data extraction might be incomplete:
   1. Missing project bullet points
   2. GPA not extracted
⚠️  Data quality warnings: education[0].field is missing
```

## Testing

**Unit Tests:**
```bash
# Test individual layers
pnpm test lib/extraction/multi-layer-extractor.test.ts

# Test field classification
pnpm test lib/ai/field-classifier.test.ts

# Test JSON storage
pnpm test lib/storage/resume-json-storage.test.ts
```

**Integration Tests:**
```bash
# Test full pipeline
pnpm test lib/resume-processor.test.ts
```

**Manual Testing:**
1. Upload test resume
2. Check console logs for layer completion
3. Visit `/api/json/[fileId]` to inspect extracted data
4. Download PDF and verify all content present

## Troubleshooting

### Issue: Missing content in PDF output

**Diagnosis:**
1. Check Layer 4 completeness report in console
2. View extracted JSON: `/api/json/[fileId]`
3. Compare JSON against original resume

**Solution:**
- If JSON has data but PDF missing it → Template mapping issue
- If JSON missing data → Extraction issue, check AI prompts

### Issue: Incorrect field classification

**Diagnosis:**
1. Check Layer 3 validation warnings
2. Look for "might be incorrect" messages

**Solution:**
- Improve AI prompt in `field-classifier.ts`
- Add more examples to classification rules

### Issue: Low confidence scores

**Diagnosis:**
1. Check Layer 5 confidence score in console
2. Review section-by-section breakdown

**Solution:**
- Re-extract with second pass (automatic if < 70%)
- Manually review and correct JSON
- Update fallback parser patterns

## Future Enhancements

1. **Layer 0: Pre-processing**
   - Image enhancement for scanned PDFs
   - OCR improvement with Tesseract.js

2. **Layer 6: Human-in-the-loop**
   - Interactive correction UI
   - User confirms extracted data before PDF generation

3. **Machine Learning:**
   - Fine-tune extraction model on resume dataset
   - Pattern recognition for common resume formats

4. **Caching:**
   - Cache AI responses for common phrases
   - Template-based extraction for known formats

---

**Last Updated:** November 15, 2025
**Version:** 1.0
**Author:** KairosCV Team
