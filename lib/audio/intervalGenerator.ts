import type { NoteOctave, IntervalSemitones } from '@/lib/types/music';
import { AudioEngine } from './AudioEngine';
import { noteToFrequency, addSemitones } from '../music/noteFrequencies';

export class IntervalGenerator {
  constructor(private audioEngine: AudioEngine) {}

  playInterval(
    rootNote: NoteOctave,
    semitones: IntervalSemitones,
    direction: 'ascending' | 'descending' | 'harmonic'
  ): void {
    const rootFreq = noteToFrequency(rootNote.note, rootNote.octave);
    const intervalNote = addSemitones(rootNote, direction === 'descending' ? -semitones : semitones);
    const intervalFreq = noteToFrequency(intervalNote.note, intervalNote.octave);

    if (direction === 'harmonic') {
      // Play both notes simultaneously
      this.audioEngine.playChord([rootFreq, intervalFreq], 2.0);
    } else {
      // Play notes sequentially
      const frequencies = direction === 'ascending'
        ? [rootFreq, intervalFreq]
        : [intervalFreq, rootFreq];
      this.audioEngine.playSequence(frequencies, 1.0, 0.1);
    }
  }
}
