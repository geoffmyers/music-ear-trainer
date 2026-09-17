import type { Key, NoteOctave } from '@/lib/types/music';
import { NOTE_VALUES } from './noteFrequencies';

export interface OctaveRange {
  min: number;
  max: number;
}

/**
 * Absolute semitone index in scientific pitch notation (C0 = 0, C4 = 48,
 * A4 = 57). Monotonic across octaves - used only to compare/clamp octave
 * ranges, never to compute an audible frequency (that stays in
 * noteFrequencies.ts's noteToFrequency, which is anchored to A4 = 440Hz).
 */
export function noteOctaveToSemitone(note: NoteOctave): number {
  return note.octave * 12 + NOTE_VALUES[note.note];
}

const NOTE_NAME_RE = /^([A-G]#?)(-?\d+)$/;

/**
 * Parses a note-name string such as "C3" or "F#4" (the format stored in
 * GlobalSettings.lowestNote/highestNote and ALL_NOTES) into a NoteOctave.
 * Malformed input falls back to C4 rather than throwing, since the only way
 * to reach this function with bad input is a corrupted localStorage value.
 */
export function parseNoteOctave(value: string): NoteOctave {
  const match = NOTE_NAME_RE.exec(value.trim());
  if (!match) {
    return { note: 'C', octave: 4 };
  }
  const [, note, octaveStr] = match;
  return { note: note as Key, octave: parseInt(octaveStr, 10) };
}

/**
 * Intersects a mode's default octave range with the user's configured
 * lowest/highest note range (GlobalSettings.lowestNote/highestNote). When
 * they don't overlap at all, the user's explicit setting wins over the
 * default rather than being ignored.
 */
export function resolveOctaveRange(
  defaultRange: OctaveRange,
  lowestNote: string,
  highestNote: string
): OctaveRange {
  const a = parseNoteOctave(lowestNote).octave;
  const b = parseNoteOctave(highestNote).octave;
  const userMin = Math.min(a, b);
  const userMax = Math.max(a, b);

  const min = Math.max(defaultRange.min, userMin);
  const max = Math.min(defaultRange.max, userMax);
  if (min <= max) {
    return { min, max };
  }
  return { min: userMin, max: userMax };
}

/**
 * The semitone offsets (relative to a root at semitone 0) that a set of
 * NoteOctave values spans, e.g. from generating a chord/scale/progression at
 * octave 0. Used to size the room a mode's generated notes will need before
 * picking where the root should sit.
 */
export function relativeSemitoneOffsets(root: Key, notes: NoteOctave[]): number[] {
  const rootValue = NOTE_VALUES[root];
  return notes.map(n => noteOctaveToSemitone(n) - rootValue);
}

function spanOf(offsets: number[]): { below: number; above: number } {
  if (offsets.length === 0) return { below: 0, above: 0 };
  return {
    below: Math.max(0, -Math.min(...offsets)),
    above: Math.max(0, Math.max(...offsets))
  };
}

export { spanOf as semitoneSpan };

/**
 * Picks an octave for `note` such that the notes from `spanBelow` semitones
 * below the root to `spanAbove` semitones above it all fit inside
 * [lowestNote, highestNote]. When the configured range is narrower than the
 * span (e.g. a one-octave range with a wide chord voicing), the root is
 * clamped into `fallbackRange` instead - the setting is honoured as closely
 * as it can be rather than silently ignored.
 */
export function pickRootOctave(
  note: Key,
  lowestNote: string,
  highestNote: string,
  spanBelow: number,
  spanAbove: number,
  fallbackRange: OctaveRange,
  random: () => number = Math.random
): number {
  const low = parseNoteOctave(lowestNote);
  const high = parseNoteOctave(highestNote);
  const lowSemitone = Math.min(noteOctaveToSemitone(low), noteOctaveToSemitone(high));
  const highSemitone = Math.max(noteOctaveToSemitone(low), noteOctaveToSemitone(high));
  const noteValue = NOTE_VALUES[note];

  const minOctave = Math.ceil((lowSemitone + spanBelow - noteValue) / 12);
  const maxOctave = Math.floor((highSemitone - spanAbove - noteValue) / 12);

  if (minOctave <= maxOctave) {
    return minOctave + Math.floor(random() * (maxOctave - minOctave + 1));
  }

  // The span doesn't fit the configured range at all: clamp to the
  // fallback (mode default intersected with the user range) so playback
  // stays as close to the setting as the content allows.
  const mid = Math.round((fallbackRange.min + fallbackRange.max) / 2);
  return Math.min(Math.max(mid, fallbackRange.min), fallbackRange.max);
}
