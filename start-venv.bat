@echo off
echo ================================
echo  YouTube Downloader con venv
echo ================================

if not exist "backend\venv\" (
  echo ERROR: Entorno virtual no encontrado. Ejecuta setup-venv.bat
  pause
  exit /b 1
)

echo.
echo Iniciando backend con venv...
start "backend" cmd /c "cd /d backend && call venv\Scripts\activate.bat && python run.py"

echo.
echo Esperando 5 segundos para que el backend se inicie...
timeout /t 5 /nobreak >nul

echo.
echo Iniciando frontend...
start "frontend" cmd /c "cd /d frontend && npm start"

echo.
echo ================================
echo  Servidores iniciados!
echo ================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
pause >nul
