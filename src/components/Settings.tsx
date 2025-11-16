import React, { useState } from 'react';
import './Settings.scss';

interface SettingsProps {
  apiKey: string;
  onSave: (apiKey: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ apiKey, onSave }) => {
  const [inputValue, setInputValue] = useState(apiKey);

  const handleSave = () => {
    onSave(inputValue);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="settings__section">
        <label htmlFor="api-key">OpenRouter API Key</label>
        <p className="settings__help">
          Get your API key from{' '}
          <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">
            openrouter.ai
          </a>
        </p>
        <input
          id="api-key"
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-or-v1-..."
          className="settings__input"
        />
      </div>

      <button onClick={handleSave} className="settings__save">
        Save Settings
      </button>

      <div className="settings__info">
        <h3>About</h3>
        <p>
          This extension uses AI to detect logical fallacies in YouTube videos.
          Fallacies are highlighted in the transcript and shown as popups during playback.
        </p>
        <p>
          <strong>Keyboard shortcut:</strong> Alt+F to toggle sidebar
        </p>
      </div>
    </div>
  );
};