export type WaveformType = 'sine' | 'triangle' | 'square' | 'sawtooth';

export type InstrumentType = 'piano' | 'guitar' | 'violin' | 'flute' | 'trumpet';

export type SoundType = WaveformType | InstrumentType;

export interface AudioEngineConfig {
  volume: number; // 0-1
  waveform: WaveformType;
  attackTime: number; // seconds
  decayTime: number; // seconds
  sustainLevel: number; // 0-1
  releaseTime: number; // seconds
}

// Map our instrument types to tonejs-instruments folder names
export const TONEJS_INSTRUMENT_NAMES: Record<InstrumentType, string> = {
  piano: 'piano',
  guitar: 'guitar-acoustic',
  violin: 'violin',
  flute: 'flute',
  trumpet: 'trumpet'
};

export interface PlaybackOptions {
  duration: number; // seconds
  delay?: number; // seconds (for sequential notes)
}
