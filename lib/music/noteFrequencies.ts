import type { Key, NoteOctave } from '@/lib/types/music';

// Equal temperament formula: f = 440 × 2^((n-49)/12)
// where n is the piano key number (A4 = 49)

export const A4_FREQUENCY = 440; // Hz
export const A4_KEY_NUMBER = 49;

export function noteToFrequency(note: Key, octave: number): number {
  const noteValues: Record<Key, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };

  // C0 is key number 4
  const keyNumber = (octave * 12) + noteValues[note] + 4;
  const semitonesFromA4 = keyNumber - A4_KEY_NUMBER;

  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
}

export function addSemitones(note: NoteOctave, semitones: number): NoteOctave {
  const notes: Key[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note.note);

  let totalSemitones = noteIndex + semitones;
  let octaveShift = Math.floor(totalSemitones / 12);
  let newNoteIndex = totalSemitones % 12;

  if (newNoteIndex < 0) {
    newNoteIndex += 12;
    octaveShift -= 1;
  }

  return {
    note: notes[newNoteIndex],
    octave: note.octave + octaveShift
  };
}
