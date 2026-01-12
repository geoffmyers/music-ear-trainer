import type { Interval } from '@/lib/types/music';

export const INTERVALS: Interval[] = [
  // Easy intervals
  { id: 'P1', name: 'Perfect Unison', semitones: 0, abbreviation: 'P1', difficulty: 'easy' },
  { id: 'M2', name: 'Major 2nd', semitones: 2, abbreviation: 'M2', difficulty: 'easy' },
  { id: 'M3', name: 'Major 3rd', semitones: 4, abbreviation: 'M3', difficulty: 'easy' },
  { id: 'P4', name: 'Perfect 4th', semitones: 5, abbreviation: 'P4', difficulty: 'easy' },
  { id: 'P5', name: 'Perfect 5th', semitones: 7, abbreviation: 'P5', difficulty: 'easy' },
  { id: 'P8', name: 'Perfect Octave', semitones: 12, abbreviation: 'P8', difficulty: 'easy' },

  // Medium intervals
  { id: 'm2', name: 'Minor 2nd', semitones: 1, abbreviation: 'm2', difficulty: 'medium' },
  { id: 'm3', name: 'Minor 3rd', semitones: 3, abbreviation: 'm3', difficulty: 'medium' },
  { id: 'M6', name: 'Major 6th', semitones: 9, abbreviation: 'M6', difficulty: 'medium' },
  { id: 'M7', name: 'Major 7th', semitones: 11, abbreviation: 'M7', difficulty: 'medium' },

  // Hard intervals
  { id: 'TT', name: 'Tritone', semitones: 6, abbreviation: 'TT', difficulty: 'hard' },
  { id: 'm6', name: 'Minor 6th', semitones: 8, abbreviation: 'm6', difficulty: 'hard' },
  { id: 'm7', name: 'Minor 7th', semitones: 10, abbreviation: 'm7', difficulty: 'hard' },
];

export function getIntervalsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Interval[] {
  if (difficulty === 'easy') return INTERVALS.filter(i => i.difficulty === 'easy');
  if (difficulty === 'medium') return INTERVALS.filter(i => i.difficulty === 'easy' || i.difficulty === 'medium');
  return INTERVALS; // hard includes all
}
