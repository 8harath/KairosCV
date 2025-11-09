# 🚀 Quick Deploy Commands

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `kai-resume-enhancer`
3. **Do NOT initialize** with README
4. Click "Create repository"
5. Copy the repository URL

## Step 2: Push to GitHub

```bash
# Navigate to project
cd C:/Users/USER/kai

# Add GitHub remote (REPLACE with your URL)
git remote add origin https://github.com/YOUR_USERNAME/kai-resume-enhancer.git

# Push code
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select `kai-resume-enhancer`
5. **Environment Variables:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyDq3kph1f98FvpaGiigOY2p8mqHcFFe3OE`
6. Click "Deploy"
7. Wait 2-5 minutes
8. Done! 🎉

## That's it!

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.
