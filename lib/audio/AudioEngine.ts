import type { AudioEngineConfig, WaveformType, SoundType, InstrumentType } from '@/lib/types/audio';

// Lazy-loaded Tone.js module (deferred until user interaction to avoid AudioContext autoplay issues)
let Tone: typeof import('tone') | null = null;
let instrumentLoader: typeof import('./InstrumentLoader') | null = null;

// Helper to check if a sound type is an instrument
function isInstrument(soundType: SoundType): soundType is InstrumentType {
  return ['piano', 'guitar', 'violin', 'flute', 'trumpet'].includes(soundType);
}

// Dynamically load Tone.js only when needed (after user gesture)
async function getTone(): Promise<typeof import('tone')> {
  if (!Tone) {
    Tone = await import('tone');
  }
  return Tone;
}

// Dynamically load InstrumentLoader only when needed
async function getInstrumentLoader(): Promise<typeof import('./InstrumentLoader')> {
  if (!instrumentLoader) {
    instrumentLoader = await import('./InstrumentLoader');
  }
  return instrumentLoader;
}

// Convert frequency to note name (e.g., 440 -> "A4")
function frequencyToNote(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const c0 = a4 * Math.pow(2, -4.75); // C0 frequency

  if (frequency < c0) return 'C0';

  const halfSteps = Math.round(12 * Math.log2(frequency / c0));
  const octave = Math.floor(halfSteps / 12);
  const noteIndex = halfSteps % 12;

  return `${noteNames[noteIndex]}${octave}`;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public config: AudioEngineConfig;
  private soundType: SoundType = 'sine';
  private instrumentLoading: boolean = false;
  private toneInitialized: boolean = false;
  private activeOscillators: Set<OscillatorNode> = new Set();

  constructor(config: Partial<AudioEngineConfig> = {}) {
    this.config = {
      volume: 0.3,
      waveform: 'sine',
      attackTime: 0.01,
      decayTime: 0.1,
      sustainLevel: 0.7,
      releaseTime: 0.3,
      ...config
    };
  }

  // Initialize audio context (requires user gesture)
  async initialize(): Promise<void> {
    if (this.audioContext) return;

    // Dynamically load and start Tone.js audio context
    const ToneModule = await getTone();
    await ToneModule.start();
    this.toneInitialized = true;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.config.volume;
    this.masterGain.connect(this.audioContext.destination);

    // Pre-load current instrument if it's a sampled instrument
    if (isInstrument(this.soundType)) {
      await this.preloadInstrument(this.soundType);
    }
  }

  // Pre-load an instrument's samples
  async preloadInstrument(instrumentType: InstrumentType): Promise<void> {
    if (this.instrumentLoading) return;

    // Ensure Tone.js is initialized first
    if (!this.toneInitialized) {
      const ToneModule = await getTone();
      await ToneModule.start();
      this.toneInitialized = true;
    }

    this.instrumentLoading = true;
    try {
      const loader = await getInstrumentLoader();
      await loader.loadInstrument(instrumentType);
    } catch (error) {
      console.error(`Failed to load instrument ${instrumentType}:`, error);
    } finally {
      this.instrumentLoading = false;
    }
  }

  // Play a single note
  playNote(frequency: number, duration: number, startTime: number = 0): void {
    // Use sampled instrument if selected
    if (isInstrument(this.soundType)) {
      this.playInstrumentNote(frequency, duration, startTime);
      return;
    }

    // Use oscillator for waveform sounds
    if (!this.audioContext || !this.masterGain) {
      throw new Error('AudioEngine not initialized');
    }

    const now = this.audioContext.currentTime + startTime;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = this.config.waveform;
    oscillator.frequency.value = frequency;

    // Create envelope (ADSR)
    const envelope = this.audioContext.createGain();
    envelope.gain.value = 0;

    // Connect nodes
    oscillator.connect(envelope);
    envelope.connect(this.masterGain);

    // ADSR envelope
    const { attackTime, decayTime, sustainLevel, releaseTime } = this.config;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(1, now + attackTime);
    envelope.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    envelope.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
    envelope.gain.linearRampToValueAtTime(0, now + duration);

    // Track oscillator for potential early stop
    this.activeOscillators.add(oscillator);
    oscillator.onended = () => {
      this.activeOscillators.delete(oscillator);
    };

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Play a note using Tone.js sampled instrument
  private async playInstrumentNote(frequency: number, duration: number, startTime: number = 0): Promise<void> {
    const instrumentType = this.soundType as InstrumentType;
    const loader = await getInstrumentLoader();
    const sampler = loader.getLoadedSampler(instrumentType);

    if (!sampler) {
      // Fallback to oscillator if sampler not loaded
      console.warn(`Instrument ${instrumentType} not loaded, using sine wave fallback`);
      this.playOscillatorNote(frequency, duration, startTime);
      return;
    }

    const ToneModule = await getTone();
    const noteName = frequencyToNote(frequency);
    const startTimeAbsolute = ToneModule.now() + startTime;

    // Set volume
    sampler.volume.value = ToneModule.gainToDb(this.config.volume);

    // Play the note
    sampler.triggerAttackRelease(noteName, duration, startTimeAbsolute);
  }

  // Fallback oscillator note
  private playOscillatorNote(frequency: number, duration: number, startTime: number = 0): void {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime + startTime;
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const envelope = this.audioContext.createGain();
    envelope.gain.value = 0;

    oscillator.connect(envelope);
    envelope.connect(this.masterGain);

    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(this.config.volume, now + 0.01);
    envelope.gain.setValueAtTime(this.config.volume, now + duration - 0.1);
    envelope.gain.linearRampToValueAtTime(0, now + duration);

    // Track oscillator for potential early stop
    this.activeOscillators.add(oscillator);
    oscillator.onended = () => {
      this.activeOscillators.delete(oscillator);
    };

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Play multiple notes simultaneously (chord)
  playChord(frequencies: number[], duration: number): void {
    frequencies.forEach(freq => this.playNote(freq, duration, 0));
  }

  // Play notes sequentially
  playSequence(frequencies: number[], noteDuration: number, gapDuration: number = 0): void {
    let startTime = 0;
    frequencies.forEach(freq => {
      this.playNote(freq, noteDuration, startTime);
      startTime += noteDuration + gapDuration;
    });
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.config.volume;
    }
  }

  setWaveform(waveform: WaveformType): void {
    this.config.waveform = waveform;
    this.soundType = waveform;
  }

  async setSoundType(soundType: SoundType): Promise<void> {
    this.soundType = soundType;
    if (isInstrument(soundType)) {
      // Pre-load the instrument samples
      await this.preloadInstrument(soundType);
    } else {
      this.config.waveform = soundType;
    }
  }

  getSoundType(): SoundType {
    return this.soundType;
  }

  async isInstrumentReady(): Promise<boolean> {
    if (!isInstrument(this.soundType)) return true;
    const loader = await getInstrumentLoader();
    return loader.getLoadedSampler(this.soundType as InstrumentType) !== null;
  }

  // Stop all currently playing audio immediately
  stopAllPlayback(): void {
    // Stop all active oscillators
    for (const oscillator of this.activeOscillators) {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch {
        // Oscillator may have already stopped
      }
    }
    this.activeOscillators.clear();

    // Release all notes on samplers (Tone.js instruments)
    if (instrumentLoader) {
      instrumentLoader.releaseAllNotes();
    }
  }

  // Clean up (synchronous to work with useEffect cleanup)
  close(): void {
    if (instrumentLoader) {
      instrumentLoader.disposeAllInstruments();
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
    }
  }
}
