'use client';

import type { GameMode, Difficulty } from '@/lib/types/game';
import Header from './Header';

interface Props {
  mode: GameMode;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onHomeClick?: () => void;
}

export default function DifficultySelector({ mode, onSelectDifficulty, onBack, onHomeClick }: Props) {
  const modeNames: Record<GameMode, string> = {
    intervals: 'Intervals',
    chords: 'Chords',
    progressions: 'Progressions',
    pitches: 'Perfect Pitch',
    scales: 'Scales'
  };

  return (
    <div className="difficulty-selector">
      <Header onHomeClick={onHomeClick} />

      <button className="back-button" onClick={onBack}>
        ← Back to Mode Selection
      </button>

      <div className="mode-title">
        <h2 className="mode-name">{modeNames[mode]}</h2>
        <p className="mode-subtitle">Choose your difficulty level</p>
      </div>

      <div className="difficulty-grid">
        <div className="difficulty-card" onClick={() => onSelectDifficulty('easy')}>
          <h2>Easy</h2>
          <ul className="difficulty-features">
            <li>3 answer options</li>
            <li>Basic {mode === 'intervals' ? 'intervals' : mode === 'chords' ? 'chords' : mode === 'pitches' ? 'natural notes only' : mode === 'scales' ? 'major/minor scales' : 'progressions'}</li>
            {mode === 'pitches' && <li>Single octave range</li>}
            <li>No time limit</li>
            <li>Perfect for beginners</li>
          </ul>
        </div>

        <div className="difficulty-card" onClick={() => onSelectDifficulty('medium')}>
          <h2>Medium</h2>
          <ul className="difficulty-features">
            <li>4 answer options</li>
            <li>More complex variations</li>
            {mode === 'chords' && <li>Chord inversions included</li>}
            {mode === 'intervals' && <li>Ascending & descending</li>}
            {mode === 'pitches' && <li>Common sharps/flats</li>}
            {mode === 'pitches' && <li>Three octave range</li>}
            {mode === 'scales' && <li>Pentatonic & harmonic minor</li>}
            <li>No time limit</li>
          </ul>
        </div>

        <div className="difficulty-card" onClick={() => onSelectDifficulty('hard')}>
          <h2>Hard</h2>
          <ul className="difficulty-features">
            <li>6 answer options</li>
            <li>All variations included</li>
            {mode === 'chords' && <li>Complex chords & inversions</li>}
            {mode === 'intervals' && <li>All interval types</li>}
            {mode === 'pitches' && <li>All 12 pitch classes</li>}
            {mode === 'pitches' && <li>Five octave range</li>}
            {mode === 'scales' && <li>Modes, blues & exotic scales</li>}
            <li>For advanced players</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
