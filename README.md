# YouTube Downloader

Una aplicación web completa para descargar videos y audio de YouTube, construida con Python (FastAPI) en el backend y React en el frontend.

## 🚀 Características

### Backend (Python + FastAPI)
- ✅ Descarga de videos en múltiples calidades (4K, 1080p, 720p, 480p, etc.)
- ✅ Extracción de audio en formato MP3
- ✅ Información detallada del video (título, duración, vistas, formatos disponibles)
- ✅ Progreso de descarga en tiempo real con WebSockets
- ✅ Gestión de archivos descargados
- ✅ Monitoreo del sistema (CPU, RAM, disco)
- ✅ API REST completa y documentada

### Frontend (React)
- ✅ Interfaz moderna y responsive con Tailwind CSS
- ✅ Validación de URLs de YouTube
- ✅ Selección de calidad y formato
- ✅ Progreso de descarga en tiempo real
- ✅ Gestión de archivos descargados
- ✅ Información del sistema en tiempo real

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **yt-dlp**: Librería para descarga de videos de YouTube (fork actualizado de youtube-dl)
- **WebSockets**: Para actualizaciones de progreso en tiempo real
- **psutil**: Para monitoreo del sistema
- **Uvicorn**: Servidor ASGI

### Frontend
- **React**: Librería de JavaScript para interfaces de usuario
- **Tailwind CSS**: Framework CSS utilitario
- **Axios**: Cliente HTTP para llamadas a la API
- **Lucide React**: Iconos modernos

## 📦 Instalación

### Prerequisitos
- Python 3.8+
- Node.js 14+
- npm o yarn
- FFmpeg (para conversión de audio)

### Instalación de FFmpeg

**Windows:**
```bash
# Usando chocolatey
choco install ffmpeg

# O descargar desde https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

### 🐍 Método Recomendado: Usando venv (Entorno Virtual)

**Opción 1: Setup Automático**

**Windows:**
```bash
# Ejecutar setup inicial (solo una vez)
setup-venv.bat

# Ejecutar proyecto
start-venv.bat
```

**Linux/Mac:**
```bash
# Hacer ejecutables los scripts
chmod +x setup-venv.sh start-venv.sh

# Ejecutar setup inicial (solo una vez)
./setup-venv.sh

# Ejecutar proyecto
./start-venv.sh
```

**Opción 2: Setup Manual**

1. **Crear entorno virtual:**
```bash
# Windows
python -m venv backend\venv

# Linux/Mac
python3 -m venv backend/venv
```

2. **Activar entorno virtual:**
```bash
# Windows
backend\venv\Scripts\activate

# Linux/Mac
source backend/venv/bin/activate
```

3. **Instalar dependencias del backend:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. **Instalar dependencias del frontend:**
```bash
cd frontend
npm install
cd ..
```

5. **Ejecutar servidores:**
```bash
# Terminal 1 - Backend (con venv activado)
cd backend
source venv/bin/activate  # Linux/Mac
# o backend\venv\Scripts\activate  # Windows
python run.py

# Terminal 2 - Frontend
cd frontend
npm start
```

### 🔧 Método Alternativo: Sin venv

**Solo si no puedes usar venv:**

1. **Instalar dependencias de Python:**
```bash
pip install -r requirements.txt
```

2. **Ejecutar el servidor backend:**
```bash
cd backend
python run.py
```

3. **Instalar dependencias de Node.js:**
```bash
cd frontend
npm install
```

4. **Ejecutar la aplicación React:**
```bash
npm start
```

### 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **Documentación API**: http://localhost:8000/docs

## 🐍 ¿Por qué usar venv?

### ✅ Ventajas de usar venv:
- **Aislamiento**: Las dependencias no afectan otros proyectos Python
- **Versiones específicas**: Cada proyecto puede usar versiones diferentes de las mismas librerías
- **Limpieza**: Fácil de eliminar y recrear el entorno
- **Reproducibilidad**: Garantiza que el proyecto funcione igual en diferentes máquinas
- **Seguridad**: Evita conflictos entre diferentes versiones de paquetes

### ⚠️ Sin venv:
- Las dependencias se instalan globalmente en el sistema
- Posibles conflictos con otros proyectos Python
- Más difícil de gestionar dependencias específicas
- Riesgo de romper otros proyectos al actualizar librerías

### 🚀 Métodos de Inicio Disponibles:

| Método | Descripción | Archivos |
|--------|-------------|----------|
| **venv (Recomendado)** | Entorno virtual aislado | `setup-venv.bat/sh`, `start-venv.bat/sh` |
| **Sin venv** | Instalación global | `start.bat/sh` |
| **Manual** | Control total | Comandos individuales |

## 🚀 Uso

### Acceso a la Aplicación
1. Abrir navegador en `http://localhost:3000`
2. El backend debe estar ejecutándose en `http://localhost:8000`

### Descargar Videos
1. **Pegar URL**: Copiar la URL del video de YouTube
2. **Obtener información**: Hacer clic en "Obtener Información"
3. **Seleccionar opciones**:
   - Tipo: Video completo o solo audio
   - Calidad: Mejor calidad, menor tamaño, o resolución específica
   - Formato: Selección automática o formato específico
4. **Descargar**: Hacer clic en "Descargar"
5. **Monitorear progreso**: Ver el progreso en tiempo real

### Gestión de Archivos
- **Ver archivos**: Ir a la pestaña "Archivos"
- **Descargar**: Hacer clic en el botón de descarga
- **Eliminar**: Hacer clic en el botón de eliminar

### Monitoreo del Sistema
- **Ver estadísticas**: Ir a la pestaña "Sistema"
- **Métricas**: CPU, RAM, disco, directorio de descargas
- **Actualización automática**: Cada 10 segundos

## 📁 Estructura del Proyecto

```
local-youtube-downloader/
├── backend/
│   ├── venv/                # Entorno virtual de Python (no se sube a git)
│   ├── main.py              # Aplicación FastAPI principal
│   ├── run.py               # Script de inicio del servidor
│   └── .env                 # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── App.js           # Componente principal
│   │   ├── index.js         # Punto de entrada
│   │   └── index.css        # Estilos con Tailwind
│   ├── public/
│   │   └── index.html       # HTML principal
│   ├── package.json         # Dependencias de Node.js
│   └── tailwind.config.js   # Configuración de Tailwind
├── downloads/               # Directorio de descargas (se crea automáticamente)
├── requirements.txt         # Dependencias de Python
├── setup-venv.bat           # Setup automático Windows con venv
├── setup-venv.sh            # Setup automático Linux/Mac con venv
├── start-venv.bat           # Inicio automático Windows con venv
├── start-venv.sh            # Inicio automático Linux/Mac con venv
├── start.bat                # Inicio automático Windows (sin venv)
├── start.sh                 # Inicio automático Linux/Mac (sin venv)
├── README.md               # Este archivo
└── INICIO-RAPIDO.md        # Guía de inicio rápido
```

## 🔧 Configuración Avanzada

### Variables de Entorno (backend/.env)
```env
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
DOWNLOAD_DIR=downloads
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Gestión del Entorno Virtual

**Comandos útiles con venv:**
```bash
# Activar entorno virtual
# Windows: backend\venv\Scripts\activate
# Linux/Mac: source backend/venv/bin/activate

# Instalar nueva dependencia
pip install nueva-libreria
pip freeze > requirements.txt

# Ver dependencias instaladas
pip list

# Actualizar dependencias
pip install --upgrade -r requirements.txt

# Desactivar entorno virtual
deactivate
```

### Personalización de yt-dlp
El archivo `backend/main.py` permite personalizar:
- Formatos de salida
- Calidades disponibles
- Opciones de post-procesamiento
- Configuración de FFmpeg

## 🐛 Solución de Problemas

### Error: "FFmpeg not found"
- Instalar FFmpeg siguiendo las instrucciones anteriores
- Verificar que esté en el PATH del sistema

### Error: "CORS policy"
- Verificar que ambos servidores estén ejecutándose
- Comprobar las URLs en la configuración de CORS

### Error: "Video unavailable"
- Verificar que la URL sea válida
- Algunos videos pueden tener restricciones geográficas
- Videos privados no son accesibles

### Descarga lenta
- Verificar conexión a internet
- Monitorear uso de CPU y memoria
- Evitar descargas simultáneas de videos grandes

## 📋 API Endpoints

### Información del Video
```http
POST /video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Iniciar Descarga
```http
POST /download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "audio_only": false,
  "quality": "best",
  "format_id": "optional"
}
```

### Progreso de Descarga
```http
GET /download-progress/{download_id}
```

### WebSocket para Progreso
```
ws://localhost:8000/ws/download-progress/{download_id}
```

## 🔄 Actualizaciones

### Actualizar yt-dlp
```bash
# Con venv activado
source backend/venv/bin/activate  # Linux/Mac
# o backend\venv\Scripts\activate  # Windows

pip install --upgrade yt-dlp
pip freeze > requirements.txt
```

### Actualizar dependencias
```bash
# Backend (con venv activado)
source backend/venv/bin/activate  # Linux/Mac
# o backend\venv\Scripts\activate  # Windows

pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm update
```

### Recrear entorno virtual
```bash
# Si hay problemas con el entorno virtual
rm -rf backend/venv  # Linux/Mac
# o rmdir /s backend\venv  # Windows

# Ejecutar setup nuevamente
./setup-venv.sh  # Linux/Mac
# o setup-venv.bat  # Windows
```

## ⚠️ Aviso Legal

Esta aplicación es solo para uso personal y educativo. Respeta los términos de servicio de YouTube y las leyes de derechos de autor de tu jurisdicción. No uses esta herramienta para descargar contenido protegido por derechos de autor sin el permiso adecuado.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama para tu característica
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 