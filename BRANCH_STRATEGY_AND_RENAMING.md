# Branch Strategy & Renaming Plan - KairosCV

## 📊 Current Branch Analysis

### Existing Branches
```
main           - Production-ready code (current base)
bharath-001    - First development iteration
bharath-011    - Eleventh iteration
bharath-012    - Twelfth iteration
bharath-013    - Current: HTML-to-PDF implementation (ACTIVE)
phase-1        - Phase 1 development work
```

### Problems with Current Naming
1. **Non-descriptive**: Names like "bharath-011" don't indicate what features they contain
2. **Hard to track**: Can't tell which branch does what without checking code
3. **No context**: New team members won't understand branch purpose
4. **Sequential naming**: Creates unnecessary numbering that doesn't scale
5. **Multiple naming schemes**: "bharath-*" vs "phase-*" is inconsistent

---

## 🎯 New Branch Naming Convention

### Convention Format
```
<type>/<short-description>

Types:
- feature/    New features or major enhancements
- bugfix/     Bug fixes
- experiment/ Experimental work, proof of concepts
- release/    Release preparation branches
- hotfix/     Urgent production fixes
- docs/       Documentation updates
- refactor/   Code refactoring without behavior changes
```

### Examples
```
feature/gemini-integration        ✅ Clear: Adding Gemini API
feature/html-pdf-generation       ✅ Clear: HTML-to-PDF feature
bugfix/file-upload-validation     ✅ Clear: Fix upload issues
experiment/latex-vs-puppeteer     ✅ Clear: Comparing approaches
release/v1.0.0                    ✅ Clear: Version 1.0 release
hotfix/memory-leak-puppeteer      ✅ Clear: Critical fix
docs/api-documentation            ✅ Clear: API docs update
refactor/parser-architecture      ✅ Clear: Restructure parsing
```

---

## 🔄 Branch Renaming Strategy

### Recommended Renaming Plan

| Current Branch | Keep/Rename | New Name | Reason |
|---------------|-------------|----------|--------|
| `main` | **KEEP** | `main` | Standard convention |
| `bharath-001` | **RENAME** | `experiment/initial-prototype` | First iteration/POC |
| `bharath-011` | **ARCHIVE** | N/A | Merge or delete if obsolete |
| `bharath-012` | **ARCHIVE** | N/A | Merge or delete if obsolete |
| `bharath-013` | **KEEP** | `bharath-013` | Currently active branch |
| `phase-1` | **RENAME** | `release/phase-1-mvp` | Phase 1 milestone |

### Detailed Recommendations

#### 1. `main` - KEEP AS IS
**Status:** Production branch ✅
**Action:** None
**Reason:** Standard convention, already correct

---

#### 2. `bharath-001` → `experiment/initial-prototype`
**Current State:** Unknown content
**Recommended Action:**
```bash
# Check if branch has unique commits
git log main..bharath-001 --oneline

# If has valuable commits:
git branch -m bharath-001 experiment/initial-prototype
git push origin experiment/initial-prototype
git push origin --delete bharath-001

# If merged or obsolete:
git branch -D bharath-001
git push origin --delete bharath-001
```

**Why Rename:**
- "bharath-001" is non-descriptive
- "experiment/initial-prototype" indicates it's early exploratory work
- Makes it clear this is historical, not active development

---

#### 3. `bharath-011` → ARCHIVE or DELETE
**Recommended Action:**
```bash
# Check branch status
git log main..bharath-011 --oneline
git diff main...bharath-011

# Option A: If has unmerged valuable work
git checkout main
git merge bharath-011
git branch -D bharath-011
git push origin --delete bharath-011

# Option B: If obsolete
git branch -D bharath-011
git push origin --delete bharath-011

# Option C: If uncertain, archive as tag
git tag archive/bharath-011 bharath-011
git push origin archive/bharath-011
git branch -D bharath-011
git push origin --delete bharath-011
```

**Reason:**
- Multiple numbered branches (001, 011, 012, 013) suggest these are iterations
- Likely only the latest (013) is relevant
- Old branches create clutter and confusion

---

#### 4. `bharath-012` → ARCHIVE or DELETE
**Same process as bharath-011**

**Questions to Answer:**
1. Does bharath-012 have code that bharath-013 doesn't?
2. Was work from bharath-012 merged to main?
3. Are there any open PRs or references to this branch?

If yes to any: Merge or tag for archive
If no to all: Delete

---

#### 5. `bharath-013` → KEEP (Current Active Branch)
**Current State:** HTML-to-PDF implementation ✅
**Action:** Keep current name for now
**Future Action:** After work is complete, merge to main and delete

**Reason:**
- Currently active development branch
- Renaming active branch causes coordination issues
- Better to finish work, merge to main, then start new branches with new convention

**Alternative (if branch is long-lived):**
```bash
# If branch will continue for weeks, consider renaming
git branch -m bharath-013 feature/html-pdf-generation
git push origin feature/html-pdf-generation
git push origin --delete bharath-013

# Update local tracking
git branch --set-upstream-to=origin/feature/html-pdf-generation feature/html-pdf-generation
```

---

#### 6. `phase-1` → `release/phase-1-mvp`
**Recommended Action:**
```bash
# Check if phase-1 is a milestone snapshot
git log main..phase-1 --oneline

# If it's a release candidate:
git branch -m phase-1 release/phase-1-mvp
git push origin release/phase-1-mvp
git push origin --delete phase-1

# Tag the release
git tag v1.0.0-phase1 release/phase-1-mvp
git push origin v1.0.0-phase1
```

**Reason:**
- "phase-1" suggests a milestone/release
- "release/phase-1-mvp" makes purpose explicit
- Tagging provides permanent marker

---

## 🚀 Implementation Steps

### Step 1: Audit All Branches (Priority: HIGH)
```bash
# List all branches with last commit
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) | %(committerdate:short) | %(subject)'

# Check which branches are merged to main
git branch --merged main
git branch --no-merged main

# Check remote branches
git branch -r
```

**Create a spreadsheet:**
| Branch | Last Commit | Merged? | Has Unique Code? | Decision |
|--------|-------------|---------|------------------|----------|
| main | 2025-11-10 | N/A | N/A | Keep |
| bharath-001 | ? | ? | ? | ? |
| bharath-011 | ? | ? | ? | ? |
| bharath-012 | ? | ? | ? | ? |
| bharath-013 | 2025-11-10 | No | Yes | Keep (active) |
| phase-1 | ? | ? | ? | ? |

---

### Step 2: Communicate with Team (Priority: HIGH)
**Before renaming anything**, notify all collaborators:

**Email/Slack Template:**
```
Subject: Branch Renaming Strategy - Action Required

Team,

We're implementing a new branch naming convention to improve clarity:

OLD CONVENTION:
❌ bharath-001, bharath-011, phase-1

NEW CONVENTION:
✅ feature/<description>
✅ bugfix/<description>
✅ experiment/<description>
✅ release/<version>

ACTIONS REQUIRED:
1. Finish work on bharath-013 (current)
2. Merge or archive bharath-001, bharath-011, bharath-012
3. All new branches use new convention

TIMELINE:
- Nov 10: Audit branches (Bharath)
- Nov 11: Archive old branches
- Nov 12: New convention starts

Questions? Reply to this thread.
```

---

### Step 3: Clean Up Old Branches (Priority: MEDIUM)

**For each old branch:**
```bash
# 1. Check if merged
git branch --merged main | grep bharath

# 2. If merged, safe to delete
git branch -d bharath-001
git push origin --delete bharath-001

# 3. If not merged, check if valuable
git log main..bharath-001 --oneline
git diff main...bharath-001

# 4. If valuable, merge or tag
# Option A: Merge
git checkout main
git merge bharath-001
git push origin main

# Option B: Tag for archive
git tag archive/bharath-001 bharath-001
git push origin archive/bharath-001

# 5. Delete branch
git branch -D bharath-001
git push origin --delete bharath-001
```

---

### Step 4: Update CI/CD (Priority: MEDIUM)

**If using CI/CD, update branch protection rules:**

**GitHub Example:**
```yaml
# .github/workflows/ci.yml
on:
  push:
    branches:
      - main
      - 'feature/**'
      - 'bugfix/**'
      - 'release/**'
  pull_request:
    branches:
      - main
```

**Branch Protection Rules:**
```
main:
  - Require PR reviews (2 approvers)
  - Require status checks to pass
  - Require branches to be up to date
  - No force push
  - No deletions

feature/**, bugfix/**:
  - Require PR reviews (1 approver)
  - Require status checks to pass

release/**:
  - Require PR reviews (2 approvers)
  - Require all checks to pass
  - Require linear history
```

---

### Step 5: Document New Convention (Priority: HIGH)

**Update README.md:**
```markdown
## Branch Naming Convention

We use a structured branch naming scheme:

### Format
`<type>/<short-description>`

### Types
- `feature/` - New features (e.g., `feature/gemini-integration`)
- `bugfix/` - Bug fixes (e.g., `bugfix/upload-error`)
- `experiment/` - Experiments (e.g., `experiment/latex-vs-html`)
- `release/` - Releases (e.g., `release/v1.0.0`)
- `hotfix/` - Urgent fixes (e.g., `hotfix/memory-leak`)
- `docs/` - Documentation (e.g., `docs/api-guide`)

### Examples
```bash
# Create feature branch
git checkout -b feature/add-templates main

# Create bugfix branch
git checkout -b bugfix/parsing-error main

# Create release branch
git checkout -b release/v1.0.0 main
```

### Workflow
1. Create branch from `main` with appropriate prefix
2. Make changes and commit regularly
3. Push to remote: `git push -u origin feature/your-feature`
4. Open PR to `main`
5. After merge, delete branch
```

---

## 🎯 Recommended Branch Structure

### Active Development Branches
```
main                              # Production code
├── feature/gemini-integration    # AI enhancement
├── feature/multiple-templates    # Template system
├── bugfix/puppeteer-memory       # Memory fix
└── docs/api-documentation        # API docs
```

### Long-Term Branches (Minimal)
```
main                              # Production
release/v1.0.0                    # Release prep (temporary)
```

### Archived (as tags)
```
archive/bharath-001               # Historical
archive/phase-1-initial           # Historical
```

---

## 📋 Branch Lifecycle

### Feature Branch Lifecycle
```
1. CREATE:    git checkout -b feature/new-thing main
2. DEVELOP:   git commit -m "feat: add feature"
3. PUSH:      git push -u origin feature/new-thing
4. PR:        Open PR to main
5. REVIEW:    Code review by team
6. MERGE:     Merge to main (squash or merge commit)
7. DELETE:    git branch -d feature/new-thing
              git push origin --delete feature/new-thing
```

**Maximum Branch Lifetime:** 2 weeks
**Reason:** Reduces merge conflicts, keeps work focused

---

## 🚨 Emergency Protocols

### Hotfix Process
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Fix and test
# ... make changes ...
git commit -m "hotfix: fix critical issue"

# 3. Fast-track merge
git checkout main
git merge hotfix/critical-issue --no-ff
git push origin main

# 4. Tag release
git tag v1.0.1
git push origin v1.0.1

# 5. Clean up
git branch -d hotfix/critical-issue
```

---

## 📊 Success Metrics

### After implementing new convention:
- [ ] All active branches follow new naming
- [ ] Old branches archived or deleted
- [ ] Team trained on new convention
- [ ] Documentation updated
- [ ] CI/CD configured for new branches
- [ ] No confusion about branch purposes
- [ ] Faster PR reviews (clear branch names)

---

## 🔧 Git Aliases (Optional)

Add to `~/.gitconfig`:
```ini
[alias]
    # Create feature branch
    feature = "!f() { git checkout -b feature/$1 main; }; f"

    # Create bugfix branch
    bugfix = "!f() { git checkout -b bugfix/$1 main; }; f"

    # Create experiment branch
    experiment = "!f() { git checkout -b experiment/$1 main; }; f"

    # List branches by type
    features = "!git branch | grep feature/"
    bugfixes = "!git branch | grep bugfix/"

    # Clean up merged branches
    cleanup = "!git branch --merged main | grep -v 'main' | xargs -r git branch -d"
```

**Usage:**
```bash
# Instead of: git checkout -b feature/new-thing main
git feature new-thing

# Instead of: git checkout -b bugfix/fix-upload main
git bugfix fix-upload

# List all feature branches
git features

# Delete all merged branches
git cleanup
```

---

## 🎯 Action Plan for Bharath (Primary Developer)

### This Week (Nov 10-16)

**Day 1: Audit**
- [ ] Run `git for-each-ref` to see all branches
- [ ] Check each branch: `git log main..branch-name`
- [ ] Determine which branches to keep/archive/delete
- [ ] Fill out decision spreadsheet

**Day 2: Communicate**
- [ ] Send email to team about new convention
- [ ] Get confirmation from collaborators
- [ ] Schedule brief sync meeting

**Day 3: Clean Up**
- [ ] Archive bharath-001, bharath-011, bharath-012 (tag or delete)
- [ ] Rename phase-1 to release/phase-1-mvp (if relevant)
- [ ] Keep bharath-013 as-is (currently active)

**Day 4: Document**
- [ ] Update README.md with branch convention
- [ ] Create CONTRIBUTING.md with workflow
- [ ] Update this document with actual decisions

**Day 5: Train**
- [ ] Brief 15-min training for collaborators
- [ ] Share examples of good branch names
- [ ] Answer questions

---

## 📝 Decision Log

### Decisions Made (Update as you go)

**Date:** 2025-11-10
**Decision:** Adopt `<type>/<description>` convention
**Rationale:** Clear, scalable, industry-standard
**Team Consensus:** Pending

**Date:** 2025-11-10
**Decision:** Keep bharath-013 as-is until merge
**Rationale:** Active development, avoid disruption
**Team Consensus:** Approved

**Date:** _TBD_
**Decision:** Archive/Delete bharath-001, 011, 012
**Rationale:** _To be determined after audit_
**Team Consensus:** Pending

---

## 🔗 References

- **GitHub Flow:** https://guides.github.com/introduction/flow/
- **Git Branch Naming:** https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4
- **Semantic Versioning:** https://semver.org/

---

**Document Version:** 1.0
**Created:** November 10, 2025
**Author:** KairosCV Team
**Status:** Awaiting Implementation
**Next Review:** After branch audit complete
