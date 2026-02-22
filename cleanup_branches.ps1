# Branch Cleanup Script for KairosCV
# Run from the repo root. Assumes 'main', 'develop', and 'backup/main-snapshot-2026-02-21' already exist.

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

Write-Host "=== Step 1: Fetch all remotes ===" -ForegroundColor Cyan
git fetch --all --prune

Write-Host "`n=== Step 2: Collect all remote branches to archive ===" -ForegroundColor Cyan
# Get all remote branch names (strip 'origin/' prefix), exclude the 3 keepers
$keepers = @("main", "develop", "backup/main-snapshot-2026-02-21", "HEAD")

$remoteBranches = git branch -r | ForEach-Object {
    $_.Trim() -replace "^origin/", "" -replace " -> .*", ""
} | Where-Object { $_ -and ($keepers -notcontains $_) }

Write-Host "Branches to archive:"
$remoteBranches | ForEach-Object { Write-Host "  - $_" }

Write-Host "`n=== Step 3: Create archive tags from remote refs ===" -ForegroundColor Cyan
foreach ($branch in $remoteBranches) {
    # Build a safe tag name: replace / and . and spaces with -
    $tagName = "archive/" + ($branch -replace "[/\.\s]", "-" -replace "--+", "-").Trim("-")
    $remoteBranchRef = $branch
    
    # Get the commit hash for this remote branch
    $hash = git rev-parse "origin/$remoteBranchRef" 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $hash) {
        Write-Host "  [SKIP] Could not resolve origin/$remoteBranchRef" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "  Tagging $tagName -> $hash"
    git tag $tagName $hash 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Tagged $tagName" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Tag may already exist: $tagName" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Step 4: Push all archive tags to remote ===" -ForegroundColor Cyan
git push origin --tags
Write-Host "[OK] Tags pushed" -ForegroundColor Green

Write-Host "`n=== Step 5: Delete archived branches from remote ===" -ForegroundColor Cyan
foreach ($branch in $remoteBranches) {
    Write-Host "  Deleting remote branch: $branch"
    git push origin --delete $branch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Deleted origin/$branch" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Could not delete origin/$branch (may not exist)" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Step 6: Delete archived local branches ===" -ForegroundColor Cyan
$localBranches = git branch | ForEach-Object { $_.Trim() -replace "^\* ", "" } | Where-Object {
    $_ -and ($keepers -notcontains $_)
}

Write-Host "Local branches to delete:"
$localBranches | ForEach-Object { Write-Host "  - $_" }

git checkout main 2>&1 | Out-Null

foreach ($branch in $localBranches) {
    Write-Host "  Deleting local branch: $branch"
    git branch -D $branch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK]" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Could not delete local branch $branch" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Done! Final branch state ===" -ForegroundColor Cyan
Write-Host "Remote branches:"
git branch -r

Write-Host "`nLocal branches:"
git branch

Write-Host "`nArchive tags:"
git tag | Where-Object { $_ -match "^archive/" }

Write-Host "`n[COMPLETE] Branch cleanup done." -ForegroundColor Green
