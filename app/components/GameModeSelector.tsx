'use client';

import type { GameMode } from '@/lib/types/game';
import Header from './Header';

interface Props {
  onSelectMode: (mode: GameMode) => void;
}

interface ModeCardProps {
  onSelect: () => void;
  icon: string;
  title: string;
  description: string;
}

// Cards are keyboard-operable buttons styled as cards, not click-only divs:
// role="button" plus a real tabIndex and Enter/Space handling.
function ModeCard({ onSelect, icon, title, description }: ModeCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className="mode-card"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${description}`}
    >
      <div className="mode-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function GameModeSelector({ onSelectMode }: Props) {
  return (
    <div className="mode-selector">
      <Header showSubtitle />

      <div className="mode-grid">
        <ModeCard
          onSelect={() => onSelectMode('intervals')}
          icon="🎵"
          title="Intervals"
          description="Test your ability to identify the distance between two notes. From unisons to octaves."
        />

        <ModeCard
          onSelect={() => onSelectMode('chords')}
          icon="🎹"
          title="Chords"
          description="Recognize different chord types including major, minor, diminished, and augmented."
        />

        <ModeCard
          onSelect={() => onSelectMode('progressions')}
          icon="🎼"
          title="Progressions"
          description="Identify common chord progressions used in popular music."
        />

        <ModeCard
          onSelect={() => onSelectMode('scales')}
          icon="🎶"
          title="Scales"
          description="Learn to recognize different scale types from major and minor to modes and exotic scales."
        />

        <ModeCard
          onSelect={() => onSelectMode('pitches')}
          icon="🎯"
          title="Perfect Pitch"
          description="Develop absolute pitch by identifying individual notes without any reference."
        />
      </div>
    </div>
  );
}
