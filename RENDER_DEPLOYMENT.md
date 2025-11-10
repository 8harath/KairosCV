# Render Deployment Configuration Guide

This document contains all the configurations and steps needed to deploy the KairosCV Next.js application to Render.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Render Service Configuration](#render-service-configuration)
3. [Deployment Steps](#deployment-steps)
4. [Environment Variables](#environment-variables)
5. [Build Configuration](#build-configuration)
6. [Runtime Configuration](#runtime-configuration)
7. [Health Checks](#health-checks)
8. [File Storage Considerations](#file-storage-considerations)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to Render, ensure you have:

- A GitHub account with your repository pushed
- A Render account (free tier available at [render.com](https://render.com))
- Node.js 18.17 or later (automatically configured by Render)

## Render Service Configuration

### Option 1: Using render.yaml (Recommended)

The repository includes a `render.yaml` file that automatically configures the service. Render will use this file when you connect your GitHub repository.

**Key Configuration:**
- **Service Type:** Web Service
- **Runtime:** Node.js
- **Build Command:** `corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm run build`
- **Start Command:** `pnpm start`
- **Health Check Path:** `/api/health`
- **Node Version:** 18.17+ (auto-detected)
- **Port:** 10000 (Render automatically assigns and provides via PORT env var)

### Option 2: Manual Configuration via Dashboard

If you prefer to configure manually through the Render dashboard, or if Render isn't detecting `render.yaml`:

1. **Service Type:** Select "Web Service"
2. **Environment:** Select "Node"
3. **Build Command:** 
   ```
   corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile && pnpm run build
   ```
   **Important:** Include `--no-frozen-lockfile` to allow pnpm to update the lockfile if needed.
4. **Start Command:** 
   ```
   pnpm start
   ```
5. **Plan:** Free (or upgrade as needed)

### If render.yaml is Not Being Used

If your service was created before `render.yaml` existed, or Render isn't auto-detecting it:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service (e.g., `kairoscv`)
3. Click on **Settings** in the left sidebar
4. Scroll to **Build & Deploy** section
5. Update the **Build Command** to:
   ```
   corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile && pnpm run build
   ```
6. Update the **Start Command** to:
   ```
   pnpm start
   ```
7. Set **Health Check Path** to: `/api/health`
8. Click **Save Changes**
9. Trigger a new deploy: Click **Manual Deploy** → **Deploy latest commit**

## Deployment Steps

### Step 1: Connect GitHub Repository

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select the repository: `kairosCV`
5. Render will automatically detect the `render.yaml` file

### Step 2: Configure Service Settings

If using `render.yaml`, Render will auto-populate:
- **Name:** `kairoscv` (you can change this)
- **Region:** Oregon (you can change this)
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (root of repo)
- **Environment:** Node

### Step 3: Review Environment Variables

The `render.yaml` sets:
- `NODE_ENV=production`

**Note:** `PORT` is automatically set by Render - you don't need to configure it. Next.js will automatically use `process.env.PORT` when available.

You can add additional environment variables if needed (see [Environment Variables](#environment-variables)).

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will start the build process
3. Monitor the build logs for any issues
4. Once deployed, your app will be available at: `https://kairoscv.onrender.com` (or your custom domain)

## Environment Variables

Currently, no additional environment variables are required. The application uses:
- `NODE_ENV` - Set to `production` in render.yaml
- `PORT` - Set by Render automatically (Next.js uses this automatically, no code changes needed)

### Adding Future Environment Variables

If you need to add environment variables in the future (e.g., API keys, database URLs):

**Via Dashboard:**
1. Go to your service → Environment
2. Click "Add Environment Variable"
3. Add key-value pairs

**Via render.yaml:**
```yaml
envVars:
  - key: YOUR_KEY
    value: your_value
    sync: false  # Prevents syncing sensitive values
```

**Note:** For sensitive values, use Render's Secrets feature or set them via the dashboard rather than committing them to `render.yaml`.

## Build Configuration

### Build Command Breakdown

The build command does the following:
1. `corepack enable` - Enables Corepack (Node.js package manager manager)
2. `corepack prepare pnpm@latest --activate` - Prepares and activates pnpm
3. `pnpm install --no-frozen-lockfile` - Installs all dependencies (allows lockfile updates if needed)
4. `pnpm run build` - Builds the Next.js application

**Note:** The `--no-frozen-lockfile` flag is used to allow pnpm to update the lockfile during build if needed. For production, ensure `pnpm-lock.yaml` is committed and up-to-date to avoid lockfile mismatches.

### Node.js Version

The application specifies Node.js version requirements in `package.json`:
```json
"engines": {
  "node": ">=18.17.0",
  "pnpm": ">=8.0.0"
}
```

Render will automatically use a compatible Node.js version (typically 18.x or 20.x LTS).

### Build Process

- **Dependencies:** All dependencies from `package.json` are installed
- **Build Output:** Next.js creates `.next` directory with optimized production build
- **Build Time:** Typically 3-5 minutes for free tier

### Troubleshooting Build Issues

If the build fails:
1. Check build logs in Render dashboard
2. Verify Node.js version compatibility (requires 18.17+)
3. Ensure all dependencies are listed in `package.json`
4. Check for TypeScript errors (currently ignored via `ignoreBuildErrors: true` in `next.config.mjs`)

#### Lockfile Mismatch Error

**Error:** `ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile"`

**Cause:** The `pnpm-lock.yaml` file is out of sync with `package.json`. This happens when dependencies are added/modified but the lockfile wasn't regenerated.

**Solutions:**

1. **Regenerate lockfile locally (Recommended):**
   ```bash
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "Update pnpm-lock.yaml"
   git push
   ```

2. **Use --no-frozen-lockfile (Already configured):**
   - The build command in `render.yaml` includes `--no-frozen-lockfile` to allow lockfile updates during build
   - This is a temporary solution; best practice is to keep the lockfile in sync

3. **If Render ignores render.yaml (Most Common Issue):**
   
   **Symptoms:** Build logs show `pnpm install --frozen-lockfile` instead of your custom build command from `render.yaml`
   
   **Cause:** Service was created manually or Render isn't auto-detecting `render.yaml`
   
   **Solution:** Manually update the build command in Render dashboard:
   1. Go to Render Dashboard → Your Service → **Settings** → **Build & Deploy**
   2. Replace the **Build Command** with:
      ```
      corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile && pnpm run build
      ```
   3. Ensure **Start Command** is: `pnpm start`
   4. Click **Save Changes**
   5. Click **Manual Deploy** → **Deploy latest commit**

## Runtime Configuration

### Start Command

The application starts with:
```bash
pnpm start
```

This runs `next start` which:
- Serves the production build from `.next` directory
- Starts on port specified by `PORT` environment variable
- Optimizes for production performance

### Port Configuration

- Render automatically provides `PORT` environment variable
- Next.js automatically uses `process.env.PORT` or defaults to 3000
- No additional configuration needed

### Memory and CPU

**Free Tier Limits:**
- 512 MB RAM
- 0.5 CPU
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds (cold start)

**Upgrade Options:**
- Starter Plan: 512 MB RAM, shared CPU, no spin-down
- Standard Plans: Higher resources, dedicated CPU

## Health Checks

### Health Check Endpoint

The service uses `/api/health` for health checks:

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "message": "Resume Optimizer API is running"
}
```

### Health Check Configuration

Configured in `render.yaml`:
```yaml
healthCheckPath: /api/health
```

Render will:
- Check this endpoint every 30 seconds
- Mark service as unhealthy if it fails
- Restart service if unhealthy for extended period

## File Storage Considerations

### ⚠️ Important: Ephemeral Filesystem

Render's filesystem is **ephemeral**, meaning:
- Files written to disk are **lost** when the service restarts
- Files are **not persisted** between deployments
- Uploaded resumes and generated PDFs will be deleted on restart

### Current Implementation Impact

The application currently stores files in:
- `uploads/` - Uploaded resume files
- `uploads/generated/` - Generated PDF files

**This will NOT work reliably on Render** because:
1. Files disappear on restart
2. Files are not shared across multiple instances (if scaled)
3. No persistent storage

### Recommended Solutions

**Option 1: Use External Storage (Recommended for Production)**
- **AWS S3** - Object storage for files
- **Cloudinary** - Media storage and processing
- **Supabase Storage** - Simple object storage
- **Render Disk** - Persistent disk (paid feature)

**Option 2: In-Memory Processing (Temporary)**
- Process files immediately without saving
- Return files directly in response
- Not suitable for long-running processing

**Option 3: Database Storage**
- Store file metadata in database
- Use external storage for actual files
- Implement file cleanup routines

### For MVP/Testing

For initial deployment and testing:
- The current implementation will work for **single-use processing**
- Files remain available during the request lifecycle
- Generated PDFs can be downloaded immediately after generation
- Files are lost if service restarts between upload and download

**Recommendation:** Implement external storage before production use.

## Troubleshooting

### Service Won't Start

**Symptoms:** Service shows as "Build Successful" but won't start

**Solutions:**
1. Check service logs for startup errors
2. Verify `startCommand` is correct: `pnpm start`
3. Ensure `.next` directory was created during build
4. Check if port is correctly configured (should use `PORT` env var)

### Build Fails

**Symptoms:** Build process fails with errors

**Common Issues:**
1. **pnpm not found:** Ensure Corepack is enabled in build command
2. **Node version:** Verify Node.js 18.17+ is being used
3. **Dependencies:** Check for missing or incompatible dependencies
4. **TypeScript errors:** Currently ignored, but check logs for warnings

**Solutions:**
- Review full build logs in Render dashboard
- Test build locally: `pnpm install && pnpm run build`
- Ensure `package.json` is valid

### Health Check Failing

**Symptoms:** Service marked as unhealthy

**Solutions:**
1. Verify `/api/health` endpoint is accessible
2. Check that route handler returns 200 status
3. Review service logs for errors
4. Test endpoint manually: `curl https://your-service.onrender.com/api/health`

### Slow Response Times

**Symptoms:** First request takes 30-60 seconds

**Cause:** Free tier service spins down after inactivity

**Solutions:**
1. This is expected behavior on free tier
2. Upgrade to Starter plan for no spin-down
3. Use a service like UptimeRobot to ping your service periodically

### Files Not Persisting

**Symptoms:** Uploaded files disappear

**Cause:** Ephemeral filesystem

**Solutions:**
1. Implement external storage (see [File Storage Considerations](#file-storage-considerations))
2. Process and return files immediately in single request
3. Upgrade to Render Disk for persistent storage

### Port Already in Use

**Symptoms:** Error about port being in use

**Solutions:**
- Next.js automatically uses `process.env.PORT`
- Don't hardcode port numbers
- Render provides PORT automatically

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Corepack Documentation](https://nodejs.org/api/corepack.html)
- [pnpm Documentation](https://pnpm.io/)

## Support

If you encounter issues not covered here:
1. Check Render service logs
2. Review Next.js build output
3. Test locally with production build: `pnpm run build && pnpm start`
4. Consult Render support or Next.js documentation

---

**Last Updated:** Based on Next.js 16.0.0 and Render free tier configuration

