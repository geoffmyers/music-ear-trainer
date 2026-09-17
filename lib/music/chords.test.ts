import { describe, it, expect } from 'vitest';
import { getChordNotes, getChordsByDifficulty, CHORD_TYPES } from './chords';

const majorTriad = CHORD_TYPES.find(c => c.id === 'maj')!;
const minorTriad = CHORD_TYPES.find(c => c.id === 'min')!;

describe('getChordNotes', () => {
  it('spells a C major triad as C-E-G in root position', () => {
    const notes = getChordNotes({ note: 'C', octave: 4 }, majorTriad, 0);
    expect(notes).toEqual([
      { note: 'C', octave: 4 },
      { note: 'E', octave: 4 },
      { note: 'G', octave: 4 }
    ]);
  });

  it('spells a C minor triad as C-D#-G (the app spells flats as sharps)', () => {
    const notes = getChordNotes({ note: 'C', octave: 4 }, minorTriad, 0);
    expect(notes).toEqual([
      { note: 'C', octave: 4 },
      { note: 'D#', octave: 4 },
      { note: 'G', octave: 4 }
    ]);
  });

  it('1st inversion moves the root up an octave to the top', () => {
    const notes = getChordNotes({ note: 'C', octave: 4 }, majorTriad, 1);
    expect(notes).toEqual([
      { note: 'E', octave: 4 },
      { note: 'G', octave: 4 },
      { note: 'C', octave: 5 }
    ]);
  });

  it('2nd inversion moves the bottom two notes up an octave', () => {
    const notes = getChordNotes({ note: 'C', octave: 4 }, majorTriad, 2);
    expect(notes).toEqual([
      { note: 'G', octave: 4 },
      { note: 'C', octave: 5 },
      { note: 'E', octave: 5 }
    ]);
  });
});

describe('getChordsByDifficulty', () => {
  it('easy includes only easy chords', () => {
    expect(getChordsByDifficulty('easy').every(c => c.difficulty === 'easy')).toBe(true);
  });

  it('is monotonically inclusive: hard includes every easy and medium chord', () => {
    const easy = getChordsByDifficulty('easy');
    const hard = getChordsByDifficulty('hard');
    for (const c of easy) {
      expect(hard.map(h => h.id)).toContain(c.id);
    }
    expect(hard.length).toBeGreaterThanOrEqual(getChordsByDifficulty('medium').length);
  });
});
