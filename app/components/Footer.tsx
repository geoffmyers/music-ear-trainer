'use client';

import { useState, useRef, useEffect } from 'react';
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

// GitHub's octicon "mark-github", used as the required source-code-link icon.
// Inline SVG so no CSP change is needed and it inherits the surrounding text colour.
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
    </svg>
  );
}

export default function Footer() {
  const { settings, updateSettings, resetSettings } = useGlobalSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const wasExpandedRef = useRef(false);

  // Focus management for the settings panel, which behaves like a slide-out
  // dialog: move focus into it on open, back to the toggle button on close,
  // and let Escape close it like any other dialog.
  useEffect(() => {
    if (isExpanded) {
      firstFieldRef.current?.focus();
    } else if (wasExpandedRef.current) {
      toggleButtonRef.current?.focus();
    }
    wasExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  // Chords and scales need roughly an octave of headroom around the root; a
  // note range narrower than that will still play (the root is clamped as
  // close to the range as possible - see lib/music/noteRange.ts), but some
  // notes may extend slightly beyond what's configured here.
  const rangeSpan = ALL_NOTES.indexOf(settings.highestNote) - ALL_NOTES.indexOf(settings.lowestNote);
  const rangeIsNarrow = rangeSpan >= 0 && rangeSpan < 12;

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
          ref={toggleButtonRef}
          className="settings-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Hide Settings' : 'Show Settings'}
          aria-expanded={isExpanded}
          aria-controls="global-settings-panel"
        >
          <span className="toggle-icon">{isExpanded ? '›' : '‹'}</span>
          <span className="toggle-text">Settings</span>
        </button>

        <div
          id="global-settings-panel"
          className="settings-content"
          role="dialog"
          aria-modal={isExpanded}
          aria-label="Global settings"
          aria-hidden={!isExpanded}
          onKeyDown={handlePanelKeyDown}
        >
          <h2 className="settings-title">Global Settings</h2>

          <div className="settings-list">
            <div className="setting-item">
              <label htmlFor="questionsPerQuiz">Questions per Quiz</label>
              <div className="slider-container">
                <input
                  ref={firstFieldRef}
                  type="range"
                  id="questionsPerQuiz"
                  className="setting-slider"
                  min="5"
                  max="100"
                  step="5"
                  value={settings.questionsPerQuiz}
                  onChange={handleQuestionsSliderChange}
                  tabIndex={isExpanded ? 0 : -1}
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
                  aria-valuetext={getTimeLimitLabel(settings.timeLimitPerQuestion)}
                  tabIndex={isExpanded ? 0 : -1}
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
                  aria-valuetext={settings.lowestNote}
                  tabIndex={isExpanded ? 0 : -1}
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
                  aria-valuetext={settings.highestNote}
                  tabIndex={isExpanded ? 0 : -1}
                />
                <div className="slider-value">{settings.highestNote}</div>
              </div>
              {rangeIsNarrow && (
                <p className="setting-hint">
                  A range this narrow may not fit a full chord or scale; notes
                  that don&apos;t fit are placed as close to it as possible.
                </p>
              )}
            </div>

            <div className="setting-item">
              <label htmlFor="soundType">Sound Type</label>
              <select
                id="soundType"
                value={settings.soundType}
                onChange={handleSoundTypeChange}
                tabIndex={isExpanded ? 0 : -1}
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
                  aria-valuetext={`${Math.round(settings.volume * 100)}%`}
                  tabIndex={isExpanded ? 0 : -1}
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
                tabIndex={isExpanded ? 0 : -1}
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
                tabIndex={isExpanded ? 0 : -1}
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
                  tabIndex={isExpanded ? 0 : -1}
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
                tabIndex={isExpanded ? 0 : -1}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <button
            className="reset-settings-button"
            onClick={handleResetSettings}
            tabIndex={isExpanded ? 0 : -1}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Author and licence (the GPL is the only licence; no separate copyright notice) */}
      <footer className="copyright-footer">
        <div className="copyright">
          By <a href="https://www.geoffmyers.com" target="_blank" rel="noopener noreferrer">Geoff Myers</a>
          {' · '}
          <a href="https://github.com/geoffmyers/music-ear-trainer/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">GPL-3.0-or-later</a>
        </div>
        <div className="github-source-link">
          <a
            href="https://github.com/geoffmyers/music-ear-trainer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <GitHubIcon />
            <span>View source on GitHub</span>
          </a>
        </div>
        {/*
          The samples are the part that legally needs this: tonejs-instruments
          releases them CC BY 3.0, which requires the credit to travel with
          them, and nothing in this repo recorded where they came from until
          now. The libraries below are permissive and credited as courtesy.
        */}
        <div className="credits-info">
          Instrument samples from{' '}
          <a href="https://github.com/nbrosowsky/tonejs-instruments" target="_blank" rel="noopener noreferrer">tonejs-instruments</a>{' '}
          (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>) ·
          audio by <a href="https://tonejs.github.io/" target="_blank" rel="noopener noreferrer">Tone.js</a> ·
          notation by <a href="https://www.vexflow.com/" target="_blank" rel="noopener noreferrer">VexFlow</a> ·
          built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a> and{' '}
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a> — all MIT
        </div>
        <div className="version-info">
          Last Updated: {new Date(process.env.NEXT_PUBLIC_BUILD_DATE || '').toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
      </footer>
    </>
  );
}
