# 🚀 Inicio Rápido - YouTube Downloader

## 📋 Prerequisitos
- ✅ Python 3.8+ instalado
- ✅ Node.js 14+ instalado
- ✅ FFmpeg instalado (ver [instrucciones](README.md#instalación-de-ffmpeg))

## ⚡ Método más Rápido (Recomendado)

### Windows
```bash
# 1. Setup inicial (solo una vez)
setup-venv.bat

# 2. Ejecutar proyecto
start-venv.bat
```

### Linux/Mac
```bash
# 1. Hacer scripts ejecutables
chmod +x setup-venv.sh start-venv.sh

# 2. Setup inicial (solo una vez)
./setup-venv.sh

# 3. Ejecutar proyecto
./start-venv.sh
```

## 🌐 Acceso
- **Aplicación**: http://localhost:3000
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs

## 🎯 Uso Básico
1. Copia una URL de YouTube
2. Pégala en el formulario
3. Haz clic en "Obtener Información"
4. Selecciona calidad y formato
5. Haz clic en "Descargar"
6. Ve el progreso en tiempo real

## 🔧 Métodos Alternativos

### Sin venv (si tienes problemas)
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### Manual
```bash
# Terminal 1 - Backend
cd backend
pip install -r ../requirements.txt
python run.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## ❓ Problemas Comunes

### "FFmpeg not found"
```bash
# Windows
choco install ffmpeg

# Mac
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### "Python not found"
- Instalar Python desde python.org
- Verificar que esté en PATH

### "Node not found"
- Instalar Node.js desde nodejs.org
- Verificar que esté en PATH

### "Entorno virtual no encontrado"
```bash
# Ejecutar setup primero
setup-venv.bat  # Windows
./setup-venv.sh  # Linux/Mac
```

## 📚 Documentación Completa
Ver [README.md](README.md) para información detallada. 