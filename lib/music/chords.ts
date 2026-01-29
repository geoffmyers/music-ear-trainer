import type { ChordType, NoteOctave } from '@/lib/types/music';
import { addSemitones } from './noteFrequencies';
import chordsData from '@shared/music-ear-trainer/data/chords.json';

export const CHORD_TYPES: ChordType[] = chordsData.chords as ChordType[];

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
