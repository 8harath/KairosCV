# Branch Organization Migration Guide

**Date:** November 25, 2025
**Status:** Ready for Execution
**Team Members:** Bharath, Lochan, Kai

---

## Overview

This document outlines the migration from the current inconsistent branch naming to a standardized convention that follows software engineering best practices.

### Why This Migration?

1. **Consistency:** Unclear naming (bharath-001, remote-02, RD) makes it hard to understand branch purposes
2. **Scalability:** As the team grows, standardized naming prevents confusion
3. **Best Practices:** Follows industry conventions (feature/*, bugfix/*, etc.)
4. **Cleanup:** Removes 9+ merged Claude AI experiment branches cluttering the repo

---

## New Branch Naming Convention

Following the conventions outlined in `CLAUDE.md`:

```
main               - Production-ready code (protected)
feature/*          - New features (e.g., feature/gemini-integration)
bugfix/*           - Bug fixes (e.g., bugfix/parsing-error)
experiment/*       - Experimental work (e.g., experiment/latex-alternative)
release/*          - Release preparation (e.g., release/v1.0)
archive/*          - Old branches kept for reference
```

---

## Complete Branch Mapping

### 1. Active Development Branches (TO BE RENAMED)

| Old Name | New Name | Description | Last Activity |
|----------|----------|-------------|---------------|
| `bharath-013` | `feature/html-to-pdf-pipeline` | HTML-to-PDF implementation with Puppeteer | Active |
| `bharath-012` | `feature/gemini-structured-extraction` | Gemini AI structured data extraction | Active |
| `bharath-011` | `bugfix/mongodb-objectid-handling` | MongoDB ObjectId conversion fixes | Active |
| `bharath-001` | `experiment/puppeteer-fallback` | Puppeteer fallback mechanisms | Testing |
| `remote-02` | `feature/visual-extraction-merge` | Visual extraction + intelligent merging | Active |
| `remote-01` | `feature/gemini-api-upgrade` | Gemini model version upgrade | Active |
| `backend-integration-no-auth` | `feature/groq-integration` | Groq API integration (no authentication) | Active |

**Total: 7 branches to rename**

---

### 2. Personal Development Branches (TO BE ARCHIVED)

| Old Name | New Name | Description | Status |
|----------|----------|-------------|--------|
| `lochan-01` | `archive/lochan/pdf-extraction-fix` | PDF extraction improvements | Completed |
| `kai` | `archive/kai/vercel-deployment` | Initial Vercel deployment setup | Completed |
| `phase-1` | `archive/phase-1/simplified-upload` | Phase 1 MVP with simplified upload | Completed |
| `RD` | `archive/rd/backend-architecture` | Backend architecture experiments | Completed |

**Total: 4 branches to archive**

---

### 3. Integration Branches (TO BE DELETED)

| Old Name | Reason | Status |
|----------|--------|--------|
| `main-remote02-integration` | Already merged into main (commit 09a4643b) | Delete |

**Total: 1 branch to delete**

---

### 4. Claude AI Experiment Branches (TO BE DELETED)

These branches were created by Claude Code for specific tasks and have been merged:

| Old Name | Purpose | Status |
|----------|---------|--------|
| `claude/add-loading-animation-01KwZFcqHgsPYdHL5FARADCT` | Loading animation feature | Merged ✓ |
| `claude/brutalist-redesign-01SESbYKeEv1CXyjDn2p7hua` | Brutalist UI redesign | Merged ✓ |
| `claude/capstone-presentation-prep-014rGkMENeQVgax2RMqYQYaC` | Capstone presentation | Completed ✓ |
| `claude/capstone-presentation-prep-01ToFVpvV56sguTpDak6n4fh` | Capstone presentation v2 | Completed ✓ |
| `claude/create-readme-01J8VUCfA1i2nvaASEtE5MFX` | README documentation | Merged ✓ |
| `claude/deployment-options-research-011CUjHdovksttKShJiLWy4M` | Deployment research | Completed ✓ |
| `claude/document-final-application-purpose-011CUitZvy8Qu3ECxbAmXBpq` | Documentation | Completed ✓ |
| `claude/fix-pdf-extraction-011CUiurLmfvdSWRmE6WEjV4` | PDF extraction fix | Merged ✓ |
| `claude/redesign-interface-neobrutalism-01LTVUgPGiNjnYKx1XK33pPF` | Neobrutalism redesign | Merged ✓ |

**Total: 9 branches to delete**

---

## Migration Plan

### Pre-Migration Checklist

- [ ] Ensure all team members are aware of the migration
- [ ] Backup current branch state: `git branch -a > branches-backup.txt`
- [ ] Ensure no one is actively pushing to branches being renamed
- [ ] Review the script: `cat scripts/organize-branches.sh`

### Execution Steps

#### Step 1: Backup Current State
```bash
# Create a backup of current branch information
git branch -a > branch-backup-$(date +%Y%m%d).txt
git log --all --decorate --oneline --graph > git-log-backup-$(date +%Y%m%d).txt
```

#### Step 2: Run Migration Script
```bash
# Navigate to project root
cd /workspaces/KairosCV

# Make script executable (if not already)
chmod +x scripts/organize-branches.sh

# Execute the script
./scripts/organize-branches.sh
```

**What the script does:**
1. Asks for confirmation before proceeding
2. Renames all active development branches (local + remote)
3. Archives personal development branches
4. Deletes merged integration branches
5. Deletes Claude AI experiment branches
6. Runs `git fetch --prune` to clean up stale references
7. Displays the new branch structure

#### Step 3: Verify Changes
```bash
# Check new branch structure
git branch -a

# Verify specific branches exist
git show-ref | grep "feature/"
git show-ref | grep "archive/"
```

#### Step 4: Update Local Checkouts
```bash
# Each team member should run:
git fetch --all --prune
git branch -a

# If you were on a renamed branch, switch to the new name:
git checkout feature/html-to-pdf-pipeline  # (was bharath-013)
```

---

## Team Member Impact

### For Bharath (Primary Developer)
**Branches affected:**
- `bharath-013` → `feature/html-to-pdf-pipeline` ⚠️
- `bharath-012` → `feature/gemini-structured-extraction`
- `bharath-011` → `bugfix/mongodb-objectid-handling`
- `bharath-001` → `experiment/puppeteer-fallback`

**Action required:**
```bash
git fetch --all --prune
git checkout feature/html-to-pdf-pipeline  # Your current working branch
```

### For Lochan
**Branches affected:**
- `lochan-01` → `archive/lochan/pdf-extraction-fix` ⚠️

**Action required:**
```bash
git fetch --all --prune
# If you need to access old work:
git checkout archive/lochan/pdf-extraction-fix
```

### For Kai
**Branches affected:**
- `kai` → `archive/kai/vercel-deployment` ⚠️

**Action required:**
```bash
git fetch --all --prune
# If you need to access old work:
git checkout archive/kai/vercel-deployment
```

---

## Post-Migration Checklist

### Immediate (Within 1 hour)
- [ ] All team members run `git fetch --all --prune`
- [ ] Update any open PRs to use new branch names
- [ ] Update CI/CD pipelines if they reference old branch names
- [ ] Verify Render.com still deploys from `main` (no change needed)

### Within 24 hours
- [ ] Update any documentation referencing old branch names
- [ ] Update project management tools (Trello, Jira, etc.) with new names
- [ ] Notify external collaborators of the change

### Within 1 week
- [ ] Archive or delete local branches on each developer's machine
- [ ] Update team onboarding documentation

---

## Rollback Plan

If something goes wrong, you can rollback using the backup:

```bash
# View backup
cat branch-backup-YYYYMMDD.txt

# Manually recreate branches if needed
git branch old-branch-name commit-hash
git push origin old-branch-name
```

**Note:** Git commits are never deleted, only branch pointers are renamed. All history is preserved.

---

## New Workflow Examples

### Creating a New Feature
```bash
# Create from main
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# Work on feature...
git commit -m "feat: implement JWT authentication"

# Push to remote
git push -u origin feature/user-authentication
```

### Creating a Bug Fix
```bash
git checkout main
git pull origin main
git checkout -b bugfix/pdf-parsing-error

# Fix bug...
git commit -m "fix: handle malformed PDF headers"
git push -u origin bugfix/pdf-parsing-error
```

### Experimental Work
```bash
git checkout -b experiment/latex-pdf-generation

# Try new approach...
git commit -m "experiment: test LaTeX-based PDF generation"
git push -u origin experiment/latex-pdf-generation
```

---

## Branch Lifecycle

### Active Development
```
feature/* ──┐
bugfix/*  ──┼──> Pull Request ──> Code Review ──> Merge to main ──> Delete branch
experiment/*┘
```

### Archival
```
Completed branch ──> Rename to archive/* ──> Keep for reference (no further commits)
```

### Deletion Criteria
- ✅ Delete: Branch merged into main AND PR closed
- ✅ Delete: Experiment concluded with negative results (document findings first)
- ✅ Delete: Duplicate work merged from another branch
- ❌ Keep: Work in progress
- ❌ Keep: Referenced in open issues/PRs
- ❌ Keep: Contains unique historical context

---

## FAQ

### Q: What if I have uncommitted changes on a renamed branch?
**A:** Your uncommitted changes are safe. Git only renames the branch pointer, not your working directory. After the rename, your changes will still be there.

### Q: Will this affect open Pull Requests?
**A:** GitHub automatically updates PR branch references when you rename branches. However, manually verify and update PR titles/descriptions if they reference old names.

### Q: Can I still access old commit history?
**A:** Yes! All commits are preserved. Only branch names change. Use `git log` to view history.

### Q: What if I'm in the middle of a merge on a renamed branch?
**A:** Complete your merge before running the script, or use `git merge --abort` to cancel the merge, then rerun after migration.

### Q: Do I need to re-clone the repository?
**A:** No! Just run `git fetch --all --prune` to update your local references.

---

## Statistics

**Total branches in repository:** 25
**Branches to rename:** 7
**Branches to archive:** 4
**Branches to delete:** 10
**Branches unchanged:** 4 (main + 3 remote archives)

**Estimated execution time:** 5-10 minutes
**Team coordination time:** 1-2 hours

---

## Approval Sign-off

Before executing this migration, all team members should review and approve:

- [ ] Bharath (Primary Developer) - Approved on: ___________
- [ ] Lochan (Team Member) - Approved on: ___________
- [ ] Kai (Team Member) - Approved on: ___________

---

## Contact & Support

**Questions?** Contact Bharath (primary developer)
**Issues during migration?** Run `git branch -a > current-state.txt` and share with team

**Script location:** `/workspaces/KairosCV/scripts/organize-branches.sh`
**This document:** `/workspaces/KairosCV/BRANCH_MIGRATION.md`

---

**Last Updated:** November 25, 2025
**Version:** 1.0
**Status:** Ready for Team Review
