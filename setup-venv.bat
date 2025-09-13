@echo off
echo ============================================
echo  YouTube Downloader - Setup con venv
echo ============================================

echo.
echo Verificando Python...
python --version
if errorlevel 1 (
    echo ERROR: Python no encontrado. Instala Python 3.8+ desde python.org
    pause
    exit /b 1
)

echo.
echo Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js no encontrado. Instala Node.js desde nodejs.org
    pause
    exit /b 1
)

echo.
echo Creando entorno virtual de Python...
python -m venv backend\venv

echo.
echo Activando entorno virtual...
call backend\venv\Scripts\activate

echo.
echo Actualizando pip...
pip install --upgrade pip

echo.
echo Instalando dependencias del backend...
pip install -r requirements.txt

echo.
echo Desactivando entorno virtual...
call backend\venv\Scripts\deactivate

echo.
echo Instalando dependencias del frontend...
cd frontend
call npm install
cd ..

echo.
echo ============================================
echo  Setup completado exitosamente!
echo ============================================
echo.
echo Para ejecutar el proyecto:
echo   1. Ejecuta: start-venv.bat
echo   2. O manualmente:
echo      - Backend: cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo      - Frontend: cd frontend ^&^& npm start
echo.
echo URLs de acceso:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8000
echo   - Documentacion: http://localhost:8000/docs
echo.
echo Presiona cualquier tecla para continuar...
pause >nul 