import { VideoDataError, NoCaptionsVideoDataError, DataAccessVideoDataError } from '../errors/VideoDataError';
import { getEncoding } from 'js-tiktoken';
import { fetchYouTubeTranscript } from './YouTubeTranscriptAPI';

interface VideoData {
  videoId: string;
  title: string;
  description: string;
  transcript: string;
  timestamp: number;
}

class VideoDataService {
  private static CACHE_DURATION = 30 * 60 * 1000;
  private videoDataCache = new Map<string, { data: VideoData; expiresAt: number }>();

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private async generateYouTubeAPIAuthHeader(): Promise<string> {
    const sapisid = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('SAPISID='))
      ?.split('=')[1];
    
    if (!sapisid) {
      throw new Error('SAPISID cookie not found - YouTube authentication required');
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    const origin = 'https://www.youtube.com';
    const hashInput = `${timestamp}_${sapisid}_${origin}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `SAPISIDHASH ${timestamp}_${hashHex}`;
  }

  private async fetchTranscriptWithNewAPI(videoId: string): Promise<string> {
    const authHeader = await this.generateYouTubeAPIAuthHeader();
    const result = await fetchYouTubeTranscript({ videoId, authHeader });
    
    if (result.segments) {
      const lines = result.segments.map((segmentWrapper: any) => {
        const segment = segmentWrapper.transcriptSegmentRenderer;
        if (!segment) return null;
        
        const startMs = parseInt(segment.startMs) || 0;
        const startTime = this.formatTime(startMs);
        const text = segment.snippet?.runs?.[0]?.text || '';
        
        return text ? `${startTime} - ${text.trim()}` : null;
      }).filter((line: string | null) => line);

      return lines.join('\n');
    }
    throw new Error('No segments in new API response');
  }

  async fetchVideoData(videoId: string): Promise<VideoData> {
    const cachedEntry = this.videoDataCache.get(videoId);
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return cachedEntry.data;
    }

    try {
      const transcript = await this.fetchTranscriptWithNewAPI(videoId);
      
      const videoData: VideoData = {
        videoId,
        title: document.title.replace(' - YouTube', ''),
        description: '',
        transcript,
        timestamp: Date.now()
      };

      this.videoDataCache.set(videoId, {
        data: videoData,
        expiresAt: Date.now() + VideoDataService.CACHE_DURATION
      });

      return videoData;
    } catch (error: any) {
      if (error instanceof VideoDataError) {
        throw error;
      }
      throw new DataAccessVideoDataError(error.message || 'Failed to fetch transcript');
    }
  }
}

export const videoDataService = new VideoDataService();