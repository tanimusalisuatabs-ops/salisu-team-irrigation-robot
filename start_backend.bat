@echo off
cd /d "%~dp0"

echo ==========================================
echo   SMART IRRIGATION ROBOT BACKEND
echo ==========================================
echo.
echo Project folder:
cd
echo.
echo Checking Python...
py --version
echo.
echo Starting Flask backend...
echo.

py app.py

echo.
echo ==========================================
echo Backend stopped or an error occurred.
echo ==========================================
pause