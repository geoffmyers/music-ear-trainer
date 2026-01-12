'use client';

interface Props {
  isCorrect: boolean;
  correctAnswer: string;
}

export default function FeedbackDisplay({ isCorrect, correctAnswer }: Props) {
  if (isCorrect) {
    return (
      <div className="feedback-display correct">
        <span className="feedback-icon">✓</span>
        Correct!
      </div>
    );
  }

  return (
    <div className="feedback-display incorrect">
      <span className="feedback-icon">✗</span>
      Incorrect. The answer was: {correctAnswer}
    </div>
  );
}
