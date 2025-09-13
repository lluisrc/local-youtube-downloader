#!/bin/bash

echo "================================"
echo " YouTube Downloader - Iniciando"
echo "================================"

echo
echo "Instalando dependencias del backend..."
cd backend
pip install -r ../requirements.txt

echo
echo "Instalando dependencias del frontend..."
cd ../frontend
npm install

echo
echo "================================"
echo " Iniciando servidores..."
echo "================================"

echo
echo "Iniciando backend en el puerto 8000..."
cd ../backend
python run.py &
BACKEND_PID=$!

echo
echo "Esperando 3 segundos para que el backend se inicie..."
sleep 3

echo
echo "Iniciando frontend en el puerto 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "================================"
echo " Servidores iniciados!"
echo "================================"
echo
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo
echo "Presiona Ctrl+C para detener los servidores..."

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servidores detenidos."
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT SIGTERM

# Esperar hasta que el usuario presione Ctrl+C
wait 