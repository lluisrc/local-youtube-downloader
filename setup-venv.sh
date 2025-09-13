#!/bin/bash

echo "============================================"
echo " YouTube Downloader - Setup con venv"
echo "============================================"

echo
echo "Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 no encontrado. Instala Python 3.8+ desde python.org"
    exit 1
fi

python3 --version

echo
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado. Instala Node.js desde nodejs.org"
    exit 1
fi

node --version

echo
echo "Creando entorno virtual de Python..."
python3 -m venv backend/venv

echo
echo "Activando entorno virtual..."
source backend/venv/bin/activate

echo
echo "Actualizando pip..."
pip install --upgrade pip

echo
echo "Instalando dependencias del backend..."
pip install -r requirements.txt

echo
echo "Desactivando entorno virtual..."
deactivate

echo
echo "Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo
echo "============================================"
echo " Setup completado exitosamente!"
echo "============================================"
echo
echo "Para ejecutar el proyecto:"
echo "  1. Ejecuta: ./start-venv.sh"
echo "  2. O manualmente:"
echo "     - Backend: cd backend && source venv/bin/activate && python run.py"
echo "     - Frontend: cd frontend && npm start"
echo
echo "URLs de acceso:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - Documentacion: http://localhost:8000/docs"
echo 