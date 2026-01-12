import type { Progression, ChordType, Key, NoteOctave } from '@/lib/types/music';
import { CHORD_TYPES } from './chords';
import { addSemitones } from './noteFrequencies';

export const PROGRESSIONS: Progression[] = [
  // Easy progressions (3-4 chords)
  { id: 'I-IV-V', name: 'I–IV–V', romanNumerals: ['I', 'IV', 'V'], chordDegrees: [1, 4, 5], difficulty: 'easy' },
  { id: 'I-V-vi-IV', name: 'I–V–vi–IV', romanNumerals: ['I', 'V', 'vi', 'IV'], chordDegrees: [1, 5, 6, 4], difficulty: 'easy' },
  { id: 'vi-IV-I-V', name: 'vi–IV–I–V', romanNumerals: ['vi', 'IV', 'I', 'V'], chordDegrees: [6, 4, 1, 5], difficulty: 'easy' },

  // Medium progressions
  { id: 'I-vi-IV-V', name: 'I–vi–IV–V', romanNumerals: ['I', 'vi', 'IV', 'V'], chordDegrees: [1, 6, 4, 5], difficulty: 'medium' },
  { id: 'IV-V-I-vi', name: 'IV–V–I–vi', romanNumerals: ['IV', 'V', 'I', 'vi'], chordDegrees: [4, 5, 1, 6], difficulty: 'medium' },
  { id: 'I-IV-vi-V', name: 'I–IV–vi–V', romanNumerals: ['I', 'IV', 'vi', 'V'], chordDegrees: [1, 4, 6, 5], difficulty: 'medium' },

  // Hard progressions (include ii, iii, vii)
  { id: 'ii-V-I', name: 'ii–V–I', romanNumerals: ['ii', 'V', 'I'], chordDegrees: [2, 5, 1], difficulty: 'hard' },
  { id: 'I-iii-vi-IV', name: 'I–iii–vi–IV', romanNumerals: ['I', 'iii', 'vi', 'IV'], chordDegrees: [1, 3, 6, 4], difficulty: 'hard' },
];

export function getProgressionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Progression[] {
  if (difficulty === 'easy') return PROGRESSIONS.filter(p => p.difficulty === 'easy');
  if (difficulty === 'medium') return PROGRESSIONS.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
  return PROGRESSIONS;
}

// Convert scale degree to chord type (simplified - major/minor only)
export function degreeToChordType(degree: number): ChordType {
  // In major scale: I, ii, iii, IV, V, vi, vii°
  const majorScaleChords = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
  const chordTypeId = majorScaleChords[degree - 1];
  return CHORD_TYPES.find(c => c.id === chordTypeId)!;
}

export function getProgressionChords(key: Key, progression: Progression): { degree: number; chord: ChordType; rootNote: NoteOctave }[] {
  const keyNote: NoteOctave = { note: key, octave: 4 };
  const majorScale = [0, 2, 4, 5, 7, 9, 11]; // Semitones for major scale

  return progression.chordDegrees.map(degree => {
    const scaleSemitone = majorScale[degree - 1];
    const rootNote = addSemitones(keyNote, scaleSemitone);
    const chordType = degreeToChordType(degree);

    return { degree, chord: chordType, rootNote };
  });
}
