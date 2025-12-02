# Auto-commit and push script for JrEditz (fully automatic)
Set-Location "C:\Users\Acer\webdevlopement\JrEditz"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host ""
Write-Host "Starting auto-push at $timestamp"

# Step 0: Stage all changes
git add .

# Step 1: Commit automatically if there are changes
$changes = git status --porcelain

if ($changes) {
    Write-Host "Changes detected — committing..."
    git commit -m "Auto-update: $timestamp"
} else {
    Write-Host "No changes to commit."
}

# Step 2: Pull latest changes with rebase
Write-Host "Pulling latest updates with rebase..."
git pull --rebase origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Git pull failed. Attempting to continue..."
}

# Step 3: Push everything to GitHub
Write-Host "Pushing to GitHub..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully auto-pushed at $timestamp"
} else {
    Write-Host "ERROR: Push failed."
}

Write-Host "Auto-push process complete."
Write-Host ""
