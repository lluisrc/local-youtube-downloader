import axios from 'axios';
import { CheckCircle, Clock, Download, Loader, XCircle, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const DownloadProgress = ({ download, onComplete }) => {
  const [progress, setProgress] = useState({
    status: 'starting',
    percent: '0%',
    speed: 'N/A',
    eta: 'N/A'
  });

  useEffect(() => {
    let interval;
    let websocket;

    const checkProgress = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/download-progress/${download.download_id}`);
        setProgress(response.data);

        if (response.data.status === 'finished') {
          if (interval) clearInterval(interval);
          // No descargar automáticamente, solo mostrar botón
          setTimeout(() => onComplete(), 10000); // Remover después de 10 segundos
        } else if (response.data.status === 'error') {
          if (interval) clearInterval(interval);
          setTimeout(() => onComplete(), 5000); // Remover después de 5 segundos en caso de error
        }
      } catch (error) {
        console.error('Error checking progress:', error);
        if (interval) clearInterval(interval);
      }
    };


    // Intentar usar WebSocket primero
    try {
      websocket = new WebSocket(`ws://localhost:8000/ws/download-progress/${download.download_id}`);

      websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        setProgress(data);

        if (data.status === 'finished') {
          // No descargar automáticamente, solo mostrar botón
          setTimeout(() => onComplete(), 10000);
        } else if (data.status === 'error') {
          setTimeout(() => onComplete(), 5000);
        }
      };

      websocket.onerror = () => {
        // Fallback a polling si WebSocket falla
        interval = setInterval(checkProgress, 1000);
      };

      websocket.onclose = () => {
        if (!interval) {
          interval = setInterval(checkProgress, 1000);
        }
      };
    } catch (error) {
      // Fallback a polling si WebSocket no está disponible
      interval = setInterval(checkProgress, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (websocket) websocket.close();
    };
  }, [download.download_id, onComplete]);

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'starting':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'downloading':
        return <Download className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'finished':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader className="w-5 h-5 animate-spin text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'starting':
        return 'Iniciando descarga...';
      case 'downloading':
        return 'Descargando...';
      case 'finished':
        return 'Descarga completada';
      case 'error':
        return 'Error en la descarga';
      default:
        return 'Procesando...';
    }
  };

  const getProgressPercent = () => {
    const percent = progress.percent;
    if (typeof percent === 'string' && percent.includes('%')) {
      return parseFloat(percent.replace('%', ''));
    }
    return 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={download.thumbnail}
            alt={download.title}
            className="w-20 h-15 object-cover rounded-lg shadow-sm"
          />
        </div>

        {/* Información de descarga */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon()}
            <h4 className="text-lg font-semibold text-gray-900 truncate">
              {download.title}
            </h4>
          </div>

          <p className="text-sm text-gray-600 mb-3 font-medium">
            {getStatusText()}
          </p>

          {/* Barra de progreso */}
          {progress.status === 'downloading' && (
            <div className="space-y-3 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">{progress.percent}</span>
                <div className="flex items-center space-x-6">
                  {progress.speed && progress.speed !== 'N/A' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">{progress.speed}</span>
                    </div>
                  )}
                  {progress.eta && progress.eta !== 'N/A' && (
                    <div className="flex items-center space-x-2 text-purple-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{progress.eta}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-gray-600 font-medium">Tipo:</span>
              <span className="font-semibold text-gray-800">{download.downloadType === 'audio' ? '🎵 Audio' : '🎬 Video'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="font-medium">ID:</span>
              <span className="font-mono text-xs">{download.download_id.substring(0, 8)}...</span>
            </div>
          </div>

          {/* Error */}
          {progress.status === 'error' && progress.error && (
            <div className="mt-3 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700 font-medium">{progress.error}</p>
              </div>
            </div>
          )}

          {/* Archivo completado */}
          {progress.status === 'finished' && progress.filename && (
            <div className="mt-3 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      ✅ Video listo para descargar
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Haz clic en "Guardar como" para elegir dónde guardar el archivo
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      console.log('Iniciando descarga para ID:', download.download_id);

                      const response = await axios.get(`${API_BASE_URL}/download-ready/${download.download_id}`, {
                        responseType: 'blob'
                      });

                      console.log('Respuesta recibida:', response.status);

                      if (response.data.size === 0) {
                        throw new Error('El archivo está vacío');
                      }

                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;

                      let filename = download.title || 'video';
                      const contentDisposition = response.headers['content-disposition'];
                      if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                        if (filenameMatch) {
                          filename = filenameMatch[1];
                        }
                      }

                      if (!filename.includes('.')) {
                        const contentType = response.headers['content-type'];
                        if (contentType?.includes('video')) {
                          filename += '.mp4';
                        } else if (contentType?.includes('audio')) {
                          filename += '.mp3';
                        }
                      }

                      link.setAttribute('download', filename);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);

                      console.log('Descarga iniciada exitosamente');
                    } catch (error) {
                      console.error('Error downloading file:', error);

                      let errorMessage = 'Error al descargar el archivo';

                      if (error.response) {
                        if (error.response.status === 404) {
                          errorMessage = 'Archivo no encontrado. Es posible que haya sido eliminado.';
                        } else if (error.response.status === 400) {
                          errorMessage = 'La descarga aún no ha terminado.';
                        } else {
                          errorMessage = `Error del servidor: ${error.response.status}`;
                        }
                      } else if (error.message) {
                        errorMessage = error.message;
                      }

                      alert(errorMessage);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  💾 Guardar como...
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress; 