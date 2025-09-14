# 🏠 YouTube Downloader Local

<div align="center">

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue.svg)](https://github.com/yourusername/youtube-downloader)
[![Python](https://img.shields.io/badge/python-3.8+-brightgreen.svg)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-success.svg)]()

**📱 Aplicación LOCAL para Windows y Linux que descarga videos MP4 y audio MP3 de YouTube directo a tu computadora**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-cómo-usar) • [Documentación](#-documentación)

</div>

---

## 📖 ¿Qué es YouTube Downloader Local?

**YouTube Downloader Local** es una aplicación completamente **LOCAL** que se ejecuta en tu propia computadora (Windows o Linux). No necesitas internet más que para descargar los videos - todo el procesamiento ocurre en tu máquina, manteniendo tu privacidad y control total sobre tus descargas.

### 🏠 ¿Por qué LOCAL?

- **🔒 100% Privado**: Ningún dato sale de tu computadora
- **🚫 Sin servidores externos**: No dependes de servicios en la nube
- **⚡ Sin límites**: Descarga todos los videos que quieras
- **💰 Completamente GRATIS**: Sin suscripciones ni pagos
- **🔐 Tus datos son tuyos**: Los archivos se guardan donde TÚ decides

### 🎯 ¿Para qué sirve?

- **💾 Biblioteca personal**: Crea tu propia colección local de videos y música
- **📱 Sin internet después**: Ve tus videos favoritos sin conexión
- **🎵 MP3 de alta calidad**: Extrae audio para tu biblioteca musical local
- **📚 Contenido educativo**: Guarda cursos, tutoriales y conferencias en tu PC
- **🎬 Entretenimiento offline**: Películas, series y documentales disponibles siempre
- **🔄 Respaldo personal**: Mantén copias locales de contenido importante

---

## ✨ Características de la Aplicación Local

### 🏠 Ejecución Local
- **Servidor local**: Se ejecuta en `localhost` (tu computadora)
- **Interfaz web local**: Acceso desde tu navegador en `http://localhost:3000`
- **Procesamiento local**: Todo ocurre en tu máquina, no en la nube
- **Almacenamiento local**: Archivos guardados directamente en tu disco duro

### 🚀 Descarga Local Potente
- **Múltiples calidades**: 4K, 1080p, 720p, 480p, 360p y más opciones
- **Dos formatos principales**: 
  - **MP4**: Videos completos con audio
  - **MP3**: Solo audio de alta calidad
- **Descarga directa**: Los archivos van directo a tu carpeta de descargas
- **Sin límites de tiempo**: Descarga videos de cualquier duración

### 🎨 Interfaz Web Local Moderna
- **Acceso por navegador**: Interfaz web que se ejecuta localmente
- **Diseño responsive**: Funciona en cualquier tamaño de ventana
- **Progreso en tiempo real**: Ve el avance de descarga en vivo
- **Validación inteligente**: Verifica automáticamente las URLs de YouTube

### 🔧 Arquitectura Local Robusta
- **Backend Python**: FastAPI ejecutándose en tu puerto 8000
- **Frontend React**: Interfaz moderna en tu puerto 3000
- **WebSockets locales**: Comunicación en tiempo real entre componentes
- **API REST local**: Endpoints disponibles solo en tu máquina

---

## 📋 Requisitos del Sistema Local

### Para Windows
- **Windows 10/11** (64-bit recomendado)
- **Python 3.8+** instalado localmente
- **Node.js 14+** para la interfaz web
- **4 GB RAM** mínimo (8 GB recomendado)
- **2 GB espacio libre** para la aplicación
- **FFmpeg** (se instala automáticamente)

### Para Linux
- **Ubuntu 18.04+**, **Debian 10+**, **Fedora 30+**, o **Arch Linux**
- **Python 3.8+** (generalmente preinstalado)
- **Node.js 14+** 
- **4 GB RAM** mínimo (8 GB recomendado)
- **2 GB espacio libre** para la aplicación
- **FFmpeg** (se instala con el script de instalación)

---

## 🚀 Instalación Local

### 🪟 Instalación para Windows

#### Opción 1: Instalación Automática (Recomendada)
```bash
# 1. Descargar e instalar Python desde python.org
# 2. Descargar e instalar Node.js desde nodejs.org
# 3. Clonar o descargar este proyecto
# 4. Abrir PowerShell como administrador en la carpeta del proyecto

# 5. Ejecutar instalador automático
.\setup-venv.bat

# 6. Iniciar la Aplicación Local
.\start-venv.bat
```
### 🐧 Instalación para Linux

#### Opción 1: Instalación Automática (Recomendada)
```bash
# 1. Clonar o descargar este proyecto
# 2. Dar permisos de ejecución al instalador
chmod +x install-linux.sh

# 3. Ejecutar instalador automático
.\setup-venv.sh

# 4. Iniciar la Aplicación Local
.\start-venv.sh
```

---


### 🌐 Acceder a la Aplicación
1. **Abrir navegador web** (Chrome, Firefox, Edge, etc.)
2. **Ir a**: `http://localhost:3000`
3. **¡Listo!** Ya puedes usar tu YouTube Downloader local

### 📥 Descargar Videos Localmente

#### Paso a Paso:
1. **Copiar URL**: Ve a YouTube y copia la URL del video que quieres
2. **Pegar en la app**: Pega la URL en el campo de texto
3. **Obtener información**: Haz clic en "Obtener Info" para ver opciones
4. **Elegir formato**:
   - **Video MP4**: Para video completo con audio
   - **Audio MP3**: Solo para música o audio
5. **Seleccionar calidad**:
   - **4K (2160p)**: Máxima calidad (archivos grandes)
   - **1080p Full HD**: Alta calidad equilibrada
   - **720p HD**: Buena calidad, archivos medianos
   - **480p**: Calidad estándar, archivos pequeños
6. **Iniciar descarga**: Haz clic en "Descargar"
7. **Ver progreso**: Observa la barra de progreso en tiempo real
8. **Archivo listo**: Se descarga automáticamente a tu carpeta de Descargas

#### 💡 Consejos de Uso:
- **Videos largos**: Pueden tardar más en procesar
- **Calidad alta**: Requiere más espacio en disco
- **Múltiples descargas**: Puedes hacer varias a la vez
- **URLs válidas**: Solo funciona con URLs públicas de YouTube

---

## 📂 Estructura Local del Proyecto

```
youtube-downloader-local/
├── 📁 backend/                 # Servidor Python local
│   ├── 📁 venv/               # Entorno virtual (creado automáticamente)
│   ├── 📄 main.py             # Aplicación FastAPI principal
│   ├── 📄 run.py              # Iniciador del servidor local
│   └── 📄 requirements.txt        # Dependencias Python
├── 📁 frontend/               # Interfaz web React local
│   ├── 📁 src/               # Código fuente React
│   ├── 📁 public/            # Archivos públicos web
│   ├── 📄 package.json       # Dependencias Node.js
│   └── 📄 tailwind.config.js # Configuración de estilos
├── 📄 setup-venv.bat         # Instalador automático Windows
├── 📄 setup-venv.sh          # Instalador automático Linux
├── 📄 start-venv.bat         # Iniciador Windows
├── 📄 start-venv.sh          # Iniciador Linux
└── 📄 README.md              # Esta documentación
```

---

### 🔧 Solución de Problemas Locales

#### ❌ "No se puede conectar al servidor"
- **Verificar** que el backend esté ejecutándose en puerto 8000
- **Comprobar** que no haya otras aplicaciones usando los puertos
- **Reiniciar** ambos servidores (backend y frontend)

#### ❌ "FFmpeg not found"
```bash
# Windows (instalar Chocolatey primero):
choco install ffmpeg

# Linux:
sudo apt install ffmpeg  # Ubuntu/Debian
sudo dnf install ffmpeg  # Fedora
sudo pacman -S ffmpeg    # Arch
```

#### ❌ "Error de permisos"
- **Windows**: Ejecutar como administrador
- **Linux**: Verificar permisos de la carpeta de descargas
```bash
chmod 755 downloads/
```

#### ❌ "Puerto en uso"
- **Cambiar puerto** en backend/.env
- **O cerrar** aplicaciones que usen puertos 3000 y 8000

---

## 🛡️ Privacidad y Seguridad Local

### 🔒 Ventajas de Privacidad:
- **Sin telemetría**: No se envían datos a servidores externos
- **Sin registro**: No se guardan logs de tus descargas
- **Sin cuentas**: No necesitas registrarte en ningún lado
- **Control total**: Tú decides qué, cuándo y dónde descargar

### 🛡️ Seguridad Local:
- **Solo localhost**: La aplicación solo es accesible desde tu PC
- **Sin exposición web**: No está disponible en internet
- **Archivos locales**: Todo se guarda en tu disco duro
- **Código abierto**: Puedes revisar todo el código fuente

---

## ⚠️ Uso Responsable y Legal

### 📋 Términos de Uso:
- **Solo para uso personal**: No redistribuyas contenido descargado
- **Respeta derechos de autor**: No descargues contenido protegido sin permiso
- **Uso educativo**: Ideal para contenido educativo y de dominio público
- **YouTube ToS**: Respeta los términos de servicio de YouTube

### ✅ Usos Apropiados:
- Videos de dominio público
- Tu propio contenido subido a YouTube  
- Material educativo con licencia libre
- Videos con licencia Creative Commons
- Respaldos personales de contenido que ya posees

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

---

**🏠 Una aplicación local, para tu computadora, sin comprometer tu privacidad**

⭐ **¡Dale una estrella si te resultó útil!** ⭐

[⬆️ Volver arriba](#-youtube-downloader-local)
