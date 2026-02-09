@echo off

cd C:/Users/ASUS/Desktop/22/nav-site


set fix_message="Auto commit by shell script"

:: Execute git commands
git pull
git add --all
git commit -m %fix_message%
git push

:: Output result
echo Auto commit by shell script


