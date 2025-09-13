import { Youtube } from 'lucide-react';
import React, { useState } from 'react';
import DownloadForm from './components/DownloadForm';
import VideoInfo from './components/VideoInfo';
import './index.css';

function App() {
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">YouTube Downloader</h1>
                <p className="text-sm text-gray-500">Descarga videos y audio de YouTube</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Local App</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Sección principal de descarga */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Descargar Video de YouTube
              </h2>
              <p className="text-gray-600">
                Pega la URL del video y selecciona la calidad que prefieras
              </p>
            </div>
            <DownloadForm
              onVideoInfo={setVideoInfo}
              isLoadingInfo={isLoadingInfo}
              setIsLoadingInfo={setIsLoadingInfo}
            />
          </div>

          {/* Información del video */}
          {videoInfo && (
            <VideoInfo
              videoInfo={videoInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 