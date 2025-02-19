import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReciters } from '../../services/mp3QuranApi';
import { fetchSurahs } from '../../services/quranApi';
import playIcon from '../../assets/play2.svg';

const ReciterDetail = ({ onPlayAudio }) => {
  const { id } = useParams();
  const [surahs, setSurahs] = useState([]);
  const [reciter, setReciter] = useState(null);
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recitersList, allSurahs] = await Promise.all([
          fetchReciters(),
          fetchSurahs()
        ]);

        setReciters(recitersList);
        const currentReciter = recitersList.find(r => r.id === id);
        if (!currentReciter) throw new Error('Invalid reciter data');
        setReciter(currentReciter);

        const surahsList = allSurahs.map(surah => ({
          id: surah.id,
          number: surah.id,
          name: surah.name_simple,
          translation: surah.translated_name.name,
          audioUrl: `${currentReciter.Server}/${String(surah.id).padStart(3, '0')}.mp3`
        }));

        setSurahs(surahsList);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handlePlay = (surah) => {
    onPlayAudio({
      audioUrl: surah.audioUrl,
      title: surah.name,
      reciter: reciter.name
    });
  };

  if (loading) return <div className="ios-card">Loading reciter details...</div>;

  return (
    <div>
      <div className="ios-card">
        <div className="setting-group mb-4">
          <span className="setting-label">Reciter</span>
          <select
            value={reciter?.id}
            onChange={(e) => window.location.href = `/reciter/${e.target.value}`}
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

      <div className="divide-y">
        {surahs.map((surah) => (
          <div key={surah.id} className="ios-list-item">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 flex items-center justify-center bg-ios-primary/10 rounded-full">
                <span className="text-ios-primary font-semibold">{surah.number}</span>
              </div>
              <div>
                <h3 className="font-semibold">{surah.name}</h3>
                <p className="text-sm text-gray-500">Surah {surah.number}</p>
              </div>
            </div>
            <button
              onClick={() => handlePlay(surah)}
              className="play-button"
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

export default ReciterDetail;
