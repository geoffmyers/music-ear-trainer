import type { InstrumentType } from '@/lib/types/audio';
import { TONEJS_INSTRUMENT_NAMES } from '@/lib/types/audio';

// Lazy-loaded Tone.js module (deferred until user interaction to avoid AudioContext autoplay issues)
let Tone: typeof import('tone') | null = null;

// Dynamically load Tone.js only when needed (after user gesture)
async function getTone(): Promise<typeof import('tone')> {
  if (!Tone) {
    Tone = await import('tone');
  }
  return Tone;
}

// Base URL for locally served instrument samples
const SAMPLES_BASE_URL = '/samples/';

// Sample note mappings for each instrument (minified set for faster loading)
const INSTRUMENT_SAMPLES: Record<string, Record<string, string>> = {
  piano: {
    // Piano samples from A1 to C8
    'A1': 'A1.mp3',
    'C2': 'C2.mp3',
    'D#2': 'Ds2.mp3',
    'F#2': 'Fs2.mp3',
    'A2': 'A2.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
    'A3': 'A3.mp3',
    'C4': 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    'A4': 'A4.mp3',
    'C5': 'C5.mp3',
    'D#5': 'Ds5.mp3',
    'F#5': 'Fs5.mp3',
    'A5': 'A5.mp3',
    'C6': 'C6.mp3',
    'D#6': 'Ds6.mp3',
    'F#6': 'Fs6.mp3',
    'A6': 'A6.mp3',
    'C7': 'C7.mp3',
    'D#7': 'Ds7.mp3',
    'F#7': 'Fs7.mp3',
    'A7': 'A7.mp3',
    'C8': 'C8.mp3'
  },
  'guitar-acoustic': {
    // Guitar samples from E2 to C5
    'E2': 'E2.mp3',
    'A2': 'A2.mp3',
    'D3': 'D3.mp3',
    'G3': 'G3.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
    'A3': 'A3.mp3',
    'C4': 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    'A4': 'A4.mp3',
    'C5': 'C5.mp3'
  },
  violin: {
    // Violin samples only have natural notes: A, C, E, G
    'G3': 'G3.mp3',
    'A3': 'A3.mp3',
    'C4': 'C4.mp3',
    'E4': 'E4.mp3',
    'G4': 'G4.mp3',
    'A4': 'A4.mp3',
    'C5': 'C5.mp3',
    'E5': 'E5.mp3',
    'G5': 'G5.mp3',
    'A5': 'A5.mp3',
    'C6': 'C6.mp3',
    'E6': 'E6.mp3',
    'G6': 'G6.mp3',
    'A6': 'A6.mp3',
    'C7': 'C7.mp3'
  },
  flute: {
    // Flute samples only have natural notes: A, C, E
    'C4': 'C4.mp3',
    'E4': 'E4.mp3',
    'A4': 'A4.mp3',
    'C5': 'C5.mp3',
    'E5': 'E5.mp3',
    'A5': 'A5.mp3',
    'C6': 'C6.mp3',
    'E6': 'E6.mp3',
    'A6': 'A6.mp3',
    'C7': 'C7.mp3'
  },
  trumpet: {
    // Trumpet samples have a specific set of notes
    'F3': 'F3.mp3',
    'A3': 'A3.mp3',
    'C4': 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F4': 'F4.mp3',
    'G4': 'G4.mp3',
    'A#4': 'As4.mp3',
    'D5': 'D5.mp3',
    'F5': 'F5.mp3',
    'A5': 'A5.mp3',
    'C6': 'C6.mp3'
  }
};

// Use a generic type for the sampler since we're dynamically importing Tone
type Sampler = InstanceType<typeof import('tone').Sampler>;

// Cache for loaded samplers
const samplerCache: Map<string, Sampler> = new Map();
const loadingPromises: Map<string, Promise<Sampler>> = new Map();

export async function loadInstrument(instrumentType: InstrumentType): Promise<Sampler> {
  const instrumentName = TONEJS_INSTRUMENT_NAMES[instrumentType];

  // Return cached sampler if available
  if (samplerCache.has(instrumentName)) {
    return samplerCache.get(instrumentName)!;
  }

  // Return existing loading promise if already loading
  if (loadingPromises.has(instrumentName)) {
    return loadingPromises.get(instrumentName)!;
  }

  // Ensure Tone.js is loaded
  const ToneModule = await getTone();

  // Create loading promise
  const loadPromise = new Promise<Sampler>((resolve, reject) => {
    const samples = INSTRUMENT_SAMPLES[instrumentName];
    if (!samples) {
      reject(new Error(`Unknown instrument: ${instrumentName}`));
      return;
    }

    // Build URL map for samples
    const urls: Record<string, string> = {};
    for (const [note, filename] of Object.entries(samples)) {
      urls[note] = filename;
    }

    const sampler = new ToneModule.Sampler({
      urls,
      baseUrl: `${SAMPLES_BASE_URL}${instrumentName}/`,
      onload: () => {
        samplerCache.set(instrumentName, sampler);
        loadingPromises.delete(instrumentName);
        resolve(sampler);
      },
      onerror: (error) => {
        loadingPromises.delete(instrumentName);
        reject(error);
      }
    }).toDestination();
  });

  loadingPromises.set(instrumentName, loadPromise);
  return loadPromise;
}

export function isInstrumentLoaded(instrumentType: InstrumentType): boolean {
  const instrumentName = TONEJS_INSTRUMENT_NAMES[instrumentType];
  return samplerCache.has(instrumentName);
}

export function getLoadedSampler(instrumentType: InstrumentType): Sampler | null {
  const instrumentName = TONEJS_INSTRUMENT_NAMES[instrumentType];
  return samplerCache.get(instrumentName) || null;
}

export function releaseAllNotes(): void {
  for (const sampler of samplerCache.values()) {
    sampler.releaseAll();
  }
}

export function disposeAllInstruments(): void {
  for (const sampler of samplerCache.values()) {
    sampler.dispose();
  }
  samplerCache.clear();
}
