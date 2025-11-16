import { OpenRouterService } from './OpenRouterService';
import { Fallacy, TranscriptSegment } from '../types';
import { FALLACY_DETECTION_PROMPT } from '../utils/fallacyPrompt';

export class FallacyDetectionService {
  private openRouterService: OpenRouterService;

  constructor(apiKey: string) {
    this.openRouterService = new OpenRouterService(apiKey);
  }

  async detectFallacies(transcript: TranscriptSegment[]): Promise<Fallacy[]> {
    const transcriptText = transcript
      .map((segment) => `[${this.formatTimestamp(segment.timestamp)}] ${segment.text}`)
      .join('\n');

    const messages = [
      {
        role: 'system' as const,
        content: FALLACY_DETECTION_PROMPT
      },
      {
        role: 'user' as const,
        content: `Analyze the following YouTube video transcript for logical fallacies. For each fallacy found, return the timestamp, type, and explanation.\n\n${transcriptText}`
      }
    ];

    const response = await this.openRouterService.generateResponse(messages);
    return this.parseFallacies(response, transcript);
  }

  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private parseFallacies(aiResponse: string, transcript: TranscriptSegment[]): Fallacy[] {
    const fallacies: Fallacy[] = [];
    const lines = aiResponse.split('\n');
    let currentFallacy: Partial<Fallacy> | null = null;

    for (const line of lines) {
      const timestampMatch = line.match(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/);
      const typeMatch = line.match(/(?:Type|Fallacy):\s*(.+)/i);
      const explanationMatch = line.match(/(?:Explanation|Description):\s*(.+)/i);

      if (timestampMatch) {
        if (currentFallacy && currentFallacy.timestamp !== undefined && currentFallacy.type && currentFallacy.explanation) {
          fallacies.push(currentFallacy as Fallacy);
        }
        
        const timestamp = this.parseTimestamp(timestampMatch[1]);
        currentFallacy = {
          id: `fallacy-${Date.now()}-${Math.random()}`,
          timestamp,
          type: '',
          explanation: '',
          context: this.getContextForTimestamp(timestamp, transcript)
        };
      } else if (typeMatch && currentFallacy) {
        currentFallacy.type = typeMatch[1].trim();
      } else if (explanationMatch && currentFallacy) {
        currentFallacy.explanation = explanationMatch[1].trim();
      }
    }

    if (currentFallacy && currentFallacy.timestamp !== undefined && currentFallacy.type && currentFallacy.explanation) {
      fallacies.push(currentFallacy as Fallacy);
    }

    return fallacies;
  }

  private parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parts[0] * 60 + parts[1];
  }

  private getContextForTimestamp(timestamp: number, transcript: TranscriptSegment[]): string {
    const segment = transcript.find(
      (s) => Math.abs(s.timestamp - timestamp) < 5
    );
    return segment ? segment.text : '';
  }
}