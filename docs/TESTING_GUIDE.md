# Testing Guide - KairosCV Resume Optimizer

## Overview
This guide covers how to test the KairosCV Resume Optimizer application locally.

## Prerequisites

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Gemini API (Optional)**
   - Get your API key from https://ai.google.dev/
   - Open `.env.local` and add your key:
     ```
     GEMINI_API_KEY=your-actual-api-key-here
     ```
   - **Note:** The app works without the API key, but AI enhancement will be skipped

## Running Tests

### Unit Tests
Run the automated test suite:

```bash
# Run tests once
pnpm test:run

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui
```

**Expected Results:**
- ✅ All 14 tests should pass
- Tests cover parser, template renderer, and core functionality

### Build Test
Ensure the application builds successfully:

```bash
pnpm run build
```

**Expected Results:**
- ✅ Build completes without errors
- ✅ Creates `.next` directory with production build

## End-to-End Testing

### 1. Start Development Server

```bash
pnpm dev
```

Open browser to: `http://localhost:3000`

### 2. Test File Upload

**Test with Sample Resume:**
1. Use the provided test file: `test-files/sample-resume.txt`
2. Drag and drop the file or click to upload
3. Verify file validation:
   - ✅ Accepts .txt, .pdf, .docx files
   - ❌ Rejects files over 5MB
   - ❌ Rejects invalid file types

### 3. Test Processing Pipeline

After uploading a resume, verify each stage:

**Stage 1: Parsing (15-35%)**
- ✅ Progress bar shows "Parsing resume content..."
- ✅ File content is extracted

**Stage 2: AI Enhancement (45-65%)**
- ✅ Shows "Enhancing content with AI..."
- ✅ If Gemini API configured: Bullet points are enhanced
- ✅ If no API key: Original content is used (graceful degradation)

**Stage 3: PDF Generation (75-95%)**
- ✅ Shows "Generating optimized document..."
- ✅ PDF is created using Jake's Resume template

**Stage 4: Complete (100%)**
- ✅ Shows "Resume optimization complete!"
- ✅ Download button appears

### 4. Test Download

1. Click "Download Optimized Resume" button
2. Verify:
   - ✅ PDF file downloads successfully
   - ✅ Filename includes original name
   - ✅ PDF opens in viewer

### 5. Visual Inspection of Generated PDF

Open the downloaded PDF and check:

**Layout:**
- ✅ Clean, professional appearance
- ✅ Jake's Resume style formatting
- ✅ Proper spacing and margins
- ✅ Single column layout (ATS-friendly)

**Content:**
- ✅ Contact information at top
- ✅ Experience section with bullet points
- ✅ Education section
- ✅ Skills section (categorized)
- ✅ Projects section (if applicable)

**Typography:**
- ✅ Consistent font sizes
- ✅ Bold section headers
- ✅ Proper text alignment

## Testing Without Gemini API

The application is designed to work without AI enhancement:

1. **Skip .env.local configuration** or leave `GEMINI_API_KEY` empty
2. Upload a resume
3. Verify:
   - ✅ Processing completes successfully
   - ✅ Console shows: "Gemini API not configured. Skipping AI enhancement."
   - ✅ PDF is generated with original content
   - ✅ No errors or crashes

## Testing With Gemini API

To test AI enhancement features:

1. Configure `.env.local` with valid API key
2. Upload a resume with weak bullet points (e.g., "Worked on projects")
3. Verify:
   - ✅ Processing takes slightly longer (API calls)
   - ✅ Generated PDF has improved bullet points
   - ✅ Bullet points include metrics and action verbs
   - ✅ Skills are properly categorized

## Common Test Scenarios

### Scenario 1: Standard Professional Resume
**File:** `test-files/sample-resume.txt`
**Expected:**
- ✅ All sections extracted correctly
- ✅ Contact info parsed
- ✅ Experience entries formatted properly
- ✅ Education section complete
- ✅ Skills categorized

### Scenario 2: Poorly Formatted Resume
**Test:** Upload a resume with inconsistent formatting
**Expected:**
- ✅ Best-effort parsing succeeds
- ✅ Generates valid PDF
- ✅ No crashes or errors

### Scenario 3: Minimal Resume
**Test:** Upload very short resume (student/entry-level)
**Expected:**
- ✅ Handles missing sections gracefully
- ✅ Generates clean PDF with available data

### Scenario 4: Large Resume
**Test:** Upload comprehensive multi-page resume
**Expected:**
- ✅ Multi-page PDF generated correctly
- ✅ Content doesn't overflow
- ✅ Proper page breaks

## Performance Testing

### File Processing Time
Expected processing times (varies by system):

- **Small resume (< 1 page):** 2-5 seconds
- **Medium resume (1-2 pages):** 5-10 seconds
- **Large resume (2+ pages):** 10-20 seconds
- **With AI enhancement:** +10-30 seconds (depends on API)

### Memory Usage
Monitor browser/server memory during processing:
- ✅ No memory leaks
- ✅ Resources cleaned up after processing

## Browser Compatibility Testing

Test in multiple browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Verify:
- File upload works
- Progress updates display correctly
- PDF download functions
- UI is responsive

## Mobile Testing

Test on mobile devices:
- ✅ Responsive layout
- ✅ Touch-friendly upload interface
- ✅ Progress indicator visible
- ✅ Download works on mobile browsers

## Error Handling Testing

### Test Invalid Inputs
1. **No file selected:** ❌ Should show error
2. **File too large (>5MB):** ❌ Should reject with message
3. **Invalid file type (.exe, .zip):** ❌ Should reject
4. **Corrupted file:** ❌ Should handle gracefully

### Test Network Issues
1. **Slow connection:** ✅ Progress updates should continue
2. **API timeout:** ✅ Should fallback gracefully

## Troubleshooting

### Build Fails
```bash
# Clean and reinstall
rm -rf node_modules .next
pnpm install
pnpm run build
```

### Tests Fail
```bash
# Check Node version (requires 18.17+)
node --version

# Update dependencies
pnpm update

# Re-run tests
pnpm test:run
```

### Upload Not Working
- Check browser console for errors
- Verify file size < 5MB
- Ensure file type is .txt, .pdf, or .docx

### PDF Not Generating
- Check server logs for Puppeteer errors
- Verify Puppeteer installed correctly: `pnpm list puppeteer`
- Try rebuilding: `pnpm run build`

### API Enhancement Not Working
- Verify `.env.local` exists with valid `GEMINI_API_KEY`
- Check console for API errors
- Verify API quota not exceeded
- Test with API disabled to confirm fallback works

## Success Criteria

✅ **All unit tests pass** (14/14)
✅ **Application builds successfully**
✅ **File upload works for all supported formats**
✅ **Progress tracking displays correctly**
✅ **PDF generation completes without errors**
✅ **Download functionality works**
✅ **Generated PDF is ATS-friendly and well-formatted**
✅ **Graceful handling when AI enhancement unavailable**
✅ **No console errors during normal operation**
✅ **Responsive design works on mobile**

## Next Steps

After successful testing:
1. ✅ Update `.gitignore` to exclude `.env.local`
2. ✅ Document API key setup in README
3. ✅ Add sample resumes for demo
4. ✅ Consider adding more file format support
5. ✅ Optimize Puppeteer performance
6. ✅ Add analytics/telemetry (optional)

---

**Last Updated:** Based on implementation as of 2025-11-10
