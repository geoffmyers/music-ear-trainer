import type { Key } from '@/lib/types/music';

export interface PitchDefinition {
  id: string;
  note: Key;
  displayName: string; // User-friendly name (e.g., "C", "C#/Db", "Bb/A#")
  difficulty: 'easy' | 'medium' | 'hard';
}

// All 12 pitch classes with enharmonic spellings
export const PITCH_DEFINITIONS: PitchDefinition[] = [
  // Easy: Natural notes (no sharps/flats)
  { id: 'C', note: 'C', displayName: 'C', difficulty: 'easy' },
  { id: 'D', note: 'D', displayName: 'D', difficulty: 'easy' },
  { id: 'E', note: 'E', displayName: 'E', difficulty: 'easy' },
  { id: 'F', note: 'F', displayName: 'F', difficulty: 'easy' },
  { id: 'G', note: 'G', displayName: 'G', difficulty: 'easy' },
  { id: 'A', note: 'A', displayName: 'A', difficulty: 'easy' },
  { id: 'B', note: 'B', displayName: 'B', difficulty: 'easy' },

  // Medium: Common sharps/flats
  { id: 'Bb', note: 'A#', displayName: 'Bb', difficulty: 'medium' },
  { id: 'Eb', note: 'D#', displayName: 'Eb', difficulty: 'medium' },
  { id: 'F#', note: 'F#', displayName: 'F#', difficulty: 'medium' },

  // Hard: Less common sharps/flats
  { id: 'C#', note: 'C#', displayName: 'C#/Db', difficulty: 'hard' },
  { id: 'G#', note: 'G#', displayName: 'G#/Ab', difficulty: 'hard' },
];

export function getPitchesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): PitchDefinition[] {
  switch (difficulty) {
    case 'easy':
      return PITCH_DEFINITIONS.filter(p => p.difficulty === 'easy');
    case 'medium':
      return PITCH_DEFINITIONS.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
    case 'hard':
      return PITCH_DEFINITIONS;
  }
}

// Octave ranges by difficulty
export function getOctaveRange(difficulty: 'easy' | 'medium' | 'hard'): { min: number; max: number } {
  switch (difficulty) {
    case 'easy':
      return { min: 4, max: 4 }; // Single octave (middle C range)
    case 'medium':
      return { min: 3, max: 5 }; // Three octaves
    case 'hard':
      return { min: 2, max: 6 }; // Five octaves
  }
}
