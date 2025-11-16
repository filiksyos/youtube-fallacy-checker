import React from 'react';
import { TranscriptSegment, Fallacy } from '../types';
import './TranscriptView.scss';

interface TranscriptViewProps {
  transcript: TranscriptSegment[];
  fallacies: Fallacy[];
  onTimestampClick: (timestamp: number) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  fallacies,
  onTimestampClick
}) => {
  const formatTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getFallacyForSegment = (timestamp: number): Fallacy | undefined => {
    return fallacies.find((f) => Math.abs(f.timestamp - timestamp) < 5);
  };

  return (
    <div className="transcript-view">
      <div className="transcript-view__header">
        <h2>Transcript Analysis</h2>
        <div className="transcript-view__stats">
          <span className="fallacy-count">
            {fallacies.length} {fallacies.length === 1 ? 'fallacy' : 'fallacies'} detected
          </span>
        </div>
      </div>

      <div className="transcript-view__content">
        {transcript.map((segment, index) => {
          const fallacy = getFallacyForSegment(segment.timestamp);
          return (
            <div
              key={index}
              className={`transcript-segment ${fallacy ? 'has-fallacy' : ''}`}
            >
              <button
                className="transcript-segment__timestamp"
                onClick={() => onTimestampClick(segment.timestamp)}
              >
                {formatTimestamp(segment.timestamp)}
              </button>
              <div className="transcript-segment__text">
                {segment.text}
                {fallacy && (
                  <div className="transcript-segment__fallacy">
                    <strong>⚠️ {fallacy.type}</strong>
                    <p>{fallacy.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};