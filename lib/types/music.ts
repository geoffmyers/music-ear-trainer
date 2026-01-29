// Semitones from root note
export type IntervalSemitones = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Interval {
  id: string;
  name: string;
  semitones: IntervalSemitones;
  abbreviation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChordType {
  id: string;
  name: string;
  intervals: IntervalSemitones[]; // e.g., [0, 4, 7] for major triad
  abbreviation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Progression {
  id: string;
  name: string;
  romanNumerals: string[]; // e.g., ['I', 'V', 'vi', 'IV']
  chordDegrees: number[]; // e.g., [1, 5, 6, 4]
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Key = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface NoteOctave {
  note: Key;
  octave: number;
}
