'use client';

import { useState } from 'react';
import { useGlobalSettings } from '@/lib/context/GlobalSettingsContext';
import { ALL_NOTES } from '@/lib/types/settings';
import type { SoundType } from '@/lib/types/audio';
import type { AccidentalPreference, PlaybackStyle, ColorTheme } from '@/lib/types/settings';

// Time limit options for slider (null represented as 0)
const TIME_LIMITS = [0, 5, 10, 15, 20, 30, 45, 60];

function getTimeLimitLabel(value: number | null): string {
  if (value === null || value === 0) return 'No Limit';
  return `${value}s`;
}

export default function Footer() {
  const { settings, updateSettings, resetSettings } = useGlobalSettings();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuestionsSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    updateSettings({ questionsPerQuiz: value });
  };

  const handleTimeLimitSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    const value = TIME_LIMITS[index];
    updateSettings({
      timeLimitPerQuestion: value === 0 ? null : value
    });
  };

  const handleLowestNoteSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    const note = ALL_NOTES[index];
    // Ensure lowest note doesn't exceed highest note
    const highestIndex = ALL_NOTES.indexOf(settings.highestNote);
    if (index <= highestIndex) {
      updateSettings({ lowestNote: note });
    }
  };

  const handleHighestNoteSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    const note = ALL_NOTES[index];
    // Ensure highest note doesn't go below lowest note
    const lowestIndex = ALL_NOTES.indexOf(settings.lowestNote);
    if (index >= lowestIndex) {
      updateSettings({ highestNote: note });
    }
  };

  const handleSoundTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ soundType: e.target.value as SoundType });
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) / 100;
    updateSettings({ volume: value });
  };

  const handleAccidentalsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ accidentals: e.target.value as AccidentalPreference });
  };

  const handlePlaybackStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ playbackStyle: e.target.value as PlaybackStyle });
  };

  const handleMultiplePlaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ allowMultiplePlays: e.target.checked });
  };

  const handleColorThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ colorTheme: e.target.value as ColorTheme });
  };

  const handleResetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      resetSettings();
    }
  };

  // Get current indices for sliders
  const lowestNoteIndex = ALL_NOTES.indexOf(settings.lowestNote);
  const highestNoteIndex = ALL_NOTES.indexOf(settings.highestNote);
  const timeLimitIndex = settings.timeLimitPerQuestion === null
    ? 0
    : TIME_LIMITS.indexOf(settings.timeLimitPerQuestion);

  return (
    <>
      {/* Settings Side Panel */}
      <div className={`settings-panel ${isExpanded ? 'expanded' : ''}`}>
        <button
          className="settings-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Hide Settings' : 'Show Settings'}
        >
          <span className="toggle-icon">{isExpanded ? '›' : '‹'}</span>
          <span className="toggle-text">Settings</span>
        </button>

        <div className="settings-content">
          <h2 className="settings-title">Global Settings</h2>

          <div className="settings-list">
            <div className="setting-item">
              <label htmlFor="questionsPerQuiz">Questions per Quiz</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="questionsPerQuiz"
                  className="setting-slider"
                  min="5"
                  max="100"
                  step="5"
                  value={settings.questionsPerQuiz}
                  onChange={handleQuestionsSliderChange}
                />
                <div className="slider-value">{settings.questionsPerQuiz}</div>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="timeLimit">Time Limit</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="timeLimit"
                  className="setting-slider"
                  min="0"
                  max={TIME_LIMITS.length - 1}
                  value={timeLimitIndex >= 0 ? timeLimitIndex : 0}
                  onChange={handleTimeLimitSliderChange}
                />
                <div className="slider-value">{getTimeLimitLabel(settings.timeLimitPerQuestion)}</div>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="lowestNote">Lowest Note</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="lowestNote"
                  className="setting-slider"
                  min="0"
                  max={highestNoteIndex}
                  value={lowestNoteIndex}
                  onChange={handleLowestNoteSliderChange}
                />
                <div className="slider-value">{settings.lowestNote}</div>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="highestNote">Highest Note</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="highestNote"
                  className="setting-slider"
                  min={lowestNoteIndex}
                  max={ALL_NOTES.length - 1}
                  value={highestNoteIndex}
                  onChange={handleHighestNoteSliderChange}
                />
                <div className="slider-value">{settings.highestNote}</div>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="soundType">Sound Type</label>
              <select
                id="soundType"
                value={settings.soundType}
                onChange={handleSoundTypeChange}
              >
                <optgroup label="Waveforms">
                  <option value="sine">Sine</option>
                  <option value="square">Square</option>
                  <option value="sawtooth">Sawtooth</option>
                  <option value="triangle">Triangle</option>
                </optgroup>
                <optgroup label="Instruments">
                  <option value="piano">Piano</option>
                  <option value="guitar">Guitar</option>
                  <option value="violin">Violin</option>
                  <option value="flute">Flute</option>
                  <option value="trumpet">Trumpet</option>
                </optgroup>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="volume">Volume</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="volume"
                  className="setting-slider"
                  min="0"
                  max="100"
                  step="5"
                  value={Math.round(settings.volume * 100)}
                  onChange={handleVolumeSliderChange}
                />
                <div className="slider-value">{Math.round(settings.volume * 100)}%</div>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="accidentals">Accidentals</label>
              <select
                id="accidentals"
                value={settings.accidentals}
                onChange={handleAccidentalsChange}
              >
                <option value="sharps">Sharps only</option>
                <option value="flats">Flats only</option>
                <option value="both">Both</option>
                <option value="none">None (naturals only)</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="playbackStyle">Playback Style</label>
              <select
                id="playbackStyle"
                value={settings.playbackStyle}
                onChange={handlePlaybackStyleChange}
              >
                <option value="separately">Play notes separately</option>
                <option value="together">Play notes together</option>
              </select>
            </div>

            <div className="setting-item checkbox-item">
              <label htmlFor="multiplePlays">
                <input
                  type="checkbox"
                  id="multiplePlays"
                  checked={settings.allowMultiplePlays}
                  onChange={handleMultiplePlaysChange}
                />
                Allow multiple plays
              </label>
            </div>

            <div className="setting-item">
              <label htmlFor="colorTheme">Color Theme</label>
              <select
                id="colorTheme"
                value={settings.colorTheme}
                onChange={handleColorThemeChange}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <button className="reset-settings-button" onClick={handleResetSettings}>
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <div className="copyright">
          © {new Date().getFullYear()} <a href="https://www.geoffmyers.com" target="_blank" rel="noopener noreferrer">Geoff Myers</a>
        </div>
        <div className="version-info">
          Last Updated: {new Date(process.env.NEXT_PUBLIC_BUILD_DATE || '').toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
      </footer>
    </>
  );
}
