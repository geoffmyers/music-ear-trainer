'use client';

import { useEffect } from 'react';
import { useHaptics } from '@/lib/hooks/useHaptics';

interface Props {
  isCorrect: boolean;
  correctAnswer: string;
}

export default function FeedbackDisplay({ isCorrect, correctAnswer }: Props) {
  const { success, error } = useHaptics();

  // Trigger haptic feedback when feedback is displayed
  useEffect(() => {
    if (isCorrect) {
      success();
    } else {
      error();
    }
  }, [isCorrect, success, error]);

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
