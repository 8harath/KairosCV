# Troubleshooting Upload Errors

## Latest Fixes Applied

I've added comprehensive error handling to track down the "Upload failed - server error" issue. Here's what was fixed:

### 1. Form Data Parsing
- Added try-catch around form data parsing
- Better error messages if form data is malformed

### 2. File Buffer Conversion
- Added try-catch around buffer creation
- Logs buffer size for debugging

### 3. Text Extraction
- Added try-catch around PDF/DOCX text extraction
- Clear error if file is corrupted or unsupported

### 4. MongoDB Connection
- Added try-catch around database operations
- System works even if MongoDB is down (returns temp ID)

### 5. Response Headers
- Explicitly sets Content-Type as application/json
- Prevents JSON parsing errors

## How to Debug

### 1. Check Server Logs

Look for these markers in your terminal:
- `=== Upload API called ===`
- `File received: [filename] Size: [size]`
- `Buffer created successfully, size: [size]`
- `Extracted text length: [length]`
- `=== Returning success response ===`

Or if there's an error:
- `=== Upload error ===`

### 2. Check Browser Console

Open DevTools (F12) and look for:
- Any red error messages
- Network tab showing the response
- Check the Response tab for actual server response

### 3. Common Errors and Solutions

#### Error: "Failed to parse form data"
- **Cause**: Malformed request or server issue
- **Solution**: Check if file is actually being sent

#### Error: "Failed to extract text from file"
- **Cause**: Corrupted PDF or unsupported format
- **Solution**: Try a different PDF file, check if it opens in PDF reader

#### Error: "Failed to save to MongoDB"
- **Cause**: Database connection issue
- **Solution**: Check MongoDB connection string in `lib/mongodb.ts`
- **Note**: System will still work with a temp ID

#### Error: JSON parsing in browser
- **Cause**: Server returned non-JSON response
- **Solution**: Check server logs to see what was actually returned

## Testing Steps

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12)

3. **Upload a test PDF** and watch:
   - Network tab for the request
   - Console for any errors
   - Terminal for server logs

4. **Check the response**:
   - Should see `{success: true, ...}`
   - No JSON parsing errors

## What Each Fix Does

### Better Error Messages
Now each error includes:
- `success: false` for errors
- `error: "description"`
- `details: "specific error"`

### Graceful Degradation
- Works even if MongoDB fails (returns temp ID)
- Works even if Gemini fails (returns extracted text)
- Always returns valid JSON

### Extensive Logging
Every step logs to console:
```
=== Upload API called ===
File received: test.pdf Size: 12345
Converting file to buffer...
Buffer created successfully, size: 12345
Extracting text from file...
Extracted text length: 2345
...
```

## Next Steps

If you still get errors after restarting the server:

1. **Check terminal output** - Look for the detailed logs
2. **Copy the error message** - Should now have more details
3. **Share the server log output** - Will help identify the exact issue

## Quick Test

Try uploading a simple PDF and check your terminal for output like:
```
=== Upload API called ===
File received: resume.pdf Size: 45678
Converting file to buffer...
Buffer created successfully, size: 45678
Extracting text from file...
Extracted text length: 3456
...
=== Returning success response ===
```

If you see these logs, the server is working correctly. If you don't see them, the request might not be reaching the server.

## Expected Terminal Output

When working correctly:
```
✓ Ready in X seconds
✓ Local: http://localhost:3000
POST /api/upload 200 in 1234ms
```

When there's an error:
```
POST /api/upload 500 in 123ms
=== Upload error === [error details]
```

