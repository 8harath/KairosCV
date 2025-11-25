#!/bin/bash

# KairosCV Branch Organization Script
# This script renames branches according to the new naming convention
# IMPORTANT: Review the script before running!

set -e  # Exit on error

echo "=========================================="
echo "KairosCV Branch Organization Script"
echo "=========================================="
echo ""
echo "This script will:"
echo "1. Rename branches to follow feature/* convention"
echo "2. Archive old personal branches"
echo "3. Delete merged Claude AI experiment branches"
echo ""
read -p "Do you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "=========================================="
echo "Phase 1: Renaming Active Development Branches"
echo "=========================================="

# Function to rename branch (local and remote)
rename_branch() {
    local old_name=$1
    local new_name=$2

    echo ""
    echo "Renaming: $old_name -> $new_name"

    # Check if local branch exists
    if git show-ref --verify --quiet refs/heads/$old_name; then
        git branch -m $old_name $new_name
        echo "  ✓ Renamed local branch"
    else
        echo "  - Local branch not found, skipping"
    fi

    # Check if remote branch exists
    if git show-ref --verify --quiet refs/remotes/origin/$old_name; then
        git push origin :$old_name
        git push origin $new_name
        git branch --set-upstream-to=origin/$new_name $new_name
        echo "  ✓ Renamed remote branch"
    else
        echo "  - Remote branch not found, skipping"
    fi
}

# Rename active development branches
rename_branch "bharath-013" "feature/html-to-pdf-pipeline"
rename_branch "bharath-012" "feature/gemini-structured-extraction"
rename_branch "bharath-011" "bugfix/mongodb-objectid-handling"
rename_branch "bharath-001" "experiment/puppeteer-fallback"
rename_branch "remote-02" "feature/visual-extraction-merge"
rename_branch "remote-01" "feature/gemini-api-upgrade"
rename_branch "backend-integration-no-auth" "feature/groq-integration"

echo ""
echo "=========================================="
echo "Phase 2: Archiving Personal Development Branches"
echo "=========================================="

# Archive old personal branches
rename_branch "lochan-01" "archive/lochan/pdf-extraction-fix"
rename_branch "kai" "archive/kai/vercel-deployment"
rename_branch "phase-1" "archive/phase-1/simplified-upload"
rename_branch "RD" "archive/rd/backend-architecture"

echo ""
echo "=========================================="
echo "Phase 3: Deleting Merged Branches"
echo "=========================================="

# Function to delete branch (local and remote)
delete_branch() {
    local branch_name=$1

    echo ""
    echo "Deleting: $branch_name"

    # Delete local branch if exists
    if git show-ref --verify --quiet refs/heads/$branch_name; then
        git branch -D $branch_name 2>/dev/null || echo "  - Could not delete local branch (might be current branch)"
    fi

    # Delete remote branch if exists
    if git show-ref --verify --quiet refs/remotes/origin/$branch_name; then
        git push origin :$branch_name 2>/dev/null || echo "  - Could not delete remote branch"
        echo "  ✓ Deleted remote branch"
    else
        echo "  - Remote branch not found"
    fi
}

# Delete integration branch (already merged)
delete_branch "main-remote02-integration"

# Delete Claude AI experiment branches
echo ""
echo "Deleting Claude AI experiment branches..."
delete_branch "claude/add-loading-animation-01KwZFcqHgsPYdHL5FARADCT"
delete_branch "claude/brutalist-redesign-01SESbYKeEv1CXyjDn2p7hua"
delete_branch "claude/capstone-presentation-prep-014rGkMENeQVgax2RMqYQYaC"
delete_branch "claude/capstone-presentation-prep-01ToFVpvV56sguTpDak6n4fh"
delete_branch "claude/create-readme-01J8VUCfA1i2nvaASEtE5MFX"
delete_branch "claude/deployment-options-research-011CUjHdovksttKShJiLWy4M"
delete_branch "claude/document-final-application-purpose-011CUitZvy8Qu3ECxbAmXBpq"
delete_branch "claude/fix-pdf-extraction-011CUiurLmfvdSWRmE6WEjV4"
delete_branch "claude/redesign-interface-neobrutalism-01LTVUgPGiNjnYKx1XK33pPF"

echo ""
echo "=========================================="
echo "Phase 4: Cleanup Complete"
echo "=========================================="
echo ""
echo "Running git fetch --prune to clean up remote references..."
git fetch --prune

echo ""
echo "Current branch structure:"
git branch -a | grep -E "feature/|bugfix/|experiment/|archive/|main" | sort

echo ""
echo "=========================================="
echo "✓ Branch organization complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Active features: feature/*"
echo "  - Bug fixes: bugfix/*"
echo "  - Experiments: experiment/*"
echo "  - Archived: archive/*"
echo ""
echo "Next steps:"
echo "  1. Review the changes with: git branch -a"
echo "  2. Update your local checkout: git fetch --all"
echo "  3. Inform team members about the new branch names"
echo ""
