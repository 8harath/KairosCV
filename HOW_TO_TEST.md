# How to Test the PDF Extraction Fix

## Overview
The PDF extraction has been updated to be more robust and handle errors gracefully. The system will now work even if Gemini AI fails.

## What Was Fixed

1. **JSON Parsing Errors** - Now handles malformed responses gracefully
2. **Gemini AI Failures** - Returns fallback data if AI extraction fails
3. **Better Error Handling** - Extensive logging and graceful degradation
4. **Response Size Limits** - Prevents oversized responses from causing issues

## Testing Steps

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Upload a PDF Resume

1. Open your browser and go to `http://localhost:3000`
2. Click on the upload area or drag and drop a PDF file
3. Wait for processing to complete

### 3. Check Server Logs

You should see detailed logging in your terminal:

```
=== Upload API called ===
File received: sample-resume.pdf Size: 12345
Converting file to buffer...
Extracting text from file...
Extracted text length: 2345
Extracting structured data with Gemini...
=== Returning success response ===
```

### 4. Verify the Response

The response should include:
- `success: true`
- `resumeId: "..."` 
- `fileName: "sample-resume.pdf"`
- `extractedText: "..."` (first 1000 characters)
- `structuredData: {...}` (if Gemini succeeded) or fallback object

### 5. What to Look For

**Success Case:**
- No error messages in browser console
- Processing completes successfully
- Shows extracted information

**Partial Success (Gemini Fails):**
- Warning in server logs: "Failed to extract structured data with Gemini"
- Still shows fallback data with extracted text
- No JSON parsing errors

## Troubleshooting

### Issue: "JSON.parse: unexpected character at line 1 column 1"

This should now be fixed. If you still see this error:

1. Check server logs for the actual response
2. Look for any console errors in the browser
3. Verify the Content-Type header is being set correctly

### Issue: Gemini API Errors

The system will now gracefully handle these:
- Invalid API key
- API rate limits
- Malformed JSON responses
- Timeout errors

In all cases, the extracted text will still be shown.

## Expected Behavior

**Before the fix:**
- ❌ JSON parsing error crashes the app
- ❌ No data shown if Gemini fails
- ❌ Poor error messages

**After the fix:**
- ✅ Graceful error handling
- ✅ Always shows extracted text
- ✅ Clear error messages
- ✅ Detailed logging for debugging

## Next Steps

If everything works:
1. Test with different PDF types
2. Test with large files (up to 10MB)
3. Test the full flow to preview page
4. Test with DOCX files

## API Endpoints

### POST /api/upload
- Uploads and extracts text from PDF/DOCX
- Attempts Gemini extraction
- Returns fallback data if Gemini fails

### POST /api/process
- Processes resume with AI
- Returns fallback data if AI fails
- Always returns valid JSON

## Environment Variables

Make sure these are set:

```env
MONGODB_URI=your_mongodb_connection_string
```

The Gemini API key is currently hardcoded in `lib/gemini.ts`. For production, move this to an environment variable.

## Logging

All logs are prefixed with `===` to make them easy to find:
- `=== Upload API called ===`
- `=== Returning success response ===`
- `=== Upload error ===`

Check your terminal/console for these markers to track the flow.

