# Comprehensive Visual Extraction System

## Overview

The comprehensive visual extraction system uses **Gemini Vision 2.0** to extract EVERY piece of information from resume PDFs, including visual elements that are often lost in text-only extraction.

## What Gets Extracted

### Text Content
- ✅ Regular text
- ✅ **Bold text** (with notation)
- ✅ *Italic text* (with notation)
- ✅ Underlined text
- ✅ Small font text (often missed in OCR)
- ✅ Large font text (headers, titles)
- ✅ Text in margins, headers, footers
- ✅ Text in sidebars or columns
- ✅ Multi-column layouts

### Bullet Points (CRITICAL)
- ✅ Every single bullet point
- ✅ Bullet symbol types (•, ○, -, *, etc.)
- ✅ Exact text after each bullet
- ✅ Indentation levels
- ✅ Nested bullets

### Visual Elements
- ✅ Colors used for text
- ✅ Different font sizes
- ✅ Icons or symbols
- ✅ Borders or separators
- ✅ Background colors or shading
- ✅ Overall layout structure

### Commonly Missed Content
- ✅ Phone numbers in headers/footers
- ✅ Email addresses in small font
- ✅ LinkedIn/GitHub URLs
- ✅ Location information
- ✅ Dates in various formats
- ✅ Skills listed in small text
- ✅ Certifications in footer
- ✅ Languages spoken
- ✅ Volunteer work
- ✅ Publications

## Architecture

### Layer 2.5: Visual Extraction and Intelligent Merging

The visual extraction layer is integrated into the multi-layer extraction pipeline:

```
Layer 1: Raw Text Extraction (PDF/DOCX/TXT)
    ↓
Layer 2: Structured Data Extraction (Gemini AI - text-based)
    ↓
Layer 2.5: Visual Extraction and Intelligent Merging ← NEW
    ├─ Extract visually with Gemini Vision 2.0
    ├─ Capture bullets, italics, bold, small text
    └─ Merge with text-based results
    ↓
Layer 3: Field Classification and Validation
    ↓
Layer 4: Completeness Verification
    ↓
Layer 4.5: Field Verification and Research
    ↓
Layer 5: Data Normalization and Cleanup
```

## Key Components

### 1. Visual Extractor Enhanced
**File:** `lib/parsers/visual-extractor-enhanced.ts`

Uses Gemini Vision 2.0 Flash Exp to analyze the entire PDF visually.

**Key Function:**
```typescript
export async function extractCompleteResumeVisually(
  pdfPath: string,
  rawText: string
): Promise<VisualExtractionResult>
```

**Features:**
- Sends PDF directly to Gemini Vision API (no image conversion needed)
- Comprehensive prompt that explicitly asks for ALL content
- Extracts structured data + visual metadata
- Cross-references with raw text to find missing content

**Returns:**
```typescript
interface VisualExtractionResult {
  fullText: string                    // Every word seen in PDF
  structuredData: any                 // Resume sections
  visualElements: {
    bulletPoints: string[]            // All bullets
    italicText: string[]              // Italic content
    boldText: string[]                // Bold content
    smallText: string[]               // Small font text
    headers: string[]                 // Section headers
    footers: string[]                 // Footer content
    colors: string[]                  // Colors used
    layout: string                    // Layout type
  }
  confidence: number
  method: "vision-complete"
}
```

### 2. Intelligent Merger
**File:** `lib/extraction/intelligent-merger.ts`

Merges text-based and vision-based extractions to ensure zero data loss.

**Key Function:**
```typescript
export function mergeExtractions(
  textExtraction: any,
  visualExtraction: VisualExtractionResult
): MergedExtractionResult
```

**Merging Strategy:**
- **Contact Info:** Use longer/more complete values
- **Experience:** Match by company name, merge bullets
- **Education:** Match by institution, merge details
- **Skills:** Deduplicate and combine all skills
- **Projects:** Match by name, merge bullets and technologies
- **Arrays:** Deduplicate while preserving all unique items

**Returns:**
```typescript
interface MergedExtractionResult {
  data: ResumeData                    // Merged resume data
  sources: {
    fromText: string[]                // Fields from text extraction
    fromVision: string[]              // Fields from visual extraction
    merged: string[]                  // Fields merged from both
  }
  completeness: number                // 0-100% completeness score
}
```

### 3. Integration in Multi-Layer Extractor
**File:** `lib/extraction/multi-layer-extractor.ts`

**Layer 2.5 Integration:**
```typescript
// After Layer 2 text extraction completes...

// Get PDF file path
const pdfPath = getUploadFilePath(fileId)

// Check if visual extraction is available
if (isVisualExtractionAvailable() && pdfPath.endsWith('.pdf')) {
  // Extract visually
  const visualExtraction = await extractCompleteResumeVisually(pdfPath, rawText)

  // Merge with text extraction
  const merged = mergeExtractions(extractedData, visualExtraction)

  // Use merged data going forward
  extractedData = merged.data
}
```

## How It Works

### Step 1: Text-Based Extraction
Standard text extraction using pdf-parse, unpdf, or fallback methods.

### Step 2: Visual Analysis
Gemini Vision 2.0 analyzes the PDF image and extracts:
- All visible text (with formatting notes)
- Bullet points with exact content
- Visual elements (colors, layout, fonts)
- Content missed by text extraction

### Step 3: Intelligent Merging
The merger combines both extractions:

**For Contact Info:**
```typescript
// Use the longer/more complete value
merged.contact.email = textValue.length > visualValue.length
  ? textValue
  : visualValue
```

**For Bullets:**
```typescript
// Combine unique bullets from both sources
const existingBullets = new Set(textBullets)
const newBullets = visualBullets.filter(b => !existingBullets.has(b))
merged.bullets = [...textBullets, ...newBullets]
```

**For Skills:**
```typescript
// Deduplicate across all categories
merged.skills.languages = [...new Set([
  ...textSkills.languages,
  ...visualSkills.languages
])]
```

### Step 4: Completeness Tracking
```typescript
const completeness = Math.round(
  (mergedFields / Math.max(mergedFields, textFields + 10)) * 100
)
```

## Configuration

### Prerequisites
1. **Gemini API Key** configured in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. **PDF Files Only:**
   - Visual extraction only works for PDF files
   - DOCX files skip this layer (uses text extraction only)

### Checking Availability
```typescript
import { isVisualExtractionAvailable } from '@/lib/parsers/visual-extractor-enhanced'

if (isVisualExtractionAvailable()) {
  // Gemini Vision API is configured
}
```

## Progress Updates

During extraction, users see real-time progress:

```
45% - 🎨 Extracting visual elements (bullets, formatting)...
48% - Merging text and visual extractions...
50% - Validating field classifications...
```

## Error Handling

### Graceful Degradation
If visual extraction fails:
```typescript
try {
  const visualExtraction = await extractCompleteResumeVisually(...)
  const merged = mergeExtractions(textExtraction, visualExtraction)
  extractedData = merged.data
  layers.layer2_5_visual = true
} catch (error) {
  console.warn('⚠️  Visual extraction failed:', error)
  console.log('⚠️  Continuing with text-only extraction')
  layers.layer2_5_visual = false
  // Continue with text extraction only
}
```

### Skip Conditions
Visual extraction is skipped when:
- Gemini API key not configured
- File is not a PDF
- Visual extraction fails (uses text-only as fallback)

## Logging

### Console Output
```
🎨 Starting comprehensive visual extraction...
✅ Visual extraction complete: 23 bullets found
✅ Merge complete: 8 items from vision
   Completeness: 87%
```

### Layer Tracking
```typescript
layers: {
  layer1_extraction: true,
  layer2_structuring: true,
  layer2_5_visual: true,      // ← Visual extraction status
  layer3_classification: true,
  layer4_verification: true,
  layer4_5_field_research: true,
  layer5_normalization: true,
}
```

## Performance

### Timing
- **Visual Extraction:** 5-10 seconds (depends on PDF complexity)
- **Merging:** <1 second
- **Total Overhead:** ~5-10 seconds added to extraction

### API Usage
- **Gemini Vision 2.0 Flash Exp** model
- 1 API call per PDF (regardless of page count)
- Temperature: 0.1 (for factual extraction)
- Max output tokens: 8192

## Benefits

### Zero Data Loss
By combining text and visual extraction:
- Captures bullets missed by OCR
- Finds small text in headers/footers
- Extracts multi-column content accurately
- Preserves formatting information

### Higher Accuracy
- Cross-verification between methods
- Visual context helps disambiguate
- Formatting clues aid categorization

### Better User Experience
- More complete extracted data
- Fewer missing fields
- Higher confidence scores

## Testing

### Manual Testing
1. Upload a resume PDF with:
   - Bullet points
   - Multi-column layout
   - Small text (footer, header)
   - Italic/bold text

2. Check extracted data viewer:
   - Verify all bullets are present
   - Check small text was captured
   - Confirm formatting noted

3. Review console logs:
   ```
   ✅ Visual extraction complete: X bullets found
   ✅ Merge complete: Y items from vision
      Completeness: Z%
   ```

### Expected Results
- Completeness score: 85-100%
- All bullet points captured
- Contact info complete (including small text)
- Skills from all sources

## Troubleshooting

### Issue: Layer 2.5 Skipped
**Cause:** Gemini API key not configured or file is not PDF

**Solution:**
```bash
# Check .env.local
cat .env.local | grep GEMINI_API_KEY

# If missing, add it:
echo "GEMINI_API_KEY=your_key_here" >> .env.local
```

### Issue: Visual Extraction Failed
**Cause:** API rate limit, network error, or invalid PDF

**Solution:**
- Check console logs for specific error
- System automatically falls back to text-only
- Increase rate limits or retry later

### Issue: Missing Bullets After Merge
**Cause:** Bullets are identical (exact match)

**Solution:**
- Merger deduplicates exact matches
- Check if text extraction already captured them
- Review visual extraction logs

## Future Enhancements

### Potential Improvements
1. **Multi-page optimization:** Process pages in parallel
2. **Formatting preservation:** Store bold/italic metadata in schema
3. **Layout analysis:** Use layout info for better categorization
4. **Confidence scoring:** Per-field confidence from visual extraction
5. **Caching:** Cache visual results to avoid re-extraction

## References

- **Gemini Vision API:** https://ai.google.dev/gemini-api/docs/vision
- **Multi-layer Extraction:** `/docs/EXTRACTION_PIPELINE.md`
- **Zero Data Loss:** `/docs/ZERO_DATA_LOSS_IMPLEMENTATION.md`

---

**Last Updated:** November 16, 2025
**Status:** ✅ Fully Integrated and Operational
**Layer:** 2.5 (Visual Extraction and Merging)
