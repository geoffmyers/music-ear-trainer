import type { NoteOctave, ChordType } from '@/lib/types/music';
import { AudioEngine } from './AudioEngine';
import { getChordNotes } from '../music/chords';
import { noteToFrequency } from '../music/noteFrequencies';

export class ChordGenerator {
  constructor(private audioEngine: AudioEngine) {}

  playChord(rootNote: NoteOctave, chordType: ChordType, inversion: 0 | 1 | 2 = 0): void {
    const notes = getChordNotes(rootNote, chordType, inversion);
    const frequencies = notes.map(note => noteToFrequency(note.note, note.octave));

    this.audioEngine.playChord(frequencies, 2.5);
  }

  playChordArpeggio(rootNote: NoteOctave, chordType: ChordType, inversion: 0 | 1 | 2 = 0): void {
    const notes = getChordNotes(rootNote, chordType, inversion);
    const frequencies = notes.map(note => noteToFrequency(note.note, note.octave));

    this.audioEngine.playSequence(frequencies, 0.5, 0.05);
  }
}
