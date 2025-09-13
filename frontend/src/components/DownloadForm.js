import axios from 'axios';
import { AlertCircle, Loader, Search } from 'lucide-react';
import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const DownloadForm = ({ onVideoInfo, isLoadingInfo, setIsLoadingInfo }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Por favor ingresa una URL de YouTube');
      return;
    }

    // Validar URL de YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      setError('Por favor ingresa una URL válida de YouTube');
      return;
    }

    setIsLoadingInfo(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/video-info`, {
        url: url.trim()
      });

      onVideoInfo(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al obtener información del video');
      onVideoInfo(null);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Error al pegar:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-3">
          URL del Video de YouTube
        </label>
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              disabled={isLoadingInfo}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handlePaste}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={isLoadingInfo}
          >
            📋 Pegar
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoadingInfo || !url.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
      >
        {isLoadingInfo ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Obteniendo información del video...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Obtener Información del Video</span>
          </>
        )}
      </button>
    </form>
  );
};

export default DownloadForm; 