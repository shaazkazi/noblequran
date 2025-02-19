import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Navigation/Header';
import BottomTabs from './components/Navigation/BottomTabs';
import SurahList from './components/Surah/SurahList';
import SurahDetail from './components/Surah/SurahDetail';
import ReciterList from './components/Reciter/ReciterList';
import ReciterDetail from './components/Reciter/ReciterDetail';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import BackButton from './components/BackButton';
import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Settings from './components/Settings/Settings';
import { SettingsProvider } from './context/SettingsContext';


function App() {
  const [currentAudio, setCurrentAudio] = useLocalStorage('currentAudio', null);

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
      </div>
    </Router>
    </SettingsProvider>
  );
}

export default App;
