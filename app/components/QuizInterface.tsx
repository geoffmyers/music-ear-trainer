'use client';

import type { QuizQuestion } from '@/lib/types/game';
import { useHaptics } from '@/lib/hooks/useHaptics';
import FeedbackDisplay from './FeedbackDisplay';
import AnswerVisualization from './AnswerVisualization';

interface Props {
  question: QuizQuestion;
  hasAnswered: boolean;
  lastAnswerCorrect: boolean | null;
  isPlaying: boolean;
  onPlayAudio: () => void;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  selectedAnswer: string | null;
}

export default function QuizInterface({
  question,
  hasAnswered,
  lastAnswerCorrect,
  isPlaying,
  onPlayAudio,
  onSelectAnswer,
  onNextQuestion,
  selectedAnswer
}: Props) {
  const { lightTap, mediumTap } = useHaptics();

  const handlePlayAudio = async () => {
    await lightTap();
    onPlayAudio();
  };

  const handleSelectAnswer = async (answer: string) => {
    await mediumTap();
    onSelectAnswer(answer);
  };

  const handleNextQuestion = async () => {
    await lightTap();
    onNextQuestion();
  };

  return (
    <div className="quiz-interface">
      <button
        className="play-button"
        onClick={handlePlayAudio}
        disabled={isPlaying}
      >
        {isPlaying ? '🔊 Playing...' : '▶️ Play Sound'}
      </button>

      <div className="answer-options">
        {question.options.map((option) => {
          let className = 'answer-button';
          if (hasAnswered && option === selectedAnswer) {
            className += ' selected';
            className += lastAnswerCorrect ? ' correct' : ' incorrect';
          } else if (hasAnswered && option === question.correctAnswer) {
            className += ' correct';
          }

          return (
            <button
              key={option}
              className={className}
              onClick={() => handleSelectAnswer(option)}
              disabled={hasAnswered}
            >
              {option}
            </button>
          );
        })}
      </div>

      {hasAnswered && lastAnswerCorrect !== null && (
        <>
          <FeedbackDisplay
            isCorrect={lastAnswerCorrect}
            correctAnswer={question.correctAnswer}
          />
          <AnswerVisualization
            audioData={question.audioData}
            correctAnswer={question.correctAnswer}
          />
          <button className="next-button" onClick={handleNextQuestion}>
            Next Question →
          </button>
        </>
      )}
    </div>
  );
}
