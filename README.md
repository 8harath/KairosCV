# KairosCV - AI-Powered Resume Enhancement Platform

Transform your resume with AI. Upload your PDF or DOCX, get a professionally formatted, job-tailored resume in seconds.

## 🚀 Features

- **File Upload**: Support for PDF and DOCX files
- **AI Processing**: Uses Google Gemini AI to analyze and optimize resume content
- **Section Filtering**: Automatically removes irrelevant sections and scores relevance
- **Content Optimization**: Rewrites content to be more impactful and ATS-friendly
- **PDF Generation**: Creates professional PDF resumes using Puppeteer
- **Job Tailoring**: Customize resume for specific job descriptions
- **Side-by-Side Comparison**: View original vs optimized resume
- **Modern UI**: Beautiful, responsive interface with dark mode support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API
- **PDF Generation**: Puppeteer
- **File Processing**: pdf-parse, mammoth
- **Authentication**: Firebase Auth (ready for implementation)
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
2. **MongoDB Atlas** account
3. **Google Gemini API** key
4. **Firebase** project (optional, for authentication)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd kairosCV
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kairos-cv

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Firebase Configuration (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to `.env.local`

### 5. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 6. Firebase Setup (Optional)

1. Create a Firebase project
2. Enable Authentication
3. Add your Firebase config to `.env.local`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## 📁 Project Structure

```
kairosCV/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── upload/        # File upload endpoint
│   │   ├── process/       # AI processing endpoint
│   │   ├── generate-pdf/  # PDF generation endpoint
│   │   └── resume/        # Resume CRUD operations
│   ├── upload/            # Upload page
│   ├── preview/           # Resume preview page
│   ├── comparison/        # Before/after comparison
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── mongodb.ts        # MongoDB connection
│   ├── gemini.ts         # AI processing logic
│   ├── pdf-generator.ts  # PDF generation
│   ├── file-processor.ts # File processing utilities
│   └── types.ts          # TypeScript type definitions
└── styles/               # Global styles
```

## 🔄 API Endpoints

### POST /api/upload
Upload and extract text from PDF/DOCX files.

**Request:**
- `file`: PDF or DOCX file
- `userId`: User identifier (optional)

**Response:**
```json
{
  "success": true,
  "resumeId": "string",
  "fileName": "string",
  "extractedText": "string",
  "message": "string"
}
```

### POST /api/process
Process resume with AI optimization.

**Request:**
```json
{
  "resumeId": "string",
  "jobDescription": "string" // optional
}
```

**Response:**
```json
{
  "success": true,
  "resumeId": "string",
  "processedResume": {
    "sections": [...],
    "summary": "string",
    "optimized": true
  }
}
```

### GET /api/generate-pdf?resumeId=xxx
Generate and download optimized PDF.

**Response:** PDF file download

### GET /api/resume?resumeId=xxx
Retrieve resume data.

**Response:**
```json
{
  "success": true,
  "resume": {
    "_id": "string",
    "userId": "string",
    "originalFileName": "string",
    "extractedText": "string",
    "processedResume": {...},
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env.local`

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `MONGODB_URI`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY` (if using Firebase)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 🧪 Testing

### Local Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test file upload:**
   - Navigate to `/upload`
   - Upload a PDF or DOCX file
   - Verify text extraction works

3. **Test AI processing:**
   - Check that the `/api/process` endpoint works
   - Verify Gemini API integration

4. **Test PDF generation:**
   - Test the `/api/generate-pdf` endpoint
   - Verify PDF downloads correctly

### Production Testing

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Test all endpoints in production**
3. **Verify environment variables are set correctly**
4. **Test file upload and processing flow**

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues:**
   - Verify your connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

2. **Gemini API Errors:**
   - Verify API key is correct
   - Check API quota limits
   - Ensure API is enabled in Google Cloud Console

3. **File Upload Issues:**
   - Check file size limits (10MB)
   - Verify file type is PDF or DOCX
   - Check server logs for errors

4. **PDF Generation Issues:**
   - Ensure Puppeteer dependencies are installed
   - Check Vercel function timeout settings
   - Verify HTML template generation

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 Development Notes

### Adding New Features

1. **New API Routes:** Add to `app/api/` directory
2. **New Components:** Add to `components/` directory
3. **New Pages:** Add to `app/` directory
4. **New Utilities:** Add to `lib/` directory

### Code Style

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for errors
4. Create an issue in the repository

## 🎯 Roadmap

- [ ] User authentication with Firebase
- [ ] Resume history and management
- [ ] Multiple resume templates
- [ ] Advanced job matching
- [ ] Resume analytics and insights
- [ ] Team collaboration features
- [ ] Mobile app development
