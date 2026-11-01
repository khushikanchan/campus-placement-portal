@echo off
cd /d "%~dp0"
set "PORT=3100"
echo Launching CampusOS on http://127.0.0.1:3100/
node server.js
echo.
echo The server stopped. Check the message above for the cause.
pause
