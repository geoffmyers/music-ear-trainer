import { AudioEngine } from './AudioEngine';
import { noteToFrequency, addSemitones } from '@/lib/music/noteFrequencies';
import type { NoteOctave } from '@/lib/types/music';
import type { ScaleType } from '@/lib/music/scales';

export class ScaleGenerator {
  private audioEngine: AudioEngine;
  private noteDuration: number = 0.4;
  private noteGap: number = 0.05;

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
  }

  // Play a scale from a root note
  playScale(rootNote: NoteOctave, scaleType: ScaleType, direction: 'ascending' | 'descending' | 'both' = 'ascending'): void {
    if (direction === 'both') {
      this.playScaleUpDown(rootNote, scaleType);
      return;
    }

    const ascending = direction === 'ascending';

    if (ascending) {
      const ascFrequencies: number[] = [];
      for (const interval of scaleType.intervals) {
        const noteAtInterval = addSemitones(rootNote, interval);
        const freq = noteToFrequency(noteAtInterval.note, noteAtInterval.octave);
        ascFrequencies.push(freq);
      }
      this.audioEngine.playSequence(ascFrequencies, this.noteDuration, this.noteGap);
    } else {
      // For descending, reverse the order
      const descFrequencies: number[] = [];
      for (let i = scaleType.intervals.length - 1; i >= 0; i--) {
        const noteAtInterval = addSemitones(rootNote, scaleType.intervals[i]);
        const freq = noteToFrequency(noteAtInterval.note, noteAtInterval.octave);
        descFrequencies.push(freq);
      }
      this.audioEngine.playSequence(descFrequencies, this.noteDuration, this.noteGap);
    }
  }

  // Play scale ascending then descending
  playScaleUpDown(rootNote: NoteOctave, scaleType: ScaleType): void {
    const frequencies: number[] = [];

    // Ascending
    for (const interval of scaleType.intervals) {
      const noteAtInterval = addSemitones(rootNote, interval);
      const freq = noteToFrequency(noteAtInterval.note, noteAtInterval.octave);
      frequencies.push(freq);
    }

    // Descending (skip the top note since we just played it)
    for (let i = scaleType.intervals.length - 2; i >= 0; i--) {
      const noteAtInterval = addSemitones(rootNote, scaleType.intervals[i]);
      const freq = noteToFrequency(noteAtInterval.note, noteAtInterval.octave);
      frequencies.push(freq);
    }

    this.audioEngine.playSequence(frequencies, this.noteDuration, this.noteGap);
  }

  setNoteDuration(duration: number): void {
    this.noteDuration = duration;
  }

  setNoteGap(gap: number): void {
    this.noteGap = gap;
  }
}
