# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps: install production + dev dependencies with pnpm
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS deps

# Install pnpm via corepack (matches the engine constraint in package.json)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifests first so Docker can cache this layer
COPY package.json pnpm-lock.yaml ./

# Install all deps — mount pnpm store as a build cache so repeated
# builds reuse the downloaded tarballs without re-downloading them.
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — builder: compile Next.js
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Bring in installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json  ./package.json

# Copy the full source (minus what .dockerignore excludes)
COPY . .

# Build arguments for public env vars that must be baked at build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_DISABLE_AUTH=true
ARG NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_DISABLE_AUTH=$NEXT_PUBLIC_DISABLE_AUTH \
    NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=$NEXT_PUBLIC_ENABLE_DEBUG_TOOLS \
    # Disable Next.js telemetry inside CI/Docker
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — runner: minimal production image with Chromium for Puppeteer
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS runner

# OCI standard image metadata
LABEL org.opencontainers.image.title="KairosCV" \
      org.opencontainers.image.description="AI-powered resume optimization platform" \
      org.opencontainers.image.source="https://github.com/8harath/KairosCV" \
      org.opencontainers.image.licenses="MIT"

# ── System dependencies for Puppeteer / Chromium ──────────────────────────
# These are the packages required by Chrome headless on Debian/Ubuntu slim.
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxtst6 \
    wget \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the system Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PORT=3000

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd  --system --uid 1001 --gid nodejs nextjs

# Copy built assets from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public

# Copy HTML templates (needed at runtime by the template renderer)
COPY --from=builder --chown=nextjs:nodejs /app/lib/templates  ./lib/templates

# Uploads directory — will be mounted as a volume; create with correct owner
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

# Docker-native health check — docker ps shows health status without compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=25s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# next start is provided by the standalone output's server.js
CMD ["node", "server.js"]
