import { Link, useLocation } from 'react-router-dom';
import surahsIcon from '../assets/surahs.svg';
import micIcon from '../assets/mic.svg';
import settingsIcon from '../assets/settings.svg';

const BottomTabs = () => {
  const location = useLocation();

  return (
    <nav className="ios-bottom-tabs">
      <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
        <img src={surahsIcon} alt="Surahs" className="tab-icon" />
        <span>Surahs</span>
      </Link>
      
      <Link to="/reciters" className={`tab-item ${location.pathname === '/reciters' ? 'active' : ''}`}>
        <img src={micIcon} alt="Reciters" className="tab-icon" />
        <span>Reciters</span>
      </Link>
      
      <Link to="/settings" className={`tab-item ${location.pathname === '/settings' ? 'active' : ''}`}>
        <img src={settingsIcon} alt="Settings" className="tab-icon" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default BottomTabs;
