@echo off

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
  npm.cmd ci
  if /i "%to_my_sql%"=="y" (
    :: If the user wanted MySQL, then we replace the SQL Server settings.
    powershell -Command "(Get-Content prisma\schema.prisma) -replace 'sqlserver', 'mysql' | Set-Content prisma\schema.prisma"
  )
  :: Generates the prisma tool from the schema.
  npx prisma db pull --force
  npx prisma generate
)
