# Branch Renaming Quick Reference

**Last Updated:** November 25, 2025

---

## Quick Lookup Table

### Active Development Branches

| OLD NAME | ➜ | NEW NAME | STATUS |
|----------|---|----------|--------|
| `bharath-013` | ➜ | `feature/html-to-pdf-pipeline` | 🟢 Active |
| `bharath-012` | ➜ | `feature/gemini-structured-extraction` | 🟢 Active |
| `bharath-011` | ➜ | `bugfix/mongodb-objectid-handling` | 🟢 Active |
| `bharath-001` | ➜ | `experiment/puppeteer-fallback` | 🟡 Testing |
| `remote-02` | ➜ | `feature/visual-extraction-merge` | 🟢 Active |
| `remote-01` | ➜ | `feature/gemini-api-upgrade` | 🟢 Active |
| `backend-integration-no-auth` | ➜ | `feature/groq-integration` | 🟢 Active |

### Archived Branches

| OLD NAME | ➜ | NEW NAME | STATUS |
|----------|---|----------|--------|
| `lochan-01` | ➜ | `archive/lochan/pdf-extraction-fix` | 📦 Archived |
| `kai` | ➜ | `archive/kai/vercel-deployment` | 📦 Archived |
| `phase-1` | ➜ | `archive/phase-1/simplified-upload` | 📦 Archived |
| `RD` | ➜ | `archive/rd/backend-architecture` | 📦 Archived |

### Deleted Branches

| OLD NAME | REASON | STATUS |
|----------|--------|--------|
| `main-remote02-integration` | Merged to main | 🗑️ Deleted |
| `claude/add-loading-animation-*` | Merged | 🗑️ Deleted |
| `claude/brutalist-redesign-*` | Merged | 🗑️ Deleted |
| `claude/capstone-presentation-prep-*` | Completed | 🗑️ Deleted |
| `claude/create-readme-*` | Merged | 🗑️ Deleted |
| `claude/deployment-options-research-*` | Completed | 🗑️ Deleted |
| `claude/document-final-application-purpose-*` | Completed | 🗑️ Deleted |
| `claude/fix-pdf-extraction-*` | Merged | 🗑️ Deleted |
| `claude/redesign-interface-neobrutalism-*` | Merged | 🗑️ Deleted |

---

## One-Liner Commands

### Update Your Local Repository
```bash
git fetch --all --prune && git branch -a
```

### Switch to Renamed Branch
```bash
# If you were on bharath-013:
git checkout feature/html-to-pdf-pipeline

# If you were on bharath-012:
git checkout feature/gemini-structured-extraction

# If you were on bharath-011:
git checkout bugfix/mongodb-objectid-handling
```

### View All Feature Branches
```bash
git branch -a | grep "feature/"
```

### View All Archived Branches
```bash
git branch -a | grep "archive/"
```

---

## Migration Execution

### Run Migration
```bash
cd /workspaces/KairosCV
./scripts/organize-branches.sh
```

### Verify Changes
```bash
git branch -a | grep -E "feature/|bugfix/|experiment/|archive/"
```

---

## Summary Statistics

- **Total branches renamed:** 11
- **Total branches deleted:** 10
- **Active feature branches:** 5
- **Active bugfix branches:** 1
- **Experimental branches:** 1
- **Archived branches:** 4

---

**Need more details?** See `BRANCH_MIGRATION.md`
