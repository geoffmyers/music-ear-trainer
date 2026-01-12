import type { Difficulty } from '@/lib/types/game';
import { DIFFICULTY_SETTINGS } from './difficultyConfig';

export class ScoreManager {
  calculateScore(
    correctAnswers: number,
    currentStreak: number,
    difficulty: Difficulty
  ): number {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const baseScore = correctAnswers * settings.pointsPerCorrect;
    const streakBonus = Math.floor(currentStreak / 3) * settings.streakBonus;
    return baseScore + streakBonus;
  }

  calculateAccuracy(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }
}
