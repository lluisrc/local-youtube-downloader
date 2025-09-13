#!/bin/bash

echo "================================"
echo " YouTube Downloader con venv"
echo "================================"

echo
echo "Verificando entorno virtual..."
if [ ! -d "backend/venv" ]; then
    echo "ERROR: Entorno virtual no encontrado."
    echo "Ejecuta primero: ./setup-venv.sh"
    echo
    exit 1
fi

echo
echo "Iniciando backend con venv..."
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!

echo
echo "Esperando 3 segundos para que el backend se inicie..."
sleep 3

echo
echo "Iniciando frontend..."
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
echo "El entorno virtual esta activo en el backend."
echo "Presiona Ctrl+C para detener los servidores..."

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servidores detenidos."
    echo "Entorno virtual desactivado."
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT SIGTERM

# Esperar hasta que el usuario presione Ctrl+C
wait 