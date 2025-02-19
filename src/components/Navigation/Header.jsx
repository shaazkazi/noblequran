import { useHistory, useLocation } from 'react-router-dom';
import BackButton from '../BackButton';
import { useState, useEffect } from 'react';
import { fetchSurahs } from '../../services/quranApi';

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const [surahName, setSurahName] = useState('');
  const showBackButton = location.pathname !== '/';

  useEffect(() => {
    const getSurahName = async () => {
      if (location.pathname.includes('/surah/')) {
        const surahId = location.pathname.split('/surah/')[1];
        const surahs = await fetchSurahs();
        const surah = surahs.find(s => s.id.toString() === surahId);
        if (surah) {
          setSurahName(surah.name_simple);
        }
      }
    };

    getSurahName();
  }, [location.pathname]);

  const getTitle = () => {
    const title = (() => {
      switch (true) {
        case location.pathname === '/':
          return 'The Noble Quran';
        case location.pathname === '/reciters':
          return 'Reciters';
        case location.pathname.includes('/surah/'):
          return surahName ? `Surah ${surahName}` : 'Loading...';
        case location.pathname.includes('/reciter/'):
          return 'Reciter';
        default:
          return 'The Noble Quran';
      }
    })();

    return (
      <span 
        onClick={() => window.location.reload()}
        className="cursor-pointer"
      >
        {title}
      </span>
    );
  };

  return (
    <header className="ios-header">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {/* Back button should be inside the same flex container */}
        {showBackButton && <BackButton onClick={() => history.goBack()} className="mr-2" />}
        
        <h1 className="text-xl font-semibold flex-1 text-center font-quran cursor-pointer">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
};

export default Header;
