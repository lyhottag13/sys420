@echo off
set "target=%~dp0startupvbs.vbs"
set "shortcut=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Sys420.lnk"
set "startin=%~dp0"

powershell -Command "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%shortcut%'); $s.TargetPath = '%target%'; $s.WorkingDirectory = '%startin%'; $s.Save()"


cd Sistema420-2025-main
set /p user=What is the MySQL username?
set /p password=What is the MySQL password?
echo DATABASE_URL=mysql://%user%:%password%@localhost:3306/system420 > .env
where npm >nul 2>&1
if NOT %errorlevel%==0 (
	echo Install npm and Node.js!
) else (
	npm.cmd ci
	powershell -Command "(Get-Content prisma\schema.prisma) -replace 'sqlserver', 'mysql' | Set-Content prisma\schema.prisma"
	npx prisma db pull --force
	npx prisma generate
	cd ..
	start startupvbs.vbs
)