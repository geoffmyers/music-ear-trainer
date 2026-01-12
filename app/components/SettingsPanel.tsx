'use client';

import { useState } from 'react';
import type { WaveformType } from '@/lib/types/audio';

interface Props {
  volume: number;
  waveform: WaveformType;
  onVolumeChange: (volume: number) => void;
  onWaveformChange: (waveform: WaveformType) => void;
  onResetStats: () => void;
}

export default function SettingsPanel({
  volume,
  waveform,
  onVolumeChange,
  onWaveformChange,
  onResetStats
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="settings-panel">
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Settings {isOpen ? '▼' : '▶'}
      </button>

      {isOpen && (
        <div className="settings-content">
          <div className="setting-group">
            <label className="setting-label">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
            />
          </div>

          <div className="setting-group">
            <label className="setting-label">Waveform</label>
            <select
              className="waveform-select"
              value={waveform}
              onChange={(e) => onWaveformChange(e.target.value as WaveformType)}
            >
              <option value="sine">Sine (Smooth)</option>
              <option value="triangle">Triangle (Mellow)</option>
              <option value="square">Square (Harsh)</option>
              <option value="sawtooth">Sawtooth (Bright)</option>
            </select>
          </div>

          <div className="setting-group">
            <button className="reset-button" onClick={onResetStats}>
              Reset All Statistics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
