import { Link, useLocation } from 'react-router-dom';
import { BookOpenIcon, MicrophoneIcon, CogIcon } from '@heroicons/react/24/outline';

const BottomTabs = () => {
  const location = useLocation();

  return (
    <nav className="ios-bottom-tabs">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-ios-primary' : 'text-gray-600'}`}>
        <BookOpenIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Surahs</span>
      </Link>
      
      <Link to="/reciters" className={`flex flex-col items-center ${location.pathname === '/reciters' ? 'text-ios-primary' : 'text-gray-600'}`}>
        <MicrophoneIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Reciters</span>
      </Link>
      
      <Link to="/settings" className={`flex flex-col items-center ${location.pathname === '/settings' ? 'text-ios-primary' : 'text-gray-600'}`}>
        <CogIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </nav>
  );
};

export default BottomTabs;
