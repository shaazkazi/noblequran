import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchSurahs } from '../../services/quranApi';
import { fetchReciters } from '../../services/mp3QuranApi';
import playIcon from '../../assets/play2.svg';

const SurahList = ({ onPlayAudio }) => {
  const history = useHistory();
  const [surahs, setSurahs] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [surahsData, recitersData] = await Promise.all([
          fetchSurahs(),
          fetchReciters()
        ]);
        setSurahs(surahsData);
        setReciters(recitersData);
        setSelectedReciter(recitersData[0]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlay = (e, surah) => {
    e.stopPropagation();
    if (!selectedReciter) return;
    
    const paddedNumber = surah.id.toString().padStart(3, '0');
    const audioUrl = `${selectedReciter.Server}/${paddedNumber}.mp3`;
    
    const audioData = {
      audioUrl,
      title: surah.name_simple, // Remove the "Surah" prefix to match AudioPlayer's expectations
      surahNumber: surah.id,    // Add surah number for reference
      reciter: selectedReciter.name,
      onReciterChange: (newReciterId) => {
        const newReciter = reciters.find(r => r.id === newReciterId);
        if (newReciter) {
          setSelectedReciter(newReciter);
          const newUrl = `${newReciter.Server}/${paddedNumber}.mp3`;
          onPlayAudio({
            ...audioData,
            audioUrl: newUrl,
            reciter: newReciter.name
          });
        }
      }
    };
    
    onPlayAudio(audioData);
  };
  

  const filteredSurahs = surahs.filter(surah =>
    surah.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.id.toString().includes(searchQuery)
  );

  if (loading) return <div className="ios-card">Loading surahs...</div>;

  return (
    <div>
      <div className="ios-card">
        <div className="setting-group mb-4">
          <span className="setting-label">Reciter</span>
          <select
            value={selectedReciter?.id}
            onChange={(e) => {
              const reciter = reciters.find(r => r.id === e.target.value);
              setSelectedReciter(reciter);
            }}
            className="ios-select"
          >
            {reciters.map(r => (
              <option key={r.id} value={r.id}>
                {r.name.split('(')[0].trim()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-bar">
        <svg 
          className="search-icon" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="search"
          placeholder="Search surahs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="divide-y">
        {filteredSurahs.map((surah) => (
          <div
            key={surah.id}
            className="ios-list-item cursor-pointer"
            onClick={() => history.push(`/surah/${surah.id}`)}
          >
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 flex items-center justify-center bg-ios-primary/10 rounded-full mr-4">
                <span className="text-ios-primary font-semibold">{surah.id}</span>
              </div>
              <div>
                <h3 className="font-semibold">{surah.name_simple}</h3>
                <p className="text-sm text-gray-500">{surah.translated_name.name}</p>
              </div>
            </div>
            <button
              onClick={(e) => handlePlay(e, surah)}
              className="play-button ml-4"
            >
              <img
                src={playIcon}
                alt="Play"
                style={{ width: '16px', height: '16px' }}
                className="filter-white"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
