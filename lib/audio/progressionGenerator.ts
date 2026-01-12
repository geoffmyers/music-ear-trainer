import type { Key, Progression } from '@/lib/types/music';
import { AudioEngine } from './AudioEngine';
import { ChordGenerator } from './chordGenerator';
import { getProgressionChords } from '../music/progressions';
import { getChordNotes } from '../music/chords';
import { noteToFrequency } from '../music/noteFrequencies';

export class ProgressionGenerator {
  constructor(private audioEngine: AudioEngine, private chordGenerator: ChordGenerator) {}

  playProgression(key: Key, progression: Progression, tempo: number = 120): void {
    const progressionChords = getProgressionChords(key, progression);
    const beatsPerChord = 4; // Whole note per chord
    const chordDuration = (60 / tempo) * beatsPerChord;
    const gapDuration = 0.1;

    let startTime = 0;
    progressionChords.forEach(({ rootNote, chord }) => {
      const notes = getChordNotes(rootNote, chord);
      const frequencies = notes.map(note => noteToFrequency(note.note, note.octave));

      frequencies.forEach(freq => {
        this.audioEngine.playNote(freq, chordDuration, startTime);
      });

      startTime += chordDuration + gapDuration;
    });
  }
}
