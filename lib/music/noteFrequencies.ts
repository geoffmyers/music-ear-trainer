import type { Key, NoteOctave } from '@/lib/types/music';

// Equal temperament formula: f = 440 × 2^((n-49)/12)
// where n is the piano key number (A4 = 49)

export const A4_FREQUENCY = 440; // Hz
export const A4_KEY_NUMBER = 49;

// Shared pitch-class table (scientific pitch notation: C4 = middle C).
// Exported so lib/music/noteRange.ts can do octave-range arithmetic without
// duplicating this map a third time (MusicStaff.tsx keeps its own copy for
// unrelated, purely-local display math).
export const NOTE_VALUES: Record<Key, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

export function noteToFrequency(note: Key, octave: number): number {
  // Piano key numbers run 1 (A0) to 88 (C8). C0 is key number -8, i.e.
  // (0 - 1) * 12 + 0 + 4 = -8; A0 is (0 - 1) * 12 + 9 + 4 = 1. octave - 1
  // is what makes octave 4 land on middle C (key 40) instead of C5.
  const keyNumber = ((octave - 1) * 12) + NOTE_VALUES[note] + 4;
  const semitonesFromA4 = keyNumber - A4_KEY_NUMBER;

  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
}

export function addSemitones(note: NoteOctave, semitones: number): NoteOctave {
  const notes: Key[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note.note);

  const totalSemitones = noteIndex + semitones;
  // Math.floor already gives the correct floor-division octave shift for
  // negative totals (e.g. -1 -> -1, not 0); deriving newNoteIndex from it
  // directly (rather than JS's truncating `%`, which returns -1 for -1 % 12)
  // keeps it in [0, 11] without a second, double-counted correction.
  const octaveShift = Math.floor(totalSemitones / 12);
  const newNoteIndex = totalSemitones - octaveShift * 12;

  return {
    note: notes[newNoteIndex],
    octave: note.octave + octaveShift
  };
}
