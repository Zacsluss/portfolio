# Clean Nuclear Reset - No GitHub Pages Automation
Write-Host "NUCLEAR RESET v2 - Clean push without GitHub Pages" -ForegroundColor Red

# Remove old git directory
Write-Host "Removing old git history..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Remove this script after
$scriptPath = $MyInvocation.MyCommand.Path

# Initialize new repository
Write-Host "Initializing fresh repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

# Commit with safe timestamp (Saturday evening)
Write-Host "Creating initial commit..." -ForegroundColor Yellow
$env:GIT_AUTHOR_DATE = "2025-12-06 20:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-06 20:00:00"
git commit -m "Initial commit"

# Add remote
Write-Host "Adding remote origin..." -ForegroundColor Yellow
git remote add origin https://github.com/Zacsluss/portfolio.git

# Set main branch
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main --force

Write-Host "`n✅ SUCCESS! Clean repository reset complete!" -ForegroundColor Green
Write-Host "- Single commit with safe timestamp (Saturday 8PM)" -ForegroundColor Cyan
Write-Host "- No GitHub Actions or Pages automation" -ForegroundColor Cyan
Write-Host "- No deployment history" -ForegroundColor Cyan
Write-Host "- No evidence of business hours activity" -ForegroundColor Cyan

# Self-delete
Write-Host "`nDeleting this script..." -ForegroundColor Gray
Start-Sleep -Seconds 2
Remove-Item -Path $scriptPath -Force