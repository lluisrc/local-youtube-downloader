@echo off
echo ============================================
echo  YouTube Downloader - Setup con venv
echo ============================================

echo.
echo Verificando Python...
python --version || (echo ERROR: instala Python && pause && exit /b 1)

echo.
echo Verificando Node.js...
node --version   || (echo ERROR: instala Node.js && pause && exit /b 1)

echo.
echo Creando entorno virtual de Python...
python -m venv backend\venv

echo.
echo Activando entorno virtual...
call backend\venv\Scripts\activate.bat

echo.
echo Actualizando pip...
python -m pip install --upgrade pip

echo.
echo Instalando dependencias del backend...
REM Usa la ruta correcta del requirements dentro de /backend
python -m pip install -r backend\requirements.txt

echo.
echo Desactivando entorno virtual...
call backend\venv\Scripts\deactivate.bat

echo.
echo Instalando dependencias del frontend...
cd frontend
npm install
cd ..

echo.
echo ============================================
echo  Setup completado exitosamente!
echo ============================================
echo.
echo Para ejecutar:
echo   start-venv.bat
echo.
pause >nul
