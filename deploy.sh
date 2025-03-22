#!/bin/bash

# Create a temporary directory for deployment
mkdir -p deploy

# Copy game files to deployment directory
cp index.html deploy/
cp styles.css deploy/
cp game.js deploy/
cp sounds.js deploy/
cp README.md deploy/

# Create a simple 404 page
echo '<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found - EcoQuest</title>
    <meta http-equiv="refresh" content="0;url=/">
</head>
<body>
    <p>Redirecting to EcoQuest...</p>
</body>
</html>' > deploy/404.html

# Create a simple robots.txt
echo 'User-agent: *
Allow: /' > deploy/robots.txt

echo "Deployment files prepared in the 'deploy' directory"
echo "To deploy to GitHub Pages:"
echo "1. Create a new repository on GitHub"
echo "2. Initialize git in the deploy directory:"
echo "   cd deploy"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial deployment'"
echo "3. Add your GitHub repository as remote:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "4. Push to GitHub:"
echo "   git push -u origin main"
echo "5. Enable GitHub Pages in repository settings" 