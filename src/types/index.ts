export interface TranscriptSegment {
  timestamp: number;
  text: string;
}

export interface Fallacy {
  id: string;
  timestamp: number;
  type: string;
  explanation: string;
  context: string;
}