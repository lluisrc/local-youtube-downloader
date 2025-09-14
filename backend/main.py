from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp
import os
import json
import asyncio
from typing import List, Optional
import uuid
import shutil
from pathlib import Path
import psutil
import time

app = FastAPI(title="YouTube Downloader API", version="1.0.0")

# Configuración de CORS para el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Almacenamiento temporal para el progreso de las descargas
download_progress = {}

class VideoInfo(BaseModel):
    id: str
    title: str
    thumbnail: str
    duration: int
    uploader: str
    view_count: int
    formats: List[dict]

class DownloadRequest(BaseModel):
    url: str
    format_id: Optional[str] = None
    audio_only: bool = False
    quality: Optional[str] = None

class ProgressHook:
    def __init__(self, download_id: str):
        self.download_id = download_id
        
    def __call__(self, d):
        if d['status'] == 'downloading':
            percent = d.get('_percent_str', 'N/A')
            speed = d.get('_speed_str', 'N/A')
            eta = d.get('_eta_str', 'N/A')
            
            download_progress[self.download_id] = {
                'status': 'downloading',
                'percent': percent,
                'speed': speed,
                'eta': eta,
                'filename': d.get('filename', '')
            }
        elif d['status'] == 'finished':
            download_progress[self.download_id] = {
                'status': 'finished',
                'filename': d.get('filename', ''),
                'filepath': d.get('filename', '')
            }
        elif d['status'] == 'error':
            download_progress[self.download_id] = {
                'status': 'error',
                'error': str(d.get('error', 'Unknown error'))
            }

@app.get("/")
async def root():
    return {"message": "YouTube Downloader API"}

@app.post("/video-info")
async def get_video_info(request: dict):
    """Obtener información del video de YouTube"""
    try:
        url = request.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Filtrar y organizar formatos
            formats = []
            for f in info.get('formats', []):
                if f.get('vcodec') != 'none' or f.get('acodec') != 'none':
                    formats.append({
                        'format_id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'quality': f.get('quality'),
                        'format_note': f.get('format_note'),
                        'filesize': f.get('filesize'),
                        'tbr': f.get('tbr'),
                        'vbr': f.get('vbr'),
                        'abr': f.get('abr'),
                        'acodec': f.get('acodec'),
                        'vcodec': f.get('vcodec'),
                        'width': f.get('width'),
                        'height': f.get('height'),
                        'fps': f.get('fps'),
                        'audio_only': f.get('vcodec') == 'none',
                        'video_only': f.get('acodec') == 'none'
                    })
            
            return VideoInfo(
                id=info['id'],
                title=info['title'],
                thumbnail=info['thumbnail'],
                duration=info.get('duration', 0),
                uploader=info.get('uploader', 'Unknown'),
                view_count=info.get('view_count', 0),
                formats=formats
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting video info: {str(e)}")

@app.post("/download")
async def download_video(request: DownloadRequest):
    """Iniciar descarga de video"""
    try:
        download_id = str(uuid.uuid4())
        
        print(f"=== NUEVA DESCARGA ===")
        print(f"URL: {request.url}")
        print(f"Calidad solicitada: {request.quality}")
        print(f"Formato ID: {request.format_id}")
        print(f"Solo audio: {request.audio_only}")
        print(f"Tipo de descarga: {'AUDIO' if request.audio_only else 'VIDEO'}")
        
        # Configuración de yt-dlp
        ydl_opts = {
            'outtmpl': '%(title)s.%(ext)s',
            'progress_hooks': [ProgressHook(download_id)],
        }
        
        # Priorizar format_id si está disponible (más preciso)
        if request.format_id:
            ydl_opts['format'] = request.format_id
            print(f"Usando format_id específico: {request.format_id}")
        elif request.audio_only:
            # Para audio, usar la calidad seleccionada con fallback
            if request.quality:
                if request.quality == 'best':
                    ydl_opts['format'] = 'bestaudio/best'
                elif request.quality == 'worst':
                    ydl_opts['format'] = 'worstaudio/worst'
                else:
                    # Para calidades específicas de audio (bitrate) con fallback
                    try:
                        quality_int = int(request.quality)
                        ydl_opts['format'] = f'bestaudio[abr<={quality_int}]/bestaudio/best'
                    except ValueError:
                        ydl_opts['format'] = f'bestaudio[abr<={request.quality}]/bestaudio/best'
            else:
                ydl_opts['format'] = 'bestaudio/best'
            
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        elif request.quality:
            if request.quality == 'best':
                ydl_opts['format'] = 'best'
            elif request.quality == 'worst':
                ydl_opts['format'] = 'worst'
            else:
                # Para calidades específicas de video con fallback
                try:
                    quality_int = int(request.quality)
                    ydl_opts['format'] = f'best[height<={quality_int}]/best'
                except ValueError:
                    # Si no es un número, usar como está con fallback
                    ydl_opts['format'] = f'best[height<={request.quality}]/best'
        else:
            ydl_opts['format'] = 'best'
        
        print(f"Formato yt-dlp seleccionado: {ydl_opts['format']}")
        
        # Inicializar progreso
        download_progress[download_id] = {
            'status': 'starting',
            'percent': '0%',
            'speed': 'N/A',
            'eta': 'N/A'
        }
        
        # Ejecutar descarga in background
        asyncio.create_task(perform_download(download_id, request.url, ydl_opts))
        
        return {"download_id": download_id, "status": "started"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting download: {str(e)}")

async def perform_download(download_id: str, url: str, ydl_opts: dict):
    """Realizar descarga en background con fallback"""
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        error_msg = str(e)
        print(f"Error en descarga: {error_msg}")
        
        # Si el error es de formato no disponible, intentar con fallback
        if "Requested format is not available" in error_msg:
            print("Formato no disponible, intentando con fallback...")
            
            # Crear opciones de fallback
            fallback_opts = ydl_opts.copy()
            
            if ydl_opts.get('postprocessors'):  # Es audio
                fallback_opts['format'] = 'bestaudio/best'
            else:  # Es video
                fallback_opts['format'] = 'best'
            
            print(f"Formato de fallback: {fallback_opts['format']}")
            
            try:
                with yt_dlp.YoutubeDL(fallback_opts) as ydl_fallback:
                    ydl_fallback.download([url])
                print("Descarga exitosa con formato de fallback")
            except Exception as fallback_error:
                print(f"Error en fallback: {fallback_error}")
                download_progress[download_id] = {
                    'status': 'error',
                    'error': f"Formato no disponible. Error: {str(fallback_error)}"
                }
        else:
            download_progress[download_id] = {
                'status': 'error',
                'error': error_msg
            }

@app.get("/download-progress/{download_id}")
async def get_download_progress(download_id: str):
    """Obtener progreso de descarga"""
    if download_id not in download_progress:
        raise HTTPException(status_code=404, detail="Download ID not found")
    
    return download_progress[download_id]

@app.websocket("/ws/download-progress/{download_id}")
async def websocket_download_progress(websocket: WebSocket, download_id: str):
    """WebSocket para progreso de descarga en tiempo real"""
    await websocket.accept()
    
    try:
        while True:
            if download_id in download_progress:
                await websocket.send_json(download_progress[download_id])
                
                # Si terminó la descarga, cerrar conexión
                if download_progress[download_id]['status'] in ['finished', 'error']:
                    break
            
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

@app.get("/download-ready/{download_id}")
async def download_ready_file(download_id: str):
    """Descargar archivo cuando esté listo"""
    if download_id not in download_progress:
        raise HTTPException(status_code=404, detail="Download ID not found")
    
    progress = download_progress[download_id]
    if progress['status'] != 'finished':
        raise HTTPException(status_code=400, detail="Download not finished yet")
    
    filename = progress.get('filename', '')
    if not filename:
        raise HTTPException(status_code=404, detail="Filename not available")
    
    print(f"Buscando archivo para descarga: {filename}")
    
    # Buscar el archivo en el directorio actual
    file_path = None
    
    # Primero intentar con la ruta completa
    if Path(filename).exists():
        file_path = Path(filename)
        print(f"Archivo encontrado con ruta completa: {file_path}")
    else:
        # Buscar por nombre en el directorio actual
        filename_only = Path(filename).name
        potential_path = Path(filename_only)
        if potential_path.exists():
            file_path = potential_path
            print(f"Archivo encontrado por nombre: {file_path}")
        else:
            # Buscar archivos recientes en el directorio actual (últimos 5 minutos)
            current_time = time.time()
            recent_files = []
            
            for file_in_dir in Path('.').iterdir():
                if file_in_dir.is_file():
                    file_age = current_time - file_in_dir.stat().st_mtime
                    if file_age < 300:  # 5 minutos
                        recent_files.append(file_in_dir)
            
            print(f"Archivos recientes encontrados: {[f.name for f in recent_files]}")
            
            # Si hay archivos recientes, usar el más reciente
            if recent_files:
                file_path = max(recent_files, key=lambda f: f.stat().st_mtime)
                print(f"Usando archivo más reciente: {file_path}")
            else:
                # Buscar cualquier archivo que coincida con el patrón del nombre
                base_name = filename_only.split('.')[0]
                for file_in_dir in Path('.').iterdir():
                    if file_in_dir.is_file() and base_name in file_in_dir.name:
                        file_path = file_in_dir
                        print(f"Archivo encontrado por patrón: {file_path}")
                        break
    
    if not file_path or not file_path.exists():
        # Listar todos los archivos para debug
        all_files = [f.name for f in Path('.').iterdir() if f.is_file()]
        print(f"Archivos disponibles en directorio: {all_files}")
        raise HTTPException(status_code=404, detail=f"File not found. Available files: {all_files}")
    
    # Determinar el tipo de archivo
    ext = file_path.suffix.lower()
    if ext in ['.mp4', '.webm', '.mkv', '.avi']:
        media_type = 'video/mp4'
    elif ext in ['.mp3', '.wav', '.flac', '.aac', '.m4a']:
        media_type = 'audio/mpeg'
    else:
        media_type = 'application/octet-stream'
    
    print(f"Enviando archivo: {file_path.name} (tipo: {media_type})")
    
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,
        media_type=media_type
    )

@app.get("/system-info")
async def get_system_info():
    """Obtener información del sistema"""
    return {
        'cpu_percent': psutil.cpu_percent(),
        'memory_percent': psutil.virtual_memory().percent,
        'disk_usage': psutil.disk_usage('/').percent
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)