export const convertTimestampToSeconds = (timestamp: string): number | null => {
  const parts = timestamp.split(':').map(Number);
  
  if (parts.some(isNaN)) return null;
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (seconds >= 60 || minutes >= 60) return null;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (seconds >= 60) return null;
    return minutes * 60 + seconds;
  }
  
  return null;
};

export const seekToTimestamp = (timestamp: string) => {
  try {
    const parts = timestamp.split(':').map(Number);
    let seconds = 0;
    
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      seconds = parts[0] * 60 + parts[1];
    }
    
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = seconds;
      video.play().catch(() => {});
    }
  } catch (error) {
    console.error('Error seeking to timestamp:', error);
  }
};

export const secondsToTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};