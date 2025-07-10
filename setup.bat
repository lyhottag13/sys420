@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

cd Sistema420-2025-main
set /p to_my_sql=Are you trying to setup MySQL? (y/n): 
:: If the user is trying to setup MySQL, then set the MySQL settings.
if /i "%to_my_sql%"=="y" (
  set /p user=What is the MySQL username? 
  set /p password=What is the MySQL password? 
  set /p ip=What is the IP address? ^(e.g. 192.168.1.100, localhost, etc.^) 
  set /p port=What is the port? ^(e.g. 3306, 80, etc.^) 
  set /p database=What is the database? 
  echo DATABASE_URL=mysql://%user%:%password%@%ip%:%port%/%database% > .env
)
where npm >nul 2>&1
:: If we can't run npm, then you don't have it installed or configured in the PATH.
if NOT %errorlevel%==0 (
  echo Install npm and Node.js!
  pause
  exit /b
  ) else (
  :: Clean installs everything so that there's less risk with dependencies updating.
  :: CALL npm.cmd ci
  if /i "%to_my_sql%"=="y" (
    :: If the user wanted MySQL, then we replace the SQL Server settings.
    powershell -Command "(Get-Content prisma\schema.prisma) -replace 'sqlserver', 'mysql' | Set-Content prisma\schema.prisma"
  )
  :: Generates the prisma tool from the schema.
  CALL npx prisma db pull --force
  CALL npx prisma generate
  :: Adds the app daemon to pm2.
  set /p newport=What's the desired localhost port? 
  echo ^<?xml version="1.0" encoding="UTF-8"?^> > web.config
  echo ^<configuration^> >> web.config
  echo  ^<system.webServer^> >> web.config
  echo  ^<rewrite^> >> web.config
  echo  ^<rules^> >> web.config
  echo  ^<rule name="Force HTTPS"^> >> web.config
  echo  ^<match url="(.*)" /^> >> web.config
  echo  ^<conditions^> >> web.config
  echo  ^<add input="{HTTPS}" pattern="^OFF$" /^> >> web.config
  echo  ^</conditions^> >> web.config
  echo  ^<action type="Redirect" url="https://{HTTP_HOST}/{R:1}" /^> >> web.config
  echo  ^</rule^> >> web.config
  echo  ^<rule name="ReverseProxyInboundRule1" stopProcessing="true"^> >> web.config
  echo  ^<match url="(.*)" /^> >> web.config
  echo  ^<action type="Rewrite" url="http://localhost:!newport!/{R:1}" /^> >> web.config
  echo  ^</rule^> >> web.config
  echo  ^</rules^> >> web.config
  echo  ^</rewrite^> >> web.config
  echo  ^</system.webServer^> >> web.config
  echo ^</configuration^> >> web.config
  CALL pm2 delete sys420
  CALL pm2 start node_modules/next/dist/bin/next --name "sys420" --interpreter node -- dev -p !newport!
)
