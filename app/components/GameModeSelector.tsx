'use client';

import type { GameMode } from '@/lib/types/game';
import Header from './Header';

interface Props {
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelector({ onSelectMode }: Props) {
  return (
    <div className="mode-selector">
      <Header showSubtitle />

      <div className="mode-grid">
        <div className="mode-card" onClick={() => onSelectMode('intervals')}>
          <div className="mode-icon">🎵</div>
          <h2>Intervals</h2>
          <p>Test your ability to identify the distance between two notes. From unisons to octaves.</p>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('chords')}>
          <div className="mode-icon">🎹</div>
          <h2>Chords</h2>
          <p>Recognize different chord types including major, minor, diminished, and augmented.</p>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('progressions')}>
          <div className="mode-icon">🎼</div>
          <h2>Progressions</h2>
          <p>Identify common chord progressions used in popular music.</p>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('scales')}>
          <div className="mode-icon">🎶</div>
          <h2>Scales</h2>
          <p>Learn to recognize different scale types from major and minor to modes and exotic scales.</p>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('pitches')}>
          <div className="mode-icon">🎯</div>
          <h2>Perfect Pitch</h2>
          <p>Develop absolute pitch by identifying individual notes without any reference.</p>
        </div>
      </div>
    </div>
  );
}
