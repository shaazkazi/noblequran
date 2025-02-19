import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Settings = () => {
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

  const fontSizes = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem',
    xlarge: '3rem'
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--arabic-font-size', fontSizes[settings.fontSize]);
  }, [settings.theme, settings.fontSize]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      if (key === 'theme') {
        document.documentElement.setAttribute('data-theme', value);
      }
      if (key === 'fontSize') {
        document.documentElement.style.setProperty('--arabic-font-size', fontSizes[value]);
      }
      return newSettings;
    });
  };

  return (
    <div className="settings-container">
      <div className="ios-card">
        <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
        
        <div className="setting-group">
          <span className="setting-label">Theme</span>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="ios-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="setting-group">
          <span className="setting-label">Arabic Font Size</span>
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            className="ios-select"
          >
            {Object.keys(fontSizes).map(size => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ios-card mt-4">
        <h2 className="text-xl font-semibold mb-4">Reading Preferences</h2>
        
        <div className="setting-group">
          <span className="setting-label">Default Translation</span>
          <select
            value={settings.defaultTranslation}
            onChange={(e) => handleSettingChange('defaultTranslation', e.target.value)}
            className="ios-select"
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div className="setting-toggle">
          <span className="setting-label">Show Translation</span>
          <label className="ios-toggle">
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(e) => handleSettingChange('showTranslation', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-toggle">
          <span className="setting-label">Show Transliteration</span>
          <label className="ios-toggle">
            <input
              type="checkbox"
              checked={settings.showTransliteration}
              onChange={(e) => handleSettingChange('showTransliteration', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="ios-card mt-4">
        <h2 className="text-xl font-semibold mb-4">Audio Settings</h2>
        
        <div className="setting-toggle">
          <span className="setting-label">Auto-play Next Surah</span>
          <label className="ios-toggle">
            <input
              type="checkbox"
              checked={settings.autoPlayNext}
              onChange={(e) => handleSettingChange('autoPlayNext', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
