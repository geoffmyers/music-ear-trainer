import type { NoteOctave } from '@/lib/types/music';
import { AudioEngine } from './AudioEngine';
import { noteToFrequency } from '../music/noteFrequencies';

export class PitchGenerator {
  constructor(private audioEngine: AudioEngine) {}

  playPitch(note: NoteOctave): void {
    const frequency = noteToFrequency(note.note, note.octave);
    // Play a single note for 2 seconds
    this.audioEngine.playNote(frequency, 2.0, 0);
  }
}
