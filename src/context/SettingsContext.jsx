import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('quran-settings', {
    theme: 'light',
    fontSize: 'medium',
    arabicFont: 'Al Qalam Quran',
    defaultReciter: null,
    defaultTranslation: 'en',
    autoPlayNext: false,
    showTranslation: true,
    showTransliteration: false
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
