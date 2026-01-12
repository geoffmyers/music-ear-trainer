import type { NoteOctave, IntervalSemitones, ChordType, Key, Progression } from './music';
import type { ScaleType } from '@/lib/music/scales';

export type GameMode = 'intervals' | 'chords' | 'progressions' | 'pitches' | 'scales';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AudioQuestionData {
  mode: GameMode;
  // For intervals
  interval?: {
    rootNote: NoteOctave;
    intervalSemitones: IntervalSemitones;
    direction: 'ascending' | 'descending' | 'harmonic';
  };
  // For chords
  chord?: {
    rootNote: NoteOctave;
    chordType: ChordType;
    inversion?: 0 | 1 | 2;
  };
  // For progressions
  progression?: {
    key: Key;
    progression: Progression;
    tempo: number;
  };
  // For perfect pitch
  pitch?: {
    note: NoteOctave;
  };
  // For scales
  scale?: {
    rootNote: NoteOctave;
    scaleType: ScaleType;
    direction: 'ascending' | 'descending' | 'both';
  };
}

export interface QuizQuestion {
  id: string;
  mode: GameMode;
  correctAnswer: string;
  options: string[];
  audioData: AudioQuestionData;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  currentQuestion: QuizQuestion | null;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  isPlaying: boolean;
  hasAnswered: boolean;
  lastAnswerCorrect: boolean | null;
  isComplete: boolean;
  questionsPerSession: number;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  accuracyPercentage: number;
  statsByMode: {
    [key in GameMode]: {
      totalQuestions: number;
      correctAnswers: number;
    };
  };
}
