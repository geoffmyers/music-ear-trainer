import type { Difficulty } from '@/lib/types/game';

export interface ScaleType {
  id: string;
  name: string;
  intervals: number[]; // semitones from root for each scale degree
  difficulty: Difficulty;
}

// Scale definitions with intervals as semitones from root
export const SCALE_TYPES: ScaleType[] = [
  // Easy scales
  {
    id: 'major',
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    difficulty: 'easy'
  },
  {
    id: 'natural-minor',
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    difficulty: 'easy'
  },
  {
    id: 'pentatonic-major',
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9, 12],
    difficulty: 'easy'
  },
  {
    id: 'pentatonic-minor',
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10, 12],
    difficulty: 'easy'
  },

  // Medium scales
  {
    id: 'harmonic-minor',
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11, 12],
    difficulty: 'medium'
  },
  {
    id: 'melodic-minor',
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11, 12],
    difficulty: 'medium'
  },
  {
    id: 'dorian',
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    difficulty: 'medium'
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10, 12],
    difficulty: 'medium'
  },

  // Hard scales
  {
    id: 'phrygian',
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10, 12],
    difficulty: 'hard'
  },
  {
    id: 'lydian',
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11, 12],
    difficulty: 'hard'
  },
  {
    id: 'locrian',
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10, 12],
    difficulty: 'hard'
  },
  {
    id: 'blues',
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10, 12],
    difficulty: 'hard'
  },
  {
    id: 'whole-tone',
    name: 'Whole Tone',
    intervals: [0, 2, 4, 6, 8, 10, 12],
    difficulty: 'hard'
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    difficulty: 'hard'
  }
];

export function getScalesByDifficulty(difficulty: Difficulty): ScaleType[] {
  const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];
  const maxIndex = difficultyOrder.indexOf(difficulty);

  return SCALE_TYPES.filter(scale => {
    const scaleIndex = difficultyOrder.indexOf(scale.difficulty);
    return scaleIndex <= maxIndex;
  });
}

export function getScaleById(id: string): ScaleType | undefined {
  return SCALE_TYPES.find(scale => scale.id === id);
}
