@echo off
echo ================================
echo  YouTube Downloader con venv
echo ================================

echo.
echo Verificando entorno virtual...
if not exist "backend\venv\" (
    echo ERROR: Entorno virtual no encontrado.
    echo Ejecuta primero: setup-venv.bat
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando backend con venv...
start /b cmd /c "cd backend && venv\Scripts\activate && python run.py"

echo.
echo Esperando 3 segundos para que el backend se inicie...
timeout /t 3 /nobreak >nul

echo.
echo Iniciando frontend...
start /b cmd /c "cd frontend && npm start"

echo.
echo ================================
echo  Servidores iniciados!
echo ================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo El entorno virtual esta activo en el backend.
echo Para detener los servidores, cierra las ventanas de consola.
echo.
echo Presiona cualquier tecla para salir...
pause >nul 