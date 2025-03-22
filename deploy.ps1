# Create deployment directory
New-Item -ItemType Directory -Force -Path "deploy"

# Copy game files
Copy-Item "index.html" -Destination "deploy/"
Copy-Item "styles.css" -Destination "deploy/"
Copy-Item "game.js" -Destination "deploy/"
Copy-Item "sounds.js" -Destination "deploy/"
Copy-Item "README.md" -Destination "deploy/"

# Create 404 page
@"
<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found - EcoQuest</title>
    <meta http-equiv="refresh" content="0;url=/">
</head>
<body>
    <p>Redirecting to EcoQuest...</p>
</body>
</html>
"@ | Out-File -FilePath "deploy/404.html" -Encoding UTF8

# Create robots.txt
@"
User-agent: *
Allow: /
"@ | Out-File -FilePath "deploy/robots.txt" -Encoding UTF8

Write-Host "Deployment files prepared in the 'deploy' directory"
Write-Host "To deploy to GitHub Pages:"
Write-Host "1. Create a new repository on GitHub"
Write-Host "2. Initialize git in the deploy directory:"
Write-Host "   cd deploy"
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial deployment'"
Write-Host "3. Add your GitHub repository as remote:"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
Write-Host "4. Push to GitHub:"
Write-Host "   git push -u origin main"
Write-Host "5. Enable GitHub Pages in repository settings" 