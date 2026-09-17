import { describe, it, expect } from 'vitest';
import {
  parseNoteOctave,
  noteOctaveToSemitone,
  resolveOctaveRange,
  relativeSemitoneOffsets,
  semitoneSpan,
  pickRootOctave
} from './noteRange';

describe('parseNoteOctave', () => {
  it('parses a natural note', () => {
    expect(parseNoteOctave('C3')).toEqual({ note: 'C', octave: 3 });
  });

  it('parses a sharp note', () => {
    expect(parseNoteOctave('F#5')).toEqual({ note: 'F#', octave: 5 });
  });

  it('falls back to C4 for malformed input', () => {
    expect(parseNoteOctave('not-a-note')).toEqual({ note: 'C', octave: 4 });
  });
});

describe('noteOctaveToSemitone', () => {
  it('is monotonic across octaves for the same note', () => {
    const c3 = noteOctaveToSemitone({ note: 'C', octave: 3 });
    const c4 = noteOctaveToSemitone({ note: 'C', octave: 4 });
    expect(c4 - c3).toBe(12);
  });
});

describe('resolveOctaveRange', () => {
  it('intersects an overlapping default and user range', () => {
    // Default 3-5, user range C2-C4 -> overlap is 3-4
    expect(resolveOctaveRange({ min: 3, max: 5 }, 'C2', 'C4')).toEqual({ min: 3, max: 4 });
  });

  it('falls back to the user range when there is no overlap', () => {
    // Default 3-4 (chords), user range entirely above it
    expect(resolveOctaveRange({ min: 3, max: 4 }, 'C6', 'C7')).toEqual({ min: 6, max: 7 });
  });

  it('is order-independent for lowestNote/highestNote', () => {
    expect(resolveOctaveRange({ min: 3, max: 5 }, 'C5', 'C2')).toEqual({ min: 3, max: 5 });
  });
});

describe('relativeSemitoneOffsets + semitoneSpan', () => {
  it('computes the span of a major triad (0, 4, 7) relative to its root', () => {
    const notes = [
      { note: 'C' as const, octave: 0 },
      { note: 'E' as const, octave: 0 },
      { note: 'G' as const, octave: 0 }
    ];
    const offsets = relativeSemitoneOffsets('C', notes);
    expect(offsets).toEqual([0, 4, 7]);
    expect(semitoneSpan(offsets)).toEqual({ below: 0, above: 7 });
  });

  it('reports "below" for notes under the root (e.g. a descending interval)', () => {
    expect(semitoneSpan([0, -5])).toEqual({ below: 5, above: 0 });
  });
});

describe('pickRootOctave', () => {
  it('stays within a wide configured range', () => {
    const low = noteOctaveToSemitone({ note: 'C', octave: 2 });
    const high = noteOctaveToSemitone({ note: 'C', octave: 6 });
    for (let i = 0; i < 50; i++) {
      const octave = pickRootOctave('C', 'C2', 'C6', 0, 7, { min: 3, max: 4 });
      const rootSemitone = noteOctaveToSemitone({ note: 'C', octave });
      expect(rootSemitone).toBeGreaterThanOrEqual(low);
      expect(rootSemitone + 7).toBeLessThanOrEqual(high);
    }
  });

  it('clamps into the fallback range when the span cannot fit the configured range', () => {
    // A one-semitone-wide range (C3 to C3) can never fit a 7-semitone chord.
    const octave = pickRootOctave('C', 'C3', 'C3', 0, 7, { min: 3, max: 4 });
    expect(octave).toBeGreaterThanOrEqual(3);
    expect(octave).toBeLessThanOrEqual(4);
  });

  it('is deterministic when only one octave satisfies the span', () => {
    // lowest=C4, highest=B4: exactly one octave (4) can hold a 0..11 span.
    const octave = pickRootOctave('C', 'C4', 'B4', 0, 11, { min: 4, max: 4 });
    expect(octave).toBe(4);
  });

  it('accounts for the root note\'s own pitch class, not just the octave number', () => {
    // A root of B needs less headroom below within the octave than a root of C.
    const octaveForB = pickRootOctave('B', 'C4', 'B5', 11, 0, { min: 4, max: 5 }, () => 0);
    const rootSemitone = noteOctaveToSemitone({ note: 'B', octave: octaveForB });
    expect(rootSemitone - 11).toBeGreaterThanOrEqual(noteOctaveToSemitone({ note: 'C', octave: 4 }));
  });
});
