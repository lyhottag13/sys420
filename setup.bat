@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

cd Sistema420-2025-main
:: Clean installs everything so that there's less risk with dependencies updating.
echo Clean installing node_modules...
CALL npm.cmd ci
:: Generates the prisma tool from the schema.
echo Generating Prisma...
CALL npx prisma db pull --force
CALL npx prisma generate
:: Pre-builds the tailwind CSS to force the stylesheet to load.
echo Pre-building tailwindCSS...
CALL npx tailwindcss -i ./style.css -o ./public/tailwind.css
CALL npm run build
:: Adds the app daemon to pm2.
set /p newport=What's the desired localhost port?
echo Generating web.config and adding process to pm2...
echo ^<?xml version="1.0" encoding="UTF-8"?^> > web.config
echo ^<configuration^> >> web.config
echo  ^<system.webServer^> >> web.config
echo  ^<rewrite^> >> web.config
echo  ^<rules^> >> web.config
echo  ^<rule name="ReverseProxyInboundRule1" stopProcessing="true"^> >> web.config
echo  ^<match url="(.*)" /^> >> web.config
echo  ^<action type="Rewrite" url="http://localhost:!newport!/{R:1}" /^> >> web.config
echo  ^</rule^> >> web.config
echo  ^</rules^> >> web.config
echo  ^</rewrite^> >> web.config
echo  ^</system.webServer^> >> web.config
echo ^</configuration^> >> web.config
CALL pm2 delete sys420
CALL pm2 start node_modules/next/dist/bin/next --name "sys420" -- start -p !newport!
