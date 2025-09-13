import axios from 'axios';
import { Clock, Download, Eye, Music, User, Video } from 'lucide-react';
import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const VideoInfo = ({ videoInfo, onDownloadStart }) => {
  const [selectedFormat, setSelectedFormat] = useState('');
  const [downloadType, setDownloadType] = useState('video'); // 'video' or 'audio'
  const [quality, setQuality] = useState('best');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getFilteredFormats = () => {
    if (!videoInfo.formats) return [];

    if (downloadType === 'audio') {
      return videoInfo.formats.filter(f => f.audio_only);
    } else {
      return videoInfo.formats.filter(f => !f.audio_only && f.vcodec !== 'none');
    }
  };

  const getAvailableQualities = () => {
    if (!videoInfo.formats) return [];

    const filteredFormats = getFilteredFormats();

    if (downloadType === 'audio') {
      // Para audio, mostrar bitrates disponibles
      const audioQualities = filteredFormats
        .filter(f => f.abr)
        .map(f => ({
          value: f.abr,
          label: `${f.abr} kbps`,
          format_id: f.format_id,
          filesize: f.filesize
        }))
        .sort((a, b) => b.value - a.value);

      return audioQualities;
    } else {
      // Para video, mostrar resoluciones disponibles
      const videoQualities = filteredFormats
        .filter(f => f.height && f.height > 0)
        .reduce((acc, f) => {
          const height = f.height;
          if (!acc.find(q => q.height === height)) {
            acc.push({
              height: height,
              value: height.toString(),
              label: `${height}p`,
              format_id: f.format_id,
              filesize: f.filesize,
              width: f.width,
              fps: f.fps
            });
          }
          return acc;
        }, [])
        .sort((a, b) => b.height - a.height);

      return videoQualities;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress({ status: 'starting', percent: '0%' });

    try {
      const downloadData = {
        url: `https://www.youtube.com/watch?v=${videoInfo.id}`,
        audio_only: downloadType === 'audio',
        format_id: selectedFormat || undefined,
        quality: quality !== 'custom' ? quality : undefined
      };

      console.log('Iniciando descarga con datos:', downloadData);

      const response = await axios.post(`${API_BASE_URL}/download`, downloadData);
      const downloadId = response.data.download_id;

      // Monitorear progreso
      const checkProgress = async () => {
        try {
          const progressResponse = await axios.get(`${API_BASE_URL}/download-progress/${downloadId}`);
          const progress = progressResponse.data;
          setDownloadProgress(progress);

          if (progress.status === 'finished') {
            // Descargar automáticamente
            await downloadFile(downloadId);
            setIsDownloading(false);
            setDownloadProgress(null);
          } else if (progress.status === 'error') {
            alert('Error en la descarga: ' + (progress.error || 'Error desconocido'));
            setIsDownloading(false);
            setDownloadProgress(null);
          } else {
            // Continuar monitoreando
            setTimeout(checkProgress, 1000);
          }
        } catch (error) {
          console.error('Error checking progress:', error);
          setIsDownloading(false);
          setDownloadProgress(null);
        }
      };

      // Iniciar monitoreo
      setTimeout(checkProgress, 1000);

    } catch (error) {
      console.error('Error al iniciar descarga:', error);
      alert('Error al iniciar la descarga: ' + (error.response?.data?.detail || error.message));
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const downloadFile = async (downloadId) => {
    try {
      console.log('Intentando descargar archivo para ID:', downloadId);

      // Primero verificar el estado de la descarga
      const progressResponse = await axios.get(`${API_BASE_URL}/download-progress/${downloadId}`);
      console.log('Estado de la descarga:', progressResponse.data);

      const response = await axios.get(`${API_BASE_URL}/download-ready/${downloadId}`, {
        responseType: 'blob'
      });

      console.log('Respuesta de descarga recibida:', response.status, response.data.size);

      if (response.data.size === 0) {
        throw new Error('El archivo está vacío');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      let filename = videoInfo.title || 'video';
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

      console.log('Descarga completada:', filename);
    } catch (error) {
      console.error('Error downloading file:', error);

      let errorMessage = 'Error al descargar el archivo';

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = `Archivo no encontrado. Detalles: ${error.response.data?.detail || 'No disponible'}`;
        } else if (error.response.status === 400) {
          errorMessage = 'La descarga aún no ha terminado.';
        } else {
          errorMessage = `Error del servidor (${error.response.status}): ${error.response.data?.detail || error.message}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const filteredFormats = getFilteredFormats();
  const availableQualities = getAvailableQualities();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail y información básica */}
        <div className="lg:w-1/3">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full h-48 lg:h-full object-cover"
          />
        </div>

        {/* Información del video */}
        <div className="lg:w-2/3 p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {videoInfo.title}
            </h3>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{videoInfo.uploader}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Eye className="w-4 h-4 text-green-600" />
                <span className="font-medium">{formatViewCount(videoInfo.view_count)} visualizaciones</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-medium">{formatDuration(videoInfo.duration)}</span>
              </div>
            </div>
          </div>

          {/* Opciones de descarga */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de descarga
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setDownloadType('video')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${downloadType === 'video'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDownloadType('audio')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${downloadType === 'audio'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Solo Audio</span>
                </button>
              </div>
            </div>

            {/* Selección de calidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calidad {downloadType === 'audio' ? 'de Audio' : 'de Video'}
              </label>
              <div className="space-y-3">
                {/* Opciones automáticas */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setQuality('best')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${quality === 'best'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    🏆 Mejor calidad
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality('worst')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${quality === 'worst'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    📦 Menor tamaño
                  </button>
                </div>

                {/* Calidades específicas disponibles */}
                {availableQualities.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Calidades específicas disponibles:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableQualities.map((q, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setQuality(q.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-center ${quality === q.value
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          title={q.filesize ? `Tamaño: ${formatFileSize(q.filesize)}` : ''}
                        >
                          <div className="font-semibold">{q.label}</div>
                          {q.filesize && (
                            <div className="text-xs text-gray-500 mt-1">
                              {formatFileSize(q.filesize)}
                            </div>
                          )}
                          {q.fps && (
                            <div className="text-xs text-gray-400">
                              {q.fps}fps
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Formato específico */}
            {filteredFormats.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato específico (opcional)
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selección automática</option>
                  {filteredFormats.map(format => (
                    <option key={format.format_id} value={format.format_id}>
                      {format.ext} - {format.format_note}
                      {format.width && format.height && ` (${format.width}x${format.height})`}
                      {format.filesize && ` - ${formatFileSize(format.filesize)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Botón de descarga */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {downloadProgress?.status === 'downloading'
                      ? `Descargando... ${downloadProgress.percent || '0%'}`
                      : downloadProgress?.status === 'starting'
                        ? 'Iniciando descarga...'
                        : 'Procesando...'
                    }
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descargar {downloadType === 'audio' ? 'Audio' : 'Video'}</span>
                </>
              )}
            </button>

            {/* Barra de progreso */}
            {downloadProgress && downloadProgress.status === 'downloading' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: downloadProgress.percent ?
                        (typeof downloadProgress.percent === 'string' ?
                          downloadProgress.percent.replace('%', '') + '%' :
                          downloadProgress.percent + '%') :
                        '0%'
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{downloadProgress.percent || '0%'}</span>
                  <span>{downloadProgress.speed || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo; 