#!/usr/bin/env python3
"""
Script para ejecutar el servidor backend del YouTube Downloader
"""

import uvicorn
import sys
import os
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    print("🚀 Iniciando YouTube Downloader Backend...")
    print("📂 Directorio de descargas: downloads/")
    print("🌐 API disponible en: http://localhost:8000")
    print("📋 Documentación API: http://localhost:8000/docs")
    print("⚡ Presiona Ctrl+C para detener el servidor\n")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor detenido por el usuario") 