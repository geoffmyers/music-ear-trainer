import type { GameMode, Difficulty, QuizQuestion } from '@/lib/types/game';
import type { Key, NoteOctave } from '@/lib/types/music';
import type { GlobalSettings } from '@/lib/types/settings';
import { getIntervalsByDifficulty } from '../music/intervals';
import { getChordsByDifficulty, getChordNotes } from '../music/chords';
import { getProgressionsByDifficulty, getProgressionChords } from '../music/progressions';
import { getPitchesByDifficulty, getOctaveRange } from '../music/pitches';
import { getScalesByDifficulty } from '../music/scales';
import {
  type OctaveRange,
  pickRootOctave,
  relativeSemitoneOffsets,
  resolveOctaveRange,
  semitoneSpan
} from '../music/noteRange';
import { DIFFICULTY_SETTINGS } from './difficultyConfig';

// Default octave ranges each mode used before note-range settings existed.
// These stay the *defaults* - resolveOctaveRange() intersects them with the
// user's configured lowest/highest note, and the user's explicit choice wins
// when the two don't overlap at all.
const INTERVAL_DEFAULT_RANGE: OctaveRange = { min: 3, max: 5 };
const CHORD_DEFAULT_RANGE: OctaveRange = { min: 3, max: 4 };
const SCALE_DEFAULT_RANGE: OctaveRange = { min: 3, max: 4 };
// Progressions were always rendered at a fixed octave 4 (no randomisation) -
// keep that exact behaviour as the default when the user hasn't narrowed
// their range.
const PROGRESSION_DEFAULT_RANGE: OctaveRange = { min: 4, max: 4 };

export class QuizEngine {
  generateQuestion(mode: GameMode, difficulty: Difficulty, settings: GlobalSettings): QuizQuestion {
    const modeSettings = DIFFICULTY_SETTINGS[difficulty];

    switch (mode) {
      case 'intervals':
        return this.generateIntervalQuestion(difficulty, modeSettings, settings);
      case 'chords':
        return this.generateChordQuestion(difficulty, modeSettings, settings);
      case 'progressions':
        return this.generateProgressionQuestion(difficulty, modeSettings, settings);
      case 'pitches':
        return this.generatePitchQuestion(difficulty, modeSettings, settings);
      case 'scales':
        return this.generateScaleQuestion(difficulty, modeSettings, settings);
    }
  }

  private generateIntervalQuestion(
    difficulty: Difficulty,
    modeSettings: typeof DIFFICULTY_SETTINGS[Difficulty],
    settings: GlobalSettings
  ): QuizQuestion {
    const intervals = getIntervalsByDifficulty(difficulty);
    const correctInterval = intervals[Math.floor(Math.random() * intervals.length)];

    // Generate wrong options
    const wrongOptions = intervals
      .filter(i => i.id !== correctInterval.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, modeSettings.numberOfOptions - 1);

    const allOptions = [correctInterval, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Direction (decided before the root note, since it changes which way
    // the interval's second note reaches - up or down from the root - and
    // therefore how much headroom the root needs on each side)
    const directions: ('ascending' | 'descending' | 'harmonic')[] = modeSettings.includeDirections
      ? ['ascending', 'descending', 'harmonic']
      : ['ascending'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    const spanAbove = direction === 'descending' ? 0 : correctInterval.semitones;
    const spanBelow = direction === 'descending' ? correctInterval.semitones : 0;

    const range = resolveOctaveRange(INTERVAL_DEFAULT_RANGE, settings.lowestNote, settings.highestNote);
    const octave = pickRootOctave('C', settings.lowestNote, settings.highestNote, spanBelow, spanAbove, range);
    const rootNote: NoteOctave = { note: 'C', octave };

    return {
      id: `interval-${Date.now()}-${Math.random()}`,
      mode: 'intervals',
      correctAnswer: correctInterval.name,
      options: allOptions.map(i => i.name),
      audioData: {
        mode: 'intervals',
        interval: {
          rootNote,
          intervalSemitones: correctInterval.semitones,
          direction
        }
      }
    };
  }

  private generateChordQuestion(
    difficulty: Difficulty,
    modeSettings: typeof DIFFICULTY_SETTINGS[Difficulty],
    settings: GlobalSettings
  ): QuizQuestion {
    const chords = getChordsByDifficulty(difficulty);
    const correctChord = chords[Math.floor(Math.random() * chords.length)];

    const wrongOptions = chords
      .filter(c => c.id !== correctChord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, modeSettings.numberOfOptions - 1);

    const allOptions = [correctChord, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    const inversion = modeSettings.includeInversions
      ? [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2
      : 0;

    // Simulate the chord at octave 0 to get its real semitone span (varies
    // with the chord's own intervals and the chosen inversion), then place
    // the root so the whole voicing fits the configured note range.
    const probeNotes = getChordNotes({ note: 'C', octave: 0 }, correctChord, inversion);
    const { below, above } = semitoneSpan(relativeSemitoneOffsets('C', probeNotes));

    const range = resolveOctaveRange(CHORD_DEFAULT_RANGE, settings.lowestNote, settings.highestNote);
    const octave = pickRootOctave('C', settings.lowestNote, settings.highestNote, below, above, range);
    const rootNote: NoteOctave = { note: 'C', octave };

    return {
      id: `chord-${Date.now()}-${Math.random()}`,
      mode: 'chords',
      correctAnswer: correctChord.name,
      options: allOptions.map(c => c.name),
      audioData: {
        mode: 'chords',
        chord: {
          rootNote,
          chordType: correctChord,
          inversion
        }
      }
    };
  }

  private generateProgressionQuestion(
    difficulty: Difficulty,
    modeSettings: typeof DIFFICULTY_SETTINGS[Difficulty],
    settings: GlobalSettings
  ): QuizQuestion {
    const progressions = getProgressionsByDifficulty(difficulty);
    const correctProgression = progressions[Math.floor(Math.random() * progressions.length)];

    const wrongOptions = progressions
      .filter(p => p.id !== correctProgression.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, modeSettings.numberOfOptions - 1);

    const allOptions = [correctProgression, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    const keys: Key[] = ['C', 'D', 'E', 'F', 'G', 'A'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const tempo = 100 + Math.floor(Math.random() * 40); // 100-140 BPM

    // Simulate every chord in the progression at octave 0 to get the whole
    // progression's real semitone span, then place the key so every chord
    // fits the configured note range.
    const probeChords = getProgressionChords(key, correctProgression, 0);
    const probeNotes = probeChords.flatMap(({ rootNote, chord }) => getChordNotes(rootNote, chord, 0));
    const { below, above } = semitoneSpan(relativeSemitoneOffsets(key, probeNotes));

    const range = resolveOctaveRange(PROGRESSION_DEFAULT_RANGE, settings.lowestNote, settings.highestNote);
    const baseOctave = pickRootOctave(key, settings.lowestNote, settings.highestNote, below, above, range);

    return {
      id: `progression-${Date.now()}-${Math.random()}`,
      mode: 'progressions',
      correctAnswer: correctProgression.name,
      options: allOptions.map(p => p.name),
      audioData: {
        mode: 'progressions',
        progression: {
          key,
          progression: correctProgression,
          tempo,
          baseOctave
        }
      }
    };
  }

  private generatePitchQuestion(
    difficulty: Difficulty,
    modeSettings: typeof DIFFICULTY_SETTINGS[Difficulty],
    settings: GlobalSettings
  ): QuizQuestion {
    const pitches = getPitchesByDifficulty(difficulty);
    const correctPitch = pitches[Math.floor(Math.random() * pitches.length)];

    const wrongOptions = pitches
      .filter(p => p.id !== correctPitch.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, modeSettings.numberOfOptions - 1);

    const allOptions = [correctPitch, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Difficulty's octave range is the default; the user's configured
    // lowest/highest note narrows (or, if disjoint, overrides) it.
    const range = resolveOctaveRange(getOctaveRange(difficulty), settings.lowestNote, settings.highestNote);
    const octave = pickRootOctave(correctPitch.note, settings.lowestNote, settings.highestNote, 0, 0, range);

    const note: NoteOctave = {
      note: correctPitch.note,
      octave
    };

    return {
      id: `pitch-${Date.now()}-${Math.random()}`,
      mode: 'pitches',
      correctAnswer: correctPitch.displayName,
      options: allOptions.map(p => p.displayName),
      audioData: {
        mode: 'pitches',
        pitch: {
          note
        }
      }
    };
  }

  private generateScaleQuestion(
    difficulty: Difficulty,
    modeSettings: typeof DIFFICULTY_SETTINGS[Difficulty],
    settings: GlobalSettings
  ): QuizQuestion {
    const scales = getScalesByDifficulty(difficulty);
    const correctScale = scales[Math.floor(Math.random() * scales.length)];

    const wrongOptions = scales
      .filter(s => s.id !== correctScale.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, modeSettings.numberOfOptions - 1);

    const allOptions = [correctScale, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Scale direction based on difficulty
    const directions: ('ascending' | 'descending' | 'both')[] = modeSettings.includeDirections
      ? ['ascending', 'descending', 'both']
      : ['ascending'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    // A scale's intervals are already relative offsets from its root.
    const { below, above } = semitoneSpan(correctScale.intervals);

    const range = resolveOctaveRange(SCALE_DEFAULT_RANGE, settings.lowestNote, settings.highestNote);
    const octave = pickRootOctave('C', settings.lowestNote, settings.highestNote, below, above, range);
    const rootNote: NoteOctave = { note: 'C', octave };

    return {
      id: `scale-${Date.now()}-${Math.random()}`,
      mode: 'scales',
      correctAnswer: correctScale.name,
      options: allOptions.map(s => s.name),
      audioData: {
        mode: 'scales',
        scale: {
          rootNote,
          scaleType: correctScale,
          direction
        }
      }
    };
  }
}
