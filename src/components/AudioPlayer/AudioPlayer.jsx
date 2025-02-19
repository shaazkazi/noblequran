import { useEffect, useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { fetchSurahs } from '../../services/quranApi';
import AudioControls from './AudioControls';

const AudioPlayer = ({ audioData, onClose }) => {
  const [surahName, setSurahName] = useState('');
  const [surahs, setSurahs] = useState([]);
  const { isPlaying, progress, duration, initializeAudio, togglePlayPause, seek, currentUrl } = useAudioPlayer();

  useEffect(() => {
    const loadSurahs = async () => {
      const allSurahs = await fetchSurahs();
      setSurahs(allSurahs);
    };
    loadSurahs();
  }, []);

  useEffect(() => {
    const updateSurahName = () => {
      if (surahs.length > 0) {
        const url = currentUrl || audioData.audioUrl;
        const surahNumber = parseInt(url.split('/').pop().replace('.mp3', ''));
        const surah = surahs.find(s => s.id === surahNumber);
        if (surah) {
          setSurahName(surah.name_simple);
        } else {
          setSurahName(audioData.title);
        }
      }
    };

    updateSurahName();
    initializeAudio(audioData.audioUrl);
  }, [audioData, currentUrl, surahs, initializeAudio]);

  const handleClose = () => {
    if (audioData.onClose) {
      audioData.onClose();
    }
    onClose();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentTime = duration * (progress / 100);
  const reciterName = audioData.reciter?.split('(')[0].trim() || audioData.reciter;

  return (
    <div className="audio-player">
      <div className="player-content">
        <div className="player-info">
          <h3 className="player-title">{surahName || audioData.title}</h3>
          <p className="player-reciter">{reciterName}</p>
        </div>
        <AudioControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onClose={handleClose}
        />
      </div>
      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div
          className="progress-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            seek(percent);
          }}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
