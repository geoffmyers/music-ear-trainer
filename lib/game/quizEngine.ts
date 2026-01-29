import type { GameMode, Difficulty, QuizQuestion } from '@/lib/types/game';
import type { Key, NoteOctave } from '@/lib/types/music';
import { getIntervalsByDifficulty } from '../music/intervals';
import { getChordsByDifficulty } from '../music/chords';
import { getProgressionsByDifficulty } from '../music/progressions';
import { getPitchesByDifficulty, getOctaveRange } from '../music/pitches';
import { getScalesByDifficulty } from '../music/scales';
import { DIFFICULTY_SETTINGS } from './difficultyConfig';

export class QuizEngine {
  generateQuestion(mode: GameMode, difficulty: Difficulty): QuizQuestion {
    const settings = DIFFICULTY_SETTINGS[difficulty];

    switch (mode) {
      case 'intervals':
        return this.generateIntervalQuestion(difficulty, settings);
      case 'chords':
        return this.generateChordQuestion(difficulty, settings);
      case 'progressions':
        return this.generateProgressionQuestion(difficulty, settings);
      case 'pitches':
        return this.generatePitchQuestion(difficulty, settings);
      case 'scales':
        return this.generateScaleQuestion(difficulty, settings);
    }
  }

  private generateIntervalQuestion(difficulty: Difficulty, settings: typeof DIFFICULTY_SETTINGS[Difficulty]): QuizQuestion {
    const intervals = getIntervalsByDifficulty(difficulty);
    const correctInterval = intervals[Math.floor(Math.random() * intervals.length)];

    // Generate wrong options
    const wrongOptions = intervals
      .filter(i => i.id !== correctInterval.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfOptions - 1);

    const allOptions = [correctInterval, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Random root note (C3 to C5)
    const rootNote: NoteOctave = {
      note: 'C',
      octave: 3 + Math.floor(Math.random() * 3)
    };

    // Direction
    const directions: ('ascending' | 'descending' | 'harmonic')[] = settings.includeDirections
      ? ['ascending', 'descending', 'harmonic']
      : ['ascending'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

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

  private generateChordQuestion(difficulty: Difficulty, settings: typeof DIFFICULTY_SETTINGS[Difficulty]): QuizQuestion {
    const chords = getChordsByDifficulty(difficulty);
    const correctChord = chords[Math.floor(Math.random() * chords.length)];

    const wrongOptions = chords
      .filter(c => c.id !== correctChord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfOptions - 1);

    const allOptions = [correctChord, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    const rootNote: NoteOctave = {
      note: 'C',
      octave: 3 + Math.floor(Math.random() * 2)
    };

    const inversion = settings.includeInversions
      ? [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2
      : 0;

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

  private generateProgressionQuestion(difficulty: Difficulty, settings: typeof DIFFICULTY_SETTINGS[Difficulty]): QuizQuestion {
    const progressions = getProgressionsByDifficulty(difficulty);
    const correctProgression = progressions[Math.floor(Math.random() * progressions.length)];

    const wrongOptions = progressions
      .filter(p => p.id !== correctProgression.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfOptions - 1);

    const allOptions = [correctProgression, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    const keys: Key[] = ['C', 'D', 'E', 'F', 'G', 'A'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const tempo = 100 + Math.floor(Math.random() * 40); // 100-140 BPM

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
          tempo
        }
      }
    };
  }

  private generatePitchQuestion(difficulty: Difficulty, settings: typeof DIFFICULTY_SETTINGS[Difficulty]): QuizQuestion {
    const pitches = getPitchesByDifficulty(difficulty);
    const correctPitch = pitches[Math.floor(Math.random() * pitches.length)];

    const wrongOptions = pitches
      .filter(p => p.id !== correctPitch.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfOptions - 1);

    const allOptions = [correctPitch, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Random octave based on difficulty
    const octaveRange = getOctaveRange(difficulty);
    const octave = octaveRange.min + Math.floor(Math.random() * (octaveRange.max - octaveRange.min + 1));

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

  private generateScaleQuestion(difficulty: Difficulty, settings: typeof DIFFICULTY_SETTINGS[Difficulty]): QuizQuestion {
    const scales = getScalesByDifficulty(difficulty);
    const correctScale = scales[Math.floor(Math.random() * scales.length)];

    const wrongOptions = scales
      .filter(s => s.id !== correctScale.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfOptions - 1);

    const allOptions = [correctScale, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    // Random root note (C3 to C4)
    const rootNote: NoteOctave = {
      note: 'C',
      octave: 3 + Math.floor(Math.random() * 2)
    };

    // Scale direction based on difficulty
    const directions: ('ascending' | 'descending' | 'both')[] = settings.includeDirections
      ? ['ascending', 'descending', 'both']
      : ['ascending'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

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
