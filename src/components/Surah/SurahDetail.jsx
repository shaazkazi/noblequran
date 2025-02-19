import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSurahDetails } from '../../services/quranApi';
import { fetchReciters, isReciterSurahAvailable, getAudioUrl } from '../../services/mp3QuranApi';
import TranslationSelector from '../Translation/TranslationSelector';
import playIcon from '../../assets/play2.svg';
import pauseIcon from '../../assets/pause.svg';

const SurahDetail = ({ onPlayAudio }) => {
  const { id } = useParams();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translation, setTranslation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  useEffect(() => {
    const loadReciters = async () => {
      try {
        const recitersList = await fetchReciters();
        setReciters(recitersList);
        const availableReciter = recitersList.find(r => isReciterSurahAvailable(r, id));
        setSelectedReciter(availableReciter || recitersList[0]);
      } catch (error) {
        console.error('Error loading reciters:', error);
      }
    };
    loadReciters();
  }, [id]);

  useEffect(() => {
    return () => setIsPlayerVisible(false);
  }, []);

  const handleReciterChange = (e) => {
    const reciter = reciters.find(r => r.id === e.target.value);
    if (!reciter) return;

    setSelectedReciter(reciter);
    if (isPlayerVisible && isReciterSurahAvailable(reciter, id)) {
      playAudio(reciter);
    }
  };

  const playAudio = (reciter) => {
    if (!reciter || !isReciterSurahAvailable(reciter, id)) {
      alert(`Surah ${id} is not available for ${reciter.name}`);
      return;
    }
  
    const paddedNumber = id.toString().padStart(3, '0');
    const audioUrl = `${reciter.Server}/${paddedNumber}.mp3`;
  
    onPlayAudio({
      audioUrl,
      title: `Surah ${id}`,
      reciter: reciter.name,
      onClose: () => {
        setIsPlayerVisible(false);
        setIsPlaying(false);
      }
    });
  };

  const togglePlay = () => {
    if (!selectedReciter) return;
    setIsPlaying(true);
    setIsPlayerVisible(true);
    playAudio(selectedReciter);
  };

  useEffect(() => {
    const loadSurahDetails = async () => {
      try {
        const data = await fetchSurahDetails(id, translation);
        setVerses(data.verses);
      } catch (error) {
        console.error('Error loading surah details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSurahDetails();
  }, [id, translation]);

  if (loading) {
    return <div className="ios-card">Loading surah details...</div>;
  }

  return (
    <div className="surah-container">
      <div className="settings-container">
        <div className="setting-group">
          <span className="setting-label">Translation</span>
          <TranslationSelector 
            value={translation} 
            onChange={setTranslation}
          />
        </div>

        <div className="setting-group">
          <span className="setting-label">Reciter</span>
          <select
            value={selectedReciter?.id}
            onChange={handleReciterChange}
            className="ios-select"
          >
            {reciters.map(reciter => (
              <option
                key={reciter.id}
                value={reciter.id}
                disabled={!isReciterSurahAvailable(reciter, id)}
              >
                {reciter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="verses-container">
        {verses.map((verse) => (
          <div key={verse.id} className="verse-card">
            <span className="verse-number">
              {verse.number}
            </span>
            <p className="arabic-text" dir="rtl">
              {verse.text}
            </p>
            {verse.translation && (
              <p className="translation-text">
                {verse.translation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!isPlayerVisible && (
        <button
          onClick={togglePlay}
          className="floating-play-button"
          disabled={!selectedReciter || !isReciterSurahAvailable(selectedReciter, id)}
        >
          <img src={playIcon} alt="Play" />
        </button>
      )}
    </div>
  );
};

export default SurahDetail;
