@echo off
echo ================================
echo  YouTube Downloader - Iniciando
echo ================================

echo.
echo Instalando dependencias del backend...
cd backend
call venv\Scripts\activate
pip install -r ../requirements.txt

echo.
echo Instalando dependencias del frontend...
cd ../frontend
call npm install

echo.
echo ================================
echo  Iniciando servidores...
echo ================================

echo.
echo Iniciando backend en el puerto 8000...
start /b cmd /c "cd ../backend && call venv\Scripts\activate && python run.py"

echo.
echo Esperando 3 segundos para que el backend se inicie...
timeout /t 3 /nobreak >nul

echo.
echo Iniciando frontend en el puerto 3000...
start /b cmd /c "cd . && npm start"

echo.
echo ================================
echo  Servidores iniciados!
echo ================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Presiona cualquier tecla para salir...
pause >nul 