import type { Difficulty } from '@/lib/types/game';

export interface DifficultySettings {
  numberOfOptions: number;
  includeInversions: boolean;
  includeDirections: boolean;
  timePerQuestion: number | null;
  pointsPerCorrect: number;
  streakBonus: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    numberOfOptions: 3,
    includeInversions: false,
    includeDirections: false,
    timePerQuestion: null,
    pointsPerCorrect: 10,
    streakBonus: 5
  },
  medium: {
    numberOfOptions: 4,
    includeInversions: true,
    includeDirections: true,
    timePerQuestion: null,
    pointsPerCorrect: 15,
    streakBonus: 10
  },
  hard: {
    numberOfOptions: 6,
    includeInversions: true,
    includeDirections: true,
    timePerQuestion: 30,
    pointsPerCorrect: 20,
    streakBonus: 15
  }
};
