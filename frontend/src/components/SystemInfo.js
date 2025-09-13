import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, MemoryStick, Folder, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSystemInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/system-info`);
      setSystemInfo(response.data);
    } catch (err) {
      setError('Error al cargar la información del sistema');
      console.error('Error fetching system info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchSystemInfo, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsageColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUsageTextColor = (percentage) => {
    if (percentage < 50) return 'text-green-700';
    if (percentage < 80) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Cargando información del sistema...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchSystemInfo}
          className="btn-primary"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de actualización */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Monitoreo del Sistema</h3>
          <p className="text-sm text-gray-600">Información en tiempo real del servidor</p>
        </div>
        <button
          onClick={fetchSystemInfo}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Métricas del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900">CPU</span>
            </div>
            <span className={`text-sm font-medium ${getUsageTextColor(systemInfo?.cpu_percent || 0)}`}>
              {systemInfo?.cpu_percent?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo?.cpu_percent || 0)}`}
              style={{ width: `${systemInfo?.cpu_percent || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Uso del procesador</p>
        </div>

        {/* Memoria */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900">Memoria</span>
            </div>
            <span className={`text-sm font-medium ${getUsageTextColor(systemInfo?.memory_percent || 0)}`}>
              {systemInfo?.memory_percent?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo?.memory_percent || 0)}`}
              style={{ width: `${systemInfo?.memory_percent || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Uso de RAM</p>
        </div>

        {/* Disco */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-900">Disco</span>
            </div>
            <span className={`text-sm font-medium ${getUsageTextColor(systemInfo?.disk_usage || 0)}`}>
              {systemInfo?.disk_usage?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo?.disk_usage || 0)}`}
              style={{ width: `${systemInfo?.disk_usage || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Uso del disco</p>
        </div>
      </div>

      {/* Información de descargas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Folder className="w-5 h-5 text-orange-500" />
          <h4 className="font-medium text-gray-900">Directorio de Descargas</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Espacio usado</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatBytes(systemInfo?.download_dir_size || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Ubicación</p>
            <p className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              ./downloads/
            </p>
          </div>
        </div>
      </div>

      {/* Información del backend */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Estado del Backend</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">API Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">Online</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Servidor</p>
            <p className="text-sm text-gray-700">FastAPI + yt-dlp</p>
          </div>
        </div>
      </div>

      {/* Consejos */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Consejos de Rendimiento</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Mantén el uso de CPU por debajo del 80% para descargas óptimas</li>
          <li>• Supervisa el espacio en disco regularmente</li>
          <li>• Las descargas simultáneas pueden aumentar el uso de recursos</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemInfo; 