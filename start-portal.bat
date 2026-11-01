@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20 or later, then run this file again.
  pause
  exit /b 1
)
echo Starting CampusOS at http://127.0.0.1:3100/
start "CampusOS server" /D "%~dp0" cmd /k run-server.cmd
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:3100/"
endlocal
