import type { Interval } from '@/lib/types/music';
import intervalsData from '@shared/music-ear-trainer/data/intervals.json';

export const INTERVALS: Interval[] = intervalsData.intervals as Interval[];

export function getIntervalsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Interval[] {
  if (difficulty === 'easy') return INTERVALS.filter(i => i.difficulty === 'easy');
  if (difficulty === 'medium') return INTERVALS.filter(i => i.difficulty === 'easy' || i.difficulty === 'medium');
  return INTERVALS; // hard includes all
}
