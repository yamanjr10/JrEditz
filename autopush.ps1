# Auto-commit and push script for JrEditz
Set-Location "C:\Users\Acer\webdevlopement\JrEditz"

git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-update: $timestamp"
git push origin main

Write-Host "✅ Auto-pushed changes to GitHub at $timestamp"
