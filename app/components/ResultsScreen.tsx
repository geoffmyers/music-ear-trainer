'use client';

import type { GameMode, Difficulty } from '@/lib/types/game';
import Header from './Header';
import Confetti from './Confetti';

interface Props {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  bestStreak: number;
  accuracy: number;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onChangeDifficulty: () => void;
}

export default function ResultsScreen({
  mode,
  difficulty,
  score,
  correctAnswers,
  totalQuestions,
  bestStreak,
  accuracy,
  onPlayAgain,
  onChangeMode,
  onChangeDifficulty
}: Props) {
  const modeNames: Record<GameMode, string> = {
    intervals: 'Intervals',
    chords: 'Chords',
    progressions: 'Progressions',
    pitches: 'Perfect Pitch',
    scales: 'Scales'
  };

  const getPerformanceMessage = () => {
    if (accuracy === 100) return { text: 'Perfect Score!', emoji: '🏆' };
    if (accuracy >= 90) return { text: 'Excellent!', emoji: '🌟' };
    if (accuracy >= 70) return { text: 'Great Job!', emoji: '👏' };
    if (accuracy >= 50) return { text: 'Good Effort!', emoji: '👍' };
    return { text: 'Keep Practicing!', emoji: '💪' };
  };

  const performance = getPerformanceMessage();
  const isPerfectScore = accuracy === 100;

  return (
    <div className="results-screen">
      {isPerfectScore && <Confetti />}
      <Header onHomeClick={onChangeMode} />

      <div className="results-header">
        <div className="performance-emoji">{performance.emoji}</div>
        <h1 className="performance-message">{performance.text}</h1>
        <p className="results-subtitle">
          {modeNames[mode]} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </p>
      </div>

      <div className="results-stats">
        <div className="stat-card primary">
          <div className="stat-value">{score}</div>
          <div className="stat-label">Final Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{correctAnswers}/{totalQuestions}</div>
          <div className="stat-label">Correct Answers</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <div className="results-actions">
        <button className="action-button primary" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="action-button secondary" onClick={onChangeDifficulty}>
          Change Difficulty
        </button>
        <button className="action-button secondary" onClick={onChangeMode}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
