export class VideoDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VideoDataError';
  }
}

export class NoCaptionsVideoDataError extends VideoDataError {
  constructor() {
    super('This video has no captions available');
    this.name = 'NoCaptionsVideoDataError';
  }
}

export class DataAccessVideoDataError extends VideoDataError {
  constructor(message: string = 'Failed to access video data') {
    super(message);
    this.name = 'DataAccessVideoDataError';
  }
}