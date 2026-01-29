import type { Progression, ChordType, Key, NoteOctave } from '@/lib/types/music';
import { CHORD_TYPES } from './chords';
import { addSemitones } from './noteFrequencies';
import progressionsData from '@shared/music-ear-trainer/data/progressions.json';

export const PROGRESSIONS: Progression[] = progressionsData.progressions as Progression[];

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
