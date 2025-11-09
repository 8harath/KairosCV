# Kai MVP - Setup Guide

## Quick Start

### 1. Add Your Gemini API Key

Edit `server/.env` and replace `your_gemini_api_key_here` with your actual Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Get a Gemini API key:**
- Go to https://makersuite.google.com/app/apikey
- Create or sign in to your Google account
- Click "Create API Key"
- Copy the key and paste it in your `.env` file

### 2. Start the Backend Server

Open a terminal and run:

```bash
cd server
npm run dev
```

Server will start at: http://localhost:5000

### 3. Start the Frontend

Open a **new terminal** and run:

```bash
cd client
npm run dev
```

Frontend will start at: http://localhost:5173

### 4. Use the Application

1. Open http://localhost:5173 in your browser
2. Click to upload a PDF resume
3. Click "Enhance Resume"
4. Wait for AI processing (may take 10-30 seconds)
5. Preview your enhanced resume
6. Click "Download PDF" to get your new resume

## Troubleshooting

### "Failed to enhance resume" Error
- Make sure you've added a valid Gemini API key in `server/.env`
- Check that the server console for specific error messages

### File Upload Issues
- Ensure the file is a PDF
- Check file size is under 5MB
- Make sure the `uploads/` directory exists

### CORS Errors
- Verify both frontend and backend are running
- Check that ports 5000 and 5173 are not in use by other apps

## Project Structure

```
kai/
├── client/                 # React frontend (Vite + Tailwind)
│   └── src/
│       ├── App.jsx        # Main application
│       ├── components/    # ResumePreview component
│       └── services/      # API calls
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── middleware/        # File upload middleware
│   ├── routes/           # API routes
│   ├── services/         # PDF parsing, Gemini AI, PDF generation
│   └── .env              # Environment variables (ADD YOUR API KEY HERE)
└── uploads/              # Temporary file storage
```

## Next Steps

After testing the MVP, you can:
- Add more resume templates
- Improve the AI prompts
- Add user accounts
- Deploy to production
- Add analytics and feedback

Enjoy using Kai!
