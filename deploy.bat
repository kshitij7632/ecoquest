@echo off
echo Creating deployment directory...
mkdir deploy 2>nul

echo Copying game files...
copy index.html deploy\
copy styles.css deploy\
copy game.js deploy\
copy sounds.js deploy\
copy README.md deploy\

echo Creating 404 page...
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>Page Not Found - EcoQuest^</title^>^<meta http-equiv="refresh" content="0;url=/"^>^</head^>^<body^>^<p^>Redirecting to EcoQuest...^</p^>^</body^>^</html^> > deploy\404.html

echo Creating robots.txt...
echo User-agent: *> deploy\robots.txt
echo Allow: />> deploy\robots.txt

echo.
echo Deployment files are ready in the 'deploy' folder!
echo.
echo To deploy to GitHub Pages:
echo 1. Go to https://github.com/new
echo 2. Create a new repository named 'ecoquest'
echo 3. Open the deploy folder
echo 4. Right-click and select 'Git Bash Here'
echo 5. Run these commands:
echo    git init
echo    git add .
echo    git commit -m "Initial deployment"
echo    git remote add origin https://github.com/YOUR_USERNAME/ecoquest.git
echo    git push -u origin main
echo 6. Go to repository Settings ^> Pages
echo 7. Select 'main' branch and click Save
echo.
echo Your game will be available at: https://YOUR_USERNAME.github.io/ecoquest
echo.
pause 