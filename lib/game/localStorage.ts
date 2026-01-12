import type { GameStats, GameMode } from '@/lib/types/game';

const STORAGE_KEY = 'music-ear-trainer-stats';

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save game stats:', error);
  }
}

export function loadGameStats(): GameStats {
  const defaultStats: GameStats = {
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
    accuracyPercentage: 0,
    statsByMode: {
      intervals: { totalQuestions: 0, correctAnswers: 0 },
      chords: { totalQuestions: 0, correctAnswers: 0 },
      progressions: { totalQuestions: 0, correctAnswers: 0 },
      pitches: { totalQuestions: 0, correctAnswers: 0 },
      scales: { totalQuestions: 0, correctAnswers: 0 }
    }
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge stored data with default to ensure all modes exist
      return {
        ...defaultStats,
        ...parsed,
        statsByMode: {
          ...defaultStats.statsByMode,
          ...parsed.statsByMode
        }
      };
    }
  } catch (error) {
    console.error('Failed to load game stats:', error);
  }

  return defaultStats;
}

export function updateGameStats(
  stats: GameStats,
  mode: GameMode,
  correct: boolean,
  currentStreak: number
): GameStats {
  const updated = { ...stats };

  // Ensure the mode exists in statsByMode
  if (!updated.statsByMode[mode]) {
    updated.statsByMode[mode] = { totalQuestions: 0, correctAnswers: 0 };
  }

  updated.totalQuestionsAnswered++;
  updated.statsByMode[mode].totalQuestions++;

  if (correct) {
    updated.totalCorrectAnswers++;
    updated.statsByMode[mode].correctAnswers++;
  }

  if (currentStreak > updated.bestStreak) {
    updated.bestStreak = currentStreak;
  }

  updated.accuracyPercentage = Math.round(
    (updated.totalCorrectAnswers / updated.totalQuestionsAnswered) * 100
  );

  return updated;
}
