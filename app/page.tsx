'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameMode, Difficulty, GameState, GameStats } from '@/lib/types/game';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { IntervalGenerator } from '@/lib/audio/intervalGenerator';
import { ChordGenerator } from '@/lib/audio/chordGenerator';
import { ProgressionGenerator } from '@/lib/audio/progressionGenerator';
import { PitchGenerator } from '@/lib/audio/pitchGenerator';
import { ScaleGenerator } from '@/lib/audio/scaleGenerator';
import { QuizEngine } from '@/lib/game/quizEngine';
import { ScoreManager } from '@/lib/game/scoreManager';
import { loadGameStats, saveGameStats, updateGameStats } from '@/lib/game/localStorage';
import { useGlobalSettings } from '@/lib/context/GlobalSettingsContext';
import GameModeSelector from './components/GameModeSelector';
import DifficultySelector from './components/DifficultySelector';
import ScoreDisplay from './components/ScoreDisplay';
import QuizInterface from './components/QuizInterface';
import ResultsScreen from './components/ResultsScreen';
import Header from './components/Header';

export default function Home() {
  // Global settings
  const { settings } = useGlobalSettings();

  // State management
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      return loadGameStats();
    }
    return {
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
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Audio engine instances (singleton)
  const [audioEngine] = useState(() => new AudioEngine());
  const [quizEngine] = useState(() => new QuizEngine());
  const [scoreManager] = useState(() => new ScoreManager());

  // Audio generators (initialized after audioEngine)
  const [intervalGenerator] = useState(() => new IntervalGenerator(audioEngine));
  const [chordGenerator] = useState(() => new ChordGenerator(audioEngine));
  const [progressionGenerator] = useState(() => new ProgressionGenerator(audioEngine, chordGenerator));
  const [pitchGenerator] = useState(() => new PitchGenerator(audioEngine));
  const [scaleGenerator] = useState(() => new ScaleGenerator(audioEngine));

  // Initialize audio context on first user interaction
  useEffect(() => {
    return () => audioEngine.close();
  }, [audioEngine]);

  // Sync sound type and volume settings with audio engine
  useEffect(() => {
    if (audioInitialized) {
      audioEngine.setSoundType(settings.soundType);
    }
  }, [settings.soundType, audioInitialized, audioEngine]);

  useEffect(() => {
    audioEngine.setVolume(settings.volume);
  }, [settings.volume, audioEngine]);

  // Auto-play audio when shouldAutoPlay is set and audio is initialized
  useEffect(() => {
    if (shouldAutoPlay && audioInitialized && gameState && !gameState.isPlaying && !gameState.hasAnswered && !gameState.isComplete) {
      const timer = setTimeout(() => {
        playAudio();
        setShouldAutoPlay(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPlay, audioInitialized, gameState]);

  // Game flow handlers
  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
  };

  const handleDifficultySelect = async (diff: Difficulty) => {
    setDifficulty(diff);
    // Initialize audio on first game start (requires user gesture)
    await audioEngine.initialize();
    setAudioInitialized(true);
    startNewGame(gameMode!, diff);
  };

  const startNewGame = (mode: GameMode, diff: Difficulty) => {
    const firstQuestion = quizEngine.generateQuestion(mode, diff);
    setGameState({
      mode,
      difficulty: diff,
      currentQuestion: firstQuestion,
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      isPlaying: false,
      hasAnswered: false,
      lastAnswerCorrect: null,
      isComplete: false,
      questionsPerSession: settings.questionsPerQuiz
    });
    setSelectedAnswer(null);
    // Trigger auto-play for the first question
    setShouldAutoPlay(true);
  };

  // Core audio playback function
  const playAudio = useCallback(async () => {
    if (!gameState || gameState.isPlaying) return;

    // Initialize audio context if needed
    if (!audioInitialized) {
      await audioEngine.initialize();
      setAudioInitialized(true);
    }

    setGameState(prev => prev ? { ...prev, isPlaying: true } : null);

    const { audioData } = gameState.currentQuestion!;

    try {
      switch (audioData.mode) {
        case 'intervals':
          intervalGenerator.playInterval(
            audioData.interval!.rootNote,
            audioData.interval!.intervalSemitones,
            audioData.interval!.direction
          );
          break;
        case 'chords':
          chordGenerator.playChord(
            audioData.chord!.rootNote,
            audioData.chord!.chordType,
            audioData.chord!.inversion
          );
          break;
        case 'progressions':
          progressionGenerator.playProgression(
            audioData.progression!.key,
            audioData.progression!.progression,
            audioData.progression!.tempo
          );
          break;
        case 'pitches':
          pitchGenerator.playPitch(audioData.pitch!.note);
          break;
        case 'scales':
          scaleGenerator.playScale(
            audioData.scale!.rootNote,
            audioData.scale!.scaleType,
            audioData.scale!.direction
          );
          break;
      }

      // Reset playing state after audio finishes
      setTimeout(() => {
        setGameState(prev => prev ? { ...prev, isPlaying: false } : null);
      }, 3000);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setGameState(prev => prev ? { ...prev, isPlaying: false } : null);
    }
  }, [gameState, audioInitialized, audioEngine, intervalGenerator, chordGenerator, progressionGenerator, pitchGenerator, scaleGenerator]);

  const handlePlayAudio = async () => {
    await playAudio();
  };

  const handleSelectAnswer = (answer: string) => {
    if (!gameState || gameState.hasAnswered) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === gameState.currentQuestion!.correctAnswer;
    const newStreak = isCorrect ? gameState.currentStreak + 1 : 0;
    const newCorrectAnswers = gameState.correctAnswers + (isCorrect ? 1 : 0);
    const newTotalQuestions = gameState.totalQuestions + 1;

    const newScore = scoreManager.calculateScore(
      newCorrectAnswers,
      newStreak,
      gameState.difficulty
    );

    setGameState({
      ...gameState,
      hasAnswered: true,
      lastAnswerCorrect: isCorrect,
      currentStreak: newStreak,
      bestStreak: Math.max(gameState.bestStreak, newStreak),
      correctAnswers: newCorrectAnswers,
      totalQuestions: newTotalQuestions,
      score: newScore
    });

    // Update persistent stats
    const updatedStats = updateGameStats(gameStats, gameState.mode, isCorrect, newStreak);
    setGameStats(updatedStats);
    saveGameStats(updatedStats);

    // Auto-advance to next question after 1 second if correct
    if (isCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    // Stop any currently playing audio before moving to next question
    audioEngine.stopAllPlayback();

    let sessionComplete = false;

    setGameState(prev => {
      if (!prev) return null;

      // Check if session is complete
      if (prev.totalQuestions >= prev.questionsPerSession) {
        sessionComplete = true;
        return {
          ...prev,
          isComplete: true,
          hasAnswered: false,
          lastAnswerCorrect: null,
          isPlaying: false
        };
      }

      const nextQuestion = quizEngine.generateQuestion(prev.mode, prev.difficulty);
      return {
        ...prev,
        currentQuestion: nextQuestion,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        hasAnswered: false,
        lastAnswerCorrect: null,
        isPlaying: false
      };
    });

    setSelectedAnswer(null);

    // Trigger auto-play for the next question (only if not complete)
    // Use a small delay to ensure state has updated
    setTimeout(() => {
      if (!sessionComplete) {
        setShouldAutoPlay(true);
      }
    }, 0);
  };

  const handlePlayAgain = () => {
    if (gameMode && difficulty) {
      startNewGame(gameMode, difficulty);
    }
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
    setGameState(null);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setGameMode(null);
    setDifficulty(null);
    setGameState(null);
    setSelectedAnswer(null);
  };

  // Render appropriate screen based on state
  if (!gameMode) {
    return (
      <div className="app">
        <GameModeSelector onSelectMode={handleModeSelect} />
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="app">
        <DifficultySelector
          mode={gameMode}
          onSelectDifficulty={handleDifficultySelect}
          onBack={() => setGameMode(null)}
          onHomeClick={handleRestart}
        />
      </div>
    );
  }

  if (!gameState) {
    return <div className="app">Loading...</div>;
  }

  // Show results screen when session is complete
  if (gameState.isComplete) {
    return (
      <div className="app">
        <ResultsScreen
          mode={gameState.mode}
          difficulty={gameState.difficulty}
          score={gameState.score}
          correctAnswers={gameState.correctAnswers}
          totalQuestions={gameState.totalQuestions}
          bestStreak={gameState.bestStreak}
          accuracy={scoreManager.calculateAccuracy(gameState.correctAnswers, gameState.totalQuestions)}
          onPlayAgain={handlePlayAgain}
          onChangeMode={handleRestart}
          onChangeDifficulty={handleChangeDifficulty}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onHomeClick={handleRestart} />

      <div className="game-container">
        <ScoreDisplay
          score={gameState.score}
          correctAnswers={gameState.correctAnswers}
          totalQuestions={gameState.totalQuestions}
          currentStreak={gameState.currentStreak}
          bestStreak={gameState.bestStreak}
          accuracy={scoreManager.calculateAccuracy(gameState.correctAnswers, gameState.totalQuestions)}
          questionsPerSession={gameState.questionsPerSession}
        />

        <QuizInterface
          question={gameState.currentQuestion!}
          hasAnswered={gameState.hasAnswered}
          lastAnswerCorrect={gameState.lastAnswerCorrect}
          isPlaying={gameState.isPlaying}
          onPlayAudio={handlePlayAudio}
          onSelectAnswer={handleSelectAnswer}
          onNextQuestion={handleNextQuestion}
          selectedAnswer={selectedAnswer}
        />

        <button onClick={handleRestart} className="restart-button">
          ← Exit to Menu
        </button>
      </div>
    </div>
  );
}
