import type { ChordType, NoteOctave } from '@/lib/types/music';
import { addSemitones } from './noteFrequencies';

export const CHORD_TYPES: ChordType[] = [
  // Easy chords
  { id: 'maj', name: 'Major', intervals: [0, 4, 7], abbreviation: 'maj', difficulty: 'easy' },
  { id: 'min', name: 'Minor', intervals: [0, 3, 7], abbreviation: 'min', difficulty: 'easy' },

  // Medium chords
  { id: 'dim', name: 'Diminished', intervals: [0, 3, 6], abbreviation: 'dim', difficulty: 'medium' },
  { id: 'aug', name: 'Augmented', intervals: [0, 4, 8], abbreviation: 'aug', difficulty: 'medium' },

  // Hard chords
  { id: 'maj7', name: 'Major 7th', intervals: [0, 4, 7, 11], abbreviation: 'maj7', difficulty: 'hard' },
  { id: 'min7', name: 'Minor 7th', intervals: [0, 3, 7, 10], abbreviation: 'min7', difficulty: 'hard' },
  { id: 'dom7', name: 'Dominant 7th', intervals: [0, 4, 7, 10], abbreviation: '7', difficulty: 'hard' },
  { id: 'sus2', name: 'Suspended 2nd', intervals: [0, 2, 7], abbreviation: 'sus2', difficulty: 'hard' },
  { id: 'sus4', name: 'Suspended 4th', intervals: [0, 5, 7], abbreviation: 'sus4', difficulty: 'hard' },
];

export function getChordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ChordType[] {
  if (difficulty === 'easy') return CHORD_TYPES.filter(c => c.difficulty === 'easy');
  if (difficulty === 'medium') return CHORD_TYPES.filter(c => c.difficulty === 'easy' || c.difficulty === 'medium');
  return CHORD_TYPES;
}

export function getChordNotes(rootNote: NoteOctave, chord: ChordType, inversion: 0 | 1 | 2 = 0): NoteOctave[] {
  const notes = chord.intervals.map(semitones => addSemitones(rootNote, semitones));

  // Apply inversion
  for (let i = 0; i < inversion; i++) {
    const bottomNote = notes.shift()!;
    notes.push(addSemitones(bottomNote, 12));
  }

  return notes;
}
