@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

cd Sistema420-2025-main
:: Clean installs everything so that there's less risk with dependencies updating.
echo Clean installing node_modules...
CALL npm ci
:: Generates the prisma tool from the schema.
echo Generating Prisma...
CALL npx prisma db pull --force
CALL npx prisma generate
:: Pre-builds the tailwind CSS to force the stylesheet to load.
echo Pre-building tailwindCSS...
CALL npx tailwindcss -i ./styles/index.css -o ./public/tailwind.css
:: Builds the app for use in production.
CALL npm run build
:: Adds the app daemon to pm2.
set /p newport=What's the desired localhost port? 
echo Adding process to pm2...
CALL pm2 delete sys420
CALL pm2 start node_modules/next/dist/bin/next --name "sys420" -- start -p !newport!
CALL pm2 save
PAUSE