'use client';

interface Props {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
  questionsPerSession?: number;
}

export default function ScoreDisplay({
  score,
  correctAnswers,
  totalQuestions,
  currentStreak,
  bestStreak,
  accuracy,
  questionsPerSession
}: Props) {
  return (
    <div className="score-display">
      <div className="score-item">
        <div className="score-label">Score</div>
        <div className="score-value">{score}</div>
      </div>

      <div className="score-item">
        <div className="score-label">Question</div>
        <div className="score-value">
          {totalQuestions}{questionsPerSession ? `/${questionsPerSession}` : ''}
        </div>
      </div>

      <div className="score-item">
        <div className="score-label">Accuracy</div>
        <div className="score-value">{accuracy}%</div>
      </div>

      <div className="score-item">
        <div className="score-label">Streak</div>
        <div className="score-value">
          {currentStreak}
          {currentStreak >= 3 && <span className="streak-fire">🔥</span>}
        </div>
      </div>

      <div className="score-item">
        <div className="score-label">Best Streak</div>
        <div className="score-value">{bestStreak}</div>
      </div>
    </div>
  );
}
