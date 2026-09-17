import { describe, it, expect } from 'vitest';
import { noteToFrequency, addSemitones } from './noteFrequencies';

// Regression coverage for the 2026-09-17 octave bug: noteToFrequency used to
// compute keyNumber = octave*12 + n + 4, which put A4 (piano key 49, 440Hz)
// one octave high at key 61 (880Hz) - what the app played was always a full
// octave above what MusicStaff/PianoKeyboard displayed for the same
// NoteOctave. The fix is (octave - 1) * 12 + n + 4.
describe('noteToFrequency', () => {
  it('A4 is 440Hz (the tuning reference)', () => {
    expect(noteToFrequency('A', 4)).toBeCloseTo(440, 2);
  });

  it('C4 (middle C) is 261.63Hz, not 523.25Hz (C5)', () => {
    expect(noteToFrequency('C', 4)).toBeCloseTo(261.63, 1);
  });

  it('A0 (lowest note on an 88-key piano) is 27.5Hz', () => {
    expect(noteToFrequency('A', 0)).toBeCloseTo(27.5, 2);
  });

  it('C8 (highest C on an 88-key piano) is 4186.01Hz', () => {
    expect(noteToFrequency('C', 8)).toBeCloseTo(4186.01, 1);
  });

  it('is one octave (2x frequency) apart for the same note name', () => {
    expect(noteToFrequency('E', 5)).toBeCloseTo(noteToFrequency('E', 4) * 2, 2);
  });
});

describe('addSemitones', () => {
  it('stays within the octave for a small positive shift', () => {
    expect(addSemitones({ note: 'C', octave: 4 }, 4)).toEqual({ note: 'E', octave: 4 });
  });

  it('carries into the next octave crossing B -> C', () => {
    expect(addSemitones({ note: 'B', octave: 4 }, 1)).toEqual({ note: 'C', octave: 5 });
  });

  it('carries into the previous octave crossing C -> B going down', () => {
    expect(addSemitones({ note: 'C', octave: 4 }, -1)).toEqual({ note: 'B', octave: 3 });
  });

  it('handles a shift of more than a full octave', () => {
    expect(addSemitones({ note: 'C', octave: 4 }, 13)).toEqual({ note: 'C#', octave: 5 });
  });

  it('round-trips back to the same note+octave for +12/-12', () => {
    const start = { note: 'F#' as const, octave: 3 };
    expect(addSemitones(addSemitones(start, 12), -12)).toEqual(start);
  });
});
