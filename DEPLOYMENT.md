# KairosCV Deployment Guide

## Overview

This guide covers deploying KairosCV to Render.com. The application consists of a Next.js frontend with integrated resume optimization features.

## Prerequisites

1. **GitHub Account** - Repository must be pushed to GitHub
2. **Render.com Account** - Sign up at https://render.com
3. **Google Gemini API Key** - Get from https://ai.google.dev

## Deployment Steps

### 1. Push Code to GitHub

```bash
# Ensure you're on the correct branch
git checkout main-remote02-integration

# Push to GitHub
git push origin main-remote02-integration

# Or merge to main and push
git checkout main
git merge main-remote02-integration
git push origin main
```

### 2. Deploy to Render.com

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the branch (`main` or `main-remote02-integration`)
5. Render will automatically detect `render.yaml`
6. Click **"Apply"**

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** kairoscv-frontend
   - **Environment:** Node
   - **Region:** Oregon (or closest to you)
   - **Branch:** main
   - **Build Command:**
     ```bash
     corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile && pnpm build
     ```
   - **Start Command:**
     ```bash
     pnpm start
     ```
   - **Plan:** Free

### 3. Configure Environment Variables

In Render dashboard, go to your service → **Environment** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Already set in render.yaml |
| `GOOGLE_GEMINI_API_KEY` | `your_api_key_here` | Get from https://ai.google.dev |

### 4. Set Up Health Check

- **Health Check Path:** `/api/health`
- Already configured in `render.yaml`

### 5. Deploy

1. Click **"Create Web Service"** or **"Apply"**
2. Render will start building and deploying
3. Monitor the logs for any errors
4. Once deployed, you'll get a URL like: `https://kairoscv-frontend.onrender.com`

## Post-Deployment

### Verify Deployment

1. Visit your Render URL
2. Check health endpoint: `https://your-app.onrender.com/api/health`
3. Test file upload functionality
4. Verify resume optimization works

### Monitor Application

- Check Render logs for errors
- Monitor performance metrics in Render dashboard
- Set up alerts for downtime (Render Pro plan)

## Environment Variables Reference

### Frontend (.env.local for local development)

```bash
# Google Gemini API for AI enhancement
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Node environment
NODE_ENV=development
```

## Troubleshooting

### Build Fails

**Issue:** `pnpm: command not found`
**Solution:** Ensure build command includes corepack setup:
```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

**Issue:** `Module not found` errors
**Solution:**
- Check `package.json` for missing dependencies
- Run `pnpm install` locally to verify
- Clear Render cache and redeploy

### Runtime Errors

**Issue:** Application crashes on start
**Solution:**
- Check Render logs for error messages
- Verify all environment variables are set
- Ensure Node version is 18.17.0 or higher

**Issue:** AI features not working
**Solution:**
- Verify `GOOGLE_GEMINI_API_KEY` is set correctly
- Check API key has proper permissions
- Review API quota limits

### Performance Issues

**Issue:** Slow cold starts (Free plan)
**Solution:**
- Free tier spins down after inactivity
- Upgrade to paid plan for persistent instances
- Consider implementing a keep-alive ping

**Issue:** File upload timeouts
**Solution:**
- Check file size limits
- Verify upload endpoint timeout settings
- Review Render request timeout (30s on free tier)

## Scaling Considerations

### Free Tier Limitations

- **RAM:** 512 MB
- **Request Timeout:** 30 seconds
- **Spin Down:** After 15 minutes of inactivity
- **Build Time:** 10 minutes max

### Upgrade Options

For production use, consider:
- **Starter Plan ($7/month):**
  - No spin down
  - Faster builds
  - More RAM

- **Standard Plan ($25/month):**
  - Higher performance
  - Priority support
  - Custom domains

## Security Best Practices

1. **Never commit** `.env` files to git
2. **Rotate API keys** periodically
3. **Use environment variables** for all secrets
4. **Enable HTTPS** (automatic on Render)
5. **Monitor logs** for suspicious activity

## Updating the Application

### Deploy New Changes

```bash
# Make changes locally
git add .
git commit -m "feat: your changes"
git push origin main

# Render auto-deploys from connected branch
```

### Manual Redeploy

1. Go to Render dashboard
2. Click **"Manual Deploy"**
3. Select branch
4. Click **"Deploy"**

## Support

- **Render Documentation:** https://render.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Google Gemini API:** https://ai.google.dev/docs

## Costs

- **Render Free Tier:** $0/month (with limitations)
- **Google Gemini API:** Free tier available (check current limits)
- **Total Monthly Cost:** $0-7+ depending on plan

---

**Last Updated:** November 2025
**Version:** 1.0
**Branch:** main-remote02-integration
