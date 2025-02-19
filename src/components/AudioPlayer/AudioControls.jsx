import playIcon from '../../assets/play2.svg';
import pauseIcon from '../../assets/pause.svg';
import closeIcon from '../../assets/xmark.svg';

const AudioControls = ({ isPlaying, onPlayPause, onClose }) => {
  return (
    <div className="flex items-center gap-4 audio-controls">
  <button 
  onClick={onPlayPause}
  className={`p-2 ${isPlaying ? 'playing' : ''}`}
>

    <img 
      src={isPlaying ? pauseIcon : playIcon} 
      alt={isPlaying ? "Pause" : "Play"}
    />
  </button>
  <button onClick={onClose} className="p-2">
    <img src={closeIcon} alt="Close" />
  </button>
</div>

  );
};

export default AudioControls;
