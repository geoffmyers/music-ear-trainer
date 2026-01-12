'use client';

import type { QuizQuestion } from '@/lib/types/game';
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
  return (
    <div className="quiz-interface">
      <button
        className="play-button"
        onClick={onPlayAudio}
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
              onClick={() => onSelectAnswer(option)}
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
          <button className="next-button" onClick={onNextQuestion}>
            Next Question →
          </button>
        </>
      )}
    </div>
  );
}
