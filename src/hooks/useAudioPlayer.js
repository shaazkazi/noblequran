import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const progressInterval = useRef();

  const initializeAudio = useCallback((audioUrl) => {
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.onplay = () => {
      setIsPlaying(true);
      startProgressTracking();
    };

    audioRef.current.onpause = () => {
      setIsPlaying(false);
      stopProgressTracking();
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      stopProgressTracking();
      
      const settings = JSON.parse(localStorage.getItem('quran-settings'));
      if (settings?.autoPlayNext) {
        const currentUrl = audioRef.current.src;
        const urlParts = currentUrl.split('/');
        const currentNumber = parseInt(urlParts[urlParts.length - 1]);
        
        if (currentNumber < 114) {
          const nextNumber = (currentNumber + 1).toString().padStart(3, '0');
          const nextUrl = `${urlParts.slice(0, -1).join('/')}/${nextNumber}.mp3`;
          initializeAudio(nextUrl);
          audioRef.current.play();
        }
      }
    };
  }, []);

  const startProgressTracking = () => {
    progressInterval.current = setInterval(() => {
      const currentTime = audioRef.current.currentTime;
      const audioDuration = audioRef.current.duration;
      setProgress((currentTime / audioDuration) * 100);
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  const seek = useCallback((percent) => {
    const time = (percent / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(percent);
  }, []);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  return {
    isPlaying,
    progress,
    duration,
    initializeAudio,
    togglePlayPause,
    seek
  };
};
