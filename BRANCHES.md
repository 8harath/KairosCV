# Branch Strategy – KairosCV

This document describes the Git branch structure for the KairosCV project.

> Last updated: 2026-02-21

---

## Active Branches

| Branch | Purpose | Notes |
|--------|---------|-------|
| `main` | 🚀 **Production** | Always stable and deployable. Only merge tested code here. |
| `develop` | 🧪 **Feature Testing** | Branch off here for new features. Merge back after testing. |
| `backup/main-snapshot-2026-02-21` | 💾 **Backup Snapshot** | Frozen snapshot of `main` as of 2026-02-21. Do not modify. |

---

## Working with Branches

### Starting a new feature
```bash
git checkout develop
git checkout -b feature/your-feature-name
# ... do your work ...
git push origin feature/your-feature-name
# Open a PR into develop when ready
```

### Releasing to production
```bash
# After testing on develop, merge into main
git checkout main
git merge develop
git push origin main
```

### Creating a new backup snapshot
```bash
git checkout main
git checkout -b backup/main-snapshot-YYYY-MM-DD
git push origin backup/main-snapshot-YYYY-MM-DD
```

---

## Archived Branches (recovered via Git Tags)

The following branches were archived on 2026-02-21 and are available as Git tags.  
Their full commit history is preserved and can be restored at any time.

| Archive Tag | Original Branch | Description |
|-------------|-----------------|-------------|
| `archive/feature-visual-extraction-merge` | `feature/visual-extraction-merge` | Visual extraction + merge work |
| `archive/feature-groq-integration` | `feature/groq-integration` | Groq LLM API integration |
| `archive/feature-gemini-api-upgrade` | `feature/gemini-api-upgrade` | Gemini API upgrade |
| `archive/feature-gemini-structured-extraction` | `feature/gemini-structured-extraction` | Gemini structured data extraction |
| `archive/archive-kai-vercel-deployment` | `archive/kai/vercel-deployment...action-mergection` | Kai's Vercel deployment + action merge |
| `archive/archive-lochan-pdf-extraction-fix` | `archive/lochan/pdf-extraction-fix` | Lochan's PDF extraction fix |
| `archive/archive-phase-1-simplified-upload` | `archive/phase-1/simplified-upload` | Phase 1 simplified upload flow |
| `archive/archive-rd-backend-architecture` | `archive/rd/backend-architecture` | RD's backend architecture work |
| `archive/bugfix-mongodb-objectid-handling` | `bugfix/mongodb-objectid-handling` | MongoDB ObjectID handling fix |
| `archive/experiment-puppeteer-fallback` | `experiment/puppeteer-fallback` | Puppeteer fallback experiment |

### How to restore an archived branch
```bash
# List all archive tags
git tag | grep archive/

# Restore a branch from a tag
git fetch --tags
git checkout -b feature/branch-name archive/tag-name

# Example: restore the Groq integration branch
git checkout -b feature/groq-integration archive/feature-groq-integration
git push origin feature/groq-integration
```

---

## Branch Protection Guidelines

- **`main`**: Never push directly. Always merge via PR after review.
- **`develop`**: Use as integration branch; all feature branches should target this.
- **`backup/*`**: Treat as read-only snapshots.
