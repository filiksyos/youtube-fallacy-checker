import React, { useEffect, useState, useRef } from 'react';
import { videoDataService } from '../services/VideoDataService';
import { FallacyDetectionService } from '../services/FallacyDetectionService';
import { TranscriptView } from '../components/TranscriptView';
import { Settings } from '../components/Settings';
import { FallacyPopup } from '../components/FallacyPopup';
import { Fallacy, TranscriptSegment } from '../types';
import './Sidebar.scss';

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [width, setWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [fallacies, setFallacies] = useState<Fallacy[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [currentFallacy, setCurrentFallacy] = useState<Fallacy | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Load API key from storage
    chrome.storage.local.get(['openrouterApiKey'], (result) => {
      if (result.openrouterApiKey) {
        setApiKey(result.openrouterApiKey);
      } else {
        setShowSettings(true);
      }
    });

    // Get current video ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('v');
    if (id) {
      setVideoId(id);
    }

    // Get video element
    videoRef.current = document.querySelector('video');
  }, []);

  useEffect(() => {
    if (videoId && apiKey) {
      loadAndAnalyze();
    }
  }, [videoId, apiKey]);

  // Monitor video playback for fallacy notifications
  useEffect(() => {
    if (!videoRef.current || fallacies.length === 0) return;

    const video = videoRef.current;
    const checkFallacies = () => {
      const currentTime = video.currentTime;
      const activeFallacy = fallacies.find(
        (f) => Math.abs(f.timestamp - currentTime) < 2
      );
      
      if (activeFallacy && (!currentFallacy || currentFallacy.id !== activeFallacy.id)) {
        setCurrentFallacy(activeFallacy);
      } else if (!activeFallacy && currentFallacy) {
        setCurrentFallacy(null);
      }
    };

    video.addEventListener('timeupdate', checkFallacies);
    return () => {
      video.removeEventListener('timeupdate', checkFallacies);
    };
  }, [fallacies, currentFallacy]);

  const loadAndAnalyze = async () => {
    if (!videoId) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const videoData = await videoDataService.fetchVideoData(videoId);
      const segments = parseTranscript(videoData.transcript);
      setTranscript(segments);

      const detectionService = new FallacyDetectionService(apiKey);
      const detectedFallacies = await detectionService.detectFallacies(segments);
      setFallacies(detectedFallacies);
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseTranscript = (transcriptText: string): TranscriptSegment[] => {
    const lines = transcriptText.split('\n');
    return lines
      .map((line) => {
        const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?) - (.+)$/);
        if (match) {
          const [, timestamp, text] = match;
          return {
            timestamp: convertTimestampToSeconds(timestamp),
            text: text.trim(),
          };
        }
        return null;
      })
      .filter((s): s is TranscriptSegment => s !== null);
  };

  const convertTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parts[0] * 60 + parts[1];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 300 && newWidth <= 800) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    chrome.storage.local.set({ openrouterApiKey: key });
    setShowSettings(false);
  };

  return (
    <>
      <div className="sidebar" ref={sidebarRef} style={{ width: `${width}px` }}>
        <div className="sidebar__resize-handle" onMouseDown={handleMouseDown} />
        <div className="sidebar__header">
          <button className="sidebar__close" onClick={onClose}>
            ✕
          </button>
          <h1 className="sidebar__title">Fallacy Checker</h1>
          <button
            className={`sidebar__settings ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </button>
        </div>

        <div className="sidebar__content">
          {showSettings ? (
            <Settings apiKey={apiKey} onSave={handleSaveApiKey} />
          ) : (
            <>
              {error && <div className="sidebar__error">{error}</div>}
              {isAnalyzing && (
                <div className="sidebar__loading">
                  <div className="spinner"></div>
                  <p>Analyzing video for fallacies...</p>
                </div>
              )}
              {!isAnalyzing && transcript.length > 0 && (
                <TranscriptView
                  transcript={transcript}
                  fallacies={fallacies}
                  onTimestampClick={(timestamp) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = timestamp;
                      videoRef.current.play();
                    }
                  }}
                />
              )}
              {!apiKey && (
                <div className="sidebar__setup">
                  <p>Please configure your OpenRouter API key in settings.</p>
                  <button onClick={() => setShowSettings(true)}>Open Settings</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {currentFallacy && (
        <FallacyPopup
          fallacy={currentFallacy}
          onClose={() => setCurrentFallacy(null)}
        />
      )}
    </>
  );
};