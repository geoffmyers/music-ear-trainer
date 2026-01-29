import type { Difficulty } from '@/lib/types/game';
import scalesData from '@shared/music-ear-trainer/data/scales.json';

export interface ScaleType {
  id: string;
  name: string;
  intervals: number[]; // semitones from root for each scale degree
  difficulty: Difficulty;
}

export const SCALE_TYPES: ScaleType[] = scalesData.scales as ScaleType[];

export function getScalesByDifficulty(difficulty: Difficulty): ScaleType[] {
  const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];
  const maxIndex = difficultyOrder.indexOf(difficulty);

  return SCALE_TYPES.filter(scale => {
    const scaleIndex = difficultyOrder.indexOf(scale.difficulty);
    return scaleIndex <= maxIndex;
  });
}

export function getScaleById(id: string): ScaleType | undefined {
  return SCALE_TYPES.find(scale => scale.id === id);
}
