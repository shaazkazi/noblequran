import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Navigation/Header';
import BottomTabs from './components/Navigation/BottomTabs';
import SurahList from './components/Surah/SurahList';
import SurahDetail from './components/Surah/SurahDetail';
import ReciterList from './components/Reciter/ReciterList';
import ReciterDetail from './components/Reciter/ReciterDetail';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import BackButton from './components/BackButton';
import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Settings from './components/Settings/Settings';
import { SettingsProvider } from './context/SettingsContext';
import './styles/index.css'

function App() {
  const [currentAudio, setCurrentAudio] = useLocalStorage('currentAudio', null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    function isIos() {
      return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    function isInStandaloneMode() {
      return 'standalone' in window.navigator && window.navigator.standalone;
    }

    if (isIos() && !isInStandaloneMode() && !localStorage.getItem('pwaPromptDismissed')) {
      setShowInstallPrompt(true);
    }
  }, []);

  function dismissPrompt() {
    setShowInstallPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  }

  return (
    <SettingsProvider>
      <Router>
        <div className="ios-container">
          <Header>
            <BackButton onClick={() => window.history.back()} />
          </Header>

          <main className="container mx-auto max-w-2xl">
            <Switch>
              <Route exact path="/">
                <SurahList onPlayAudio={setCurrentAudio} />
              </Route>
              <Route path="/surah/:id">
                <SurahDetail onPlayAudio={setCurrentAudio} />
              </Route>
              <Route exact path="/reciters">
                <ReciterList />
              </Route>
              <Route path="/reciter/:id">
                <ReciterDetail onPlayAudio={setCurrentAudio} />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
            </Switch>
          </main>

          {currentAudio && (
            <AudioPlayer
              audioData={currentAudio}
              onClose={() => setCurrentAudio(null)}
            />
          )}

          <BottomTabs />

          {/* iOS PWA Install Prompt */}
          {showInstallPrompt && (
            <div className="pwa-install-prompt">
              <img src="/icon512_rounded.png" alt="App Icon" />
              <span>📲 Install NobleQuran: Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></span>
              <button onClick={dismissPrompt}>OK</button>
            </div>
          )}
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
