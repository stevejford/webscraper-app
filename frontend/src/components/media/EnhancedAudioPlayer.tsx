import React, { useState, useRef, useEffect } from 'react';
import { ScrapedContent } from '../../types/api';
import { useScrapingStore } from '../../store/scrapingStore';

interface EnhancedAudioPlayerProps {
  content: ScrapedContent;
  onClose?: () => void;
  compact?: boolean;
}

export const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({ 
  content, 
  onClose,
  compact = false 
}) => {
  const { currentSession } = useScrapingStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Get audio URL with fallback logic
  useEffect(() => {
    const getAudioUrl = () => {
      // Use public_url if available (from Supabase Storage)
      if (content.public_url) {
        return content.public_url;
      }
      // Fall back to API endpoint if file_path is available
      if (content.file_path && currentSession) {
        return `/api/content/${currentSession.id}/${content.file_path}`;
      }
      // Final fallback to original URL
      return content.url;
    };

    const url = getAudioUrl();
    setAudioUrl(url);
    setLoading(false);
  }, [content, currentSession]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setError('');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  // Control functions
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = content.title || content.filename || 'audio';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading audio...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={!!error}
            className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Progress */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!!error}
                className="flex-1"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-1">
            <button onClick={toggleMute} className="text-gray-600 hover:text-gray-800">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16"
            />
          </div>

          {/* Download */}
          <button
            onClick={downloadAudio}
            className="text-gray-600 hover:text-gray-800"
            title="Download"
          >
            📥
          </button>
        </div>

        {error && (
          <div className="mt-2 text-red-600 text-sm">{error}</div>
        )}
      </div>
    );
  }

  // Full player view
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold">
              {content.title || content.filename || 'Audio File'}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {content.file_size && `${(content.file_size / 1024 / 1024).toFixed(1)} MB`}
              {content.mime_type && ` • ${content.mime_type}`}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <p className="text-lg">{error}</p>
            </div>
            <button
              onClick={downloadAudio}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Download Audio File
            </button>
          </div>
        ) : (
          <>
            {/* Main Controls */}
            <div className="text-center mb-6">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 text-2xl mx-auto"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Volume Control */}
              <div>
                <label className="block text-sm font-medium mb-2">Volume</label>
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMute} className="text-gray-600 hover:text-gray-800">
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{Math.round((isMuted ? 0 : volume) * 100)}</span>
                </div>
              </div>

              {/* Playback Speed */}
              <div>
                <label className="block text-sm font-medium mb-2">Speed</label>
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>

              {/* Download */}
              <div>
                <label className="block text-sm font-medium mb-2">Actions</label>
                <button
                  onClick={downloadAudio}
                  className="w-full bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                >
                  📥 Download
                </button>
              </div>
            </div>

            {/* Audio Info */}
            <div className="border-t pt-4 text-sm text-gray-600">
              <p><strong>Source:</strong> {content.url}</p>
              {content.source_page_url && (
                <p><strong>Found on:</strong> {content.source_page_url}</p>
              )}
              {content.downloaded_at && (
                <p><strong>Downloaded:</strong> {new Date(content.downloaded_at).toLocaleString()}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
