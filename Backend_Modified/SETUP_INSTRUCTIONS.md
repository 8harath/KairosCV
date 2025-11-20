# Backend Setup Instructions

**Date:** November 20, 2025
**Version:** 1.0 (No Authentication)
**Status:** Ready for Testing

---

## Prerequisites

- **Python:** 3.11+ (tested with 3.12.1)
- **LaTeX:** TeX Live 2023+ (for PDF generation)
- **Google Cloud:** Vertex AI account with service account credentials

---

## Step 1: Virtual Environment Setup

The virtual environment is already created and has all dependencies installed.

```bash
cd Backend_Modified

# Activate virtual environment
source venv/bin/activate

# Verify installation
pip list | grep fastapi
# Should show: fastapi==0.115.12
```

---

## Step 2: Groq API Setup (FREE)

### 2.1 Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up/Login (completely free, no credit card required)
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy your API key

### 2.2 Configure Environment Variables

Edit the `.env` file and add your Groq API key:

```bash
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=llama-3.3-70b-versatile
```

**Note:** Get your free API key from [Groq Console](https://console.groq.com/keys).

**Available Models:**
- `llama-3.3-70b-versatile` (Recommended - Best quality)
- `llama-3.1-8b-instant` (Faster, lower quality)
- `mixtral-8x7b-32768` (Good balance)

---

## Step 3: Verify Setup

```bash
# Activate virtual environment
source venv/bin/activate

# Test imports
python3 -c "from main import app; print('✅ Imports successful')"

# If you see errors about VERTEX_AI_PROJECT, that's expected
# The app won't start without valid credentials, but imports should work
```

---

## Step 4: Start the Server

```bash
# Activate virtual environment
source venv/bin/activate

# Start with uvicorn
python3 main.py

# Or manually:
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

Server will start at: `http://localhost:8080`

---

## Step 5: Test Endpoints

### Health Check
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "message": "API is running!"
}
```

### Convert JSON to LaTeX PDF
```bash
curl -X POST http://localhost:8080/convert-json-to-latex \
  -H "Content-Type: application/json" \
  -d @sample_resume.json
```

Expected response:
```json
{
  "message": "Resume converted successfully from JSON.",
  "resume_link": "/download/resume_XXXXXX.pdf",
  "pdf_filename": "resume_XXXXXX.pdf"
}
```

### Download PDF
```bash
curl http://localhost:8080/download/resume_XXXXXX.pdf \
  --output resume.pdf
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| POST | `/tailor` | Tailor resume to job description | No |
| POST | `/convert-latex` | Convert resume file to LaTeX PDF | No |
| POST | `/convert-json-to-latex` | Convert JSON to LaTeX PDF | No |
| GET | `/download/{filename}` | Download generated PDF | No |

---

## Directory Structure

```
Backend_Modified/
├── main.py                 # FastAPI application
├── models.py               # Pydantic data models
├── prompts.py              # AI prompts and LaTeX template
├── resume_processor.py     # LangChain + Vertex AI logic
├── latex_converter.py      # LaTeX → PDF conversion
├── latex_utils.py          # LaTeX helper functions
├── utils.py                # File parsing utilities
├── .env                    # Configuration (YOU MUST EDIT THIS)
├── requirements.txt        # Python dependencies
├── sample_resume.json      # Sample test data
├── venv/                   # Virtual environment (ready)
├── unused/                 # Removed auth files
├── generated_pdfs/         # Output PDFs (created automatically)
└── latex_output/           # Temporary LaTeX files (created automatically)
```

---

## Troubleshooting

### Error: "VERTEX_AI_PROJECT environment variable not set"

**Solution:** Edit `.env` and set `VERTEX_AI_PROJECT=your-project-id`

### Error: "Could not initialize model"

**Causes:**
1. Invalid service account credentials
2. Vertex AI API not enabled in your GCP project
3. Service account lacks permissions

**Solution:**
1. Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
2. Enable Vertex AI API: `gcloud services enable aiplatform.googleapis.com`
3. Grant **Vertex AI User** role to service account

### Error: "pdflatex: command not found"

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-extra

# macOS
brew install mactex
```

### PDFs not generating

**Check:**
1. `latex_output/` directory permissions
2. `generated_pdfs/` directory exists
3. LaTeX compilation logs in `latex_output/*.log`

---

## Testing Without Vertex AI

If you don't have Vertex AI credentials yet, you can still test:

1. **Import validation** ✅ Works
2. **Health endpoint** ✅ Works
3. **PDF generation** ❌ Requires Vertex AI

To test locally without Vertex AI, you would need to:
- Mock the LangChain calls
- Or provide pre-generated LaTeX content

---

## Production Deployment

### Environment Variables (Render/Heroku)

Set these in your deployment platform:

```
GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
VERTEX_AI_PROJECT=your-project-id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-flash-001
PORT=8080
HOST=0.0.0.0
```

### Install LaTeX on Render

Add to `render.yaml`:

```yaml
buildCommand: |
  apt-get update
  apt-get install -y texlive-latex-base texlive-latex-extra
  pip install -r requirements.txt
```

---

## Next Steps

1. ✅ Set up Google Cloud Vertex AI account
2. ✅ Create service account and download credentials
3. ✅ Update `.env` with your project ID
4. ✅ Start the server
5. ✅ Test with `sample_resume.json`
6. ✅ Verify PDF generation works
7. ✅ Deploy to production (optional)

---

## Support

**Documentation:**
- [PROGRESS_LOG.md](./PROGRESS_LOG.md) - Development progress
- [BACKEND_MODIFICATIONS.md](../BACKEND_MODIFICATIONS.md) - Code changes

**Issues:**
- Check `latex_output/*.log` for LaTeX errors
- Check server console for Python errors
- Verify all environment variables are set

---

**Last Updated:** November 20, 2025
**Tested With:** Python 3.12.1, FastAPI 0.115.12, TeX Live 2023
