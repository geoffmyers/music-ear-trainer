# CLAUDE.md - Music Ear Trainer

This file provides technical guidance to Claude Code when working with the Music Ear Trainer codebase.

## Project Overview

Music Ear Trainer is a Next.js 15 web application that provides interactive ear training exercises for musicians. It uses the App Router architecture, React 19, TypeScript 5, and Tone.js for audio synthesis.

**Key Technical Characteristics:**
- Static site generation (SSG) with `output: 'export'`
- Client-side only (no server-side rendering)
- Deployed to Cloudflare Pages
- Single-page application (SPA) with state-based navigation

## Architecture

### Application Flow

```
User selects mode → Difficulty → Quiz starts → Audio plays → User answers →
Feedback + Visualization → Next question → Results screen → Restart
```

### State Management

**Global Settings** - `lib/context/GlobalSettingsContext.tsx`
- React Context API for user preferences
- Persists to localStorage automatically
- Settings: volume, sound type, note range, accidentals, theme, etc.

**Game State** - `app/page.tsx` (main game component)
- Local state managed with useState
- Game flow: mode selection → difficulty → quiz → results
- No URL routing - all navigation is state-based

**Statistics** - `lib/game/localStorage.ts`
- Persisted to browser localStorage
- Global stats + per-mode breakdowns
- Automatic migration of old data structures

### Component Hierarchy

```
page.tsx (Main Game Component)
├── Header (with onHomeClick callback)
├── GameModeSelector (mode selection screen)
├── DifficultySelector (difficulty selection screen)
├── QuizInterface (active quiz)
│   ├── FeedbackDisplay
│   ├── AnswerVisualization
│   │   ├── PianoKeyboard
│   │   └── MusicStaff (VexFlow)
│   └── ScoreDisplay
├── ResultsScreen
│   └── Confetti (celebration animation)
└── Footer (Settings Panel)
```

## Key Modules

### Audio System (`lib/audio/`)

**AudioEngine.ts** - Main audio controller
- Singleton pattern for Tone.js initialization
- Manages Transport, Master volume, instrument loading
- Public methods: `playInterval()`, `playChord()`, `playProgression()`, `playScale()`

**Generators** - Mode-specific audio generation
- `intervalGenerator.ts` - Two-note intervals (harmonic, ascending, descending)
- `chordGenerator.ts` - Chord voicings with inversions
- `progressionGenerator.ts` - Chord progressions with tempo
- `scaleGenerator.ts` - Scale sequences (ascending/descending/both)
- `pitchGenerator.ts` - Single note playback

**InstrumentLoader.ts** - Sampler management
- Lazy loads Tone.Sampler instruments from `/public/instruments/`
- Caches loaded instruments
- Fallback to oscillators if samples fail

### Music Theory (`lib/music/`)

**noteFrequencies.ts** - Core note handling
- `NOTE_FREQUENCIES` - Map of all notes to Hz
- `addSemitones()` - Transpose notes by semitone intervals
- Handles octave wrapping and enharmonic equivalents

**intervals.ts** - Interval definitions
- `INTERVALS` array with semitones, names, difficulty
- Used by interval mode and chord construction

**chords.ts** - Chord definitions
- `CHORD_TYPES` - All chord types (maj, min, dim, aug, 7ths, etc.)
- `getChordNotes()` - Calculate notes for any chord with inversion
- Supports up to 2nd inversion

**progressions.ts** - Chord progression definitions
- `PROGRESSIONS` - Common progressions (I-IV-V, etc.)
- `degreeToChordType()` - Maps scale degrees to chord qualities
- `getProgressionChords()` - Gets all chords in a progression

**scales.ts** - Scale definitions
- `SCALE_TYPES` - Major, minor, modes, pentatonic, etc.
- Each scale defined by interval pattern (semitones from root)
- `getScalesByDifficulty()` - Filter by difficulty

**pitches.ts** - Note generation
- `generateRandomNote()` - Creates random notes within range
- Used by perfect pitch mode

### Game Logic (`lib/game/`)

**quizEngine.ts** - Question generation
- `generateQuestion()` - Main factory for all question types
- Mode-specific generators for each game mode
- Returns `QuizQuestion` with audio data and options

**difficultyConfig.ts** - Difficulty settings
- Defines what content appears at each difficulty level
- Used by question generators to filter options

**scoreManager.ts** - Scoring logic
- Calculate percentages, grades, performance messages
- Emoji selection based on score
- Message generation for results screen

**localStorage.ts** - Persistence layer
- `loadGameStats()` - Load with automatic migration/defaults
- `saveGameStats()` - Persist to localStorage
- `updateGameStats()` - Increment stats with safety checks

## TypeScript Types (`lib/types/`)

**game.ts** - Game state types
- `GameMode` - 'intervals' | 'chords' | 'progressions' | 'pitches' | 'scales'
- `AudioQuestionData` - Union type containing mode-specific data
- `QuizQuestion` - Complete question with audio and options
- `GameState` - Full game state
- `GameStats` - Statistics tracking

**music.ts** - Music theory types
- `Note` - Note name without octave
- `NoteOctave` - Note with octave { note: Note, octave: number }
- `ChordType`, `Progression`, `Key`, etc.

**settings.ts** - User preference types
- `GlobalSettings` - All configurable options
- `SoundType`, `AccidentalPreference`, `PlaybackStyle`, etc.

**audio.ts** - Audio-specific types
- Shared types for audio generation

## Component Patterns

### Navigation Pattern (No URL Routing)

Since this is a static export SPA, navigation uses state instead of URLs:

```typescript
// In page.tsx
const [gameState, setGameState] = useState<'mode-select' | 'difficulty' | 'quiz' | 'results'>('mode-select');

// Navigation via state changes
const handleModeSelect = (mode: GameMode) => {
  setSelectedMode(mode);
  setGameState('difficulty');
};

const handleRestart = () => {
  setGameState('mode-select');
  // Reset all state
};
```

### Header Navigation

Header uses callbacks instead of Next.js Link:

```typescript
<Header
  onHomeClick={handleRestart}  // Callback to reset to home
  showSubtitle={gameState === 'mode-select'}
/>
```

### Settings Panel Pattern

Collapsible side panel with global settings:
- Fixed position on right side
- Toggle button to expand/collapse
- Uses GlobalSettingsContext for state
- Persists changes to localStorage automatically

## Audio Generation Patterns

### Standard Audio Flow

1. Generate question → Create `AudioQuestionData`
2. User clicks play → Extract audio params from `AudioQuestionData`
3. Call appropriate generator (interval, chord, etc.)
4. Generator uses Tone.js to schedule and play notes
5. AudioEngine manages playback state

### Playback Control

```typescript
// In component
const handlePlayAudio = async () => {
  setIsPlaying(true);
  try {
    await AudioEngine.getInstance().playChord(
      notes,
      settings.soundType,
      settings.playbackStyle
    );
  } finally {
    setIsPlaying(false);
  }
};
```

### Instrument vs Oscillator

- Oscillators (sine, square, etc.) - Generated in real-time
- Instruments (piano, guitar, etc.) - Sampled audio files
- AudioEngine automatically switches based on `soundType` setting

## Visualization Components

### PianoKeyboard Component

Props:
- `highlightedNotes: NoteOctave[]` - Notes to highlight
- `startOctave: number` - First octave to show
- `endOctave: number` - Last octave to show

Renders piano keys with CSS positioning for black keys.

### MusicStaff Component

Props:
- `notes: NoteOctave[]` - Notes to render

Uses VexFlow to render traditional music notation:
- Automatically selects treble or bass clef
- Handles accidentals (sharps/flats)
- Renders multiple notes as chords when applicable

### AnswerVisualization Component

Shows after user answers:
- Text description of the correct answer
- Piano keyboard with notes highlighted
- Music staff notation
- Different logic for each mode (intervals, chords, progressions, scales)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (static export)
npm run build

# Preview production build locally
npm run start

# Deploy to Cloudflare Pages
npm run deploy

# Type checking
npx tsc --noEmit
```

## Common Development Tasks

### Adding a New Game Mode

1. Add mode to `GameMode` type in `lib/types/game.ts`
2. Create audio generator in `lib/audio/` (e.g., `newModeGenerator.ts`)
3. Add mode-specific data to `AudioQuestionData` union type
4. Add question generator to `lib/game/quizEngine.ts`
5. Add visualization logic to `app/components/AnswerVisualization.tsx`
6. Update `getModeLabel()`, `getDescription()` functions
7. Add icon/card to `GameModeSelector.tsx`
8. Initialize stats for new mode in `localStorage.ts`

### Adding a New Chord Type

1. Add to `CHORD_TYPES` array in `lib/music/chords.ts`
2. Define interval pattern and difficulty
3. Test with `getChordNotes()` helper
4. Add to difficulty config if needed

### Adding a New Scale

1. Add to `SCALE_TYPES` array in `lib/music/scales.ts`
2. Define interval pattern (semitones from root)
3. Set difficulty level
4. Will automatically appear in scales mode

### Modifying Settings

1. Update `GlobalSettings` type in `lib/types/settings.ts`
2. Add default value in `GlobalSettingsContext.tsx`
3. Add UI control in `Footer.tsx` (Settings Panel)
4. Use setting via `useGlobalSettings()` hook

## Critical Implementation Notes

### Static Export Requirements

- **No Server-Side Code** - All code runs in browser
- **No API Routes** - Cannot use Next.js API routes
- **No Dynamic Routes** - No `[param]` style routing
- **No Image Optimization** - Use regular `<img>` tags
- **Client-Only Packages** - Tone.js, VexFlow must be client-side only

### Audio Considerations

- **Tone.js Context** - Must start after user interaction
- **Sample Loading** - Instrument samples load asynchronously
- **Transport** - Tone.Transport used for scheduling
- **Cleanup** - Always stop/dispose audio to prevent memory leaks

### Performance

- **Lazy Loading** - Instruments load on first use
- **Memoization** - Use React.memo for heavy components
- **State Updates** - Batch state updates where possible
- **Audio Scheduling** - Use Tone.js scheduling, not setTimeout

### Browser Compatibility

- **Web Audio API** - Required for Tone.js
- **localStorage** - Required for stats persistence
- **Modern ES6+** - No IE11 support needed
- **CSS Variables** - Used extensively for theming

## Testing Strategy

Currently no automated tests. Manual testing checklist:

- [ ] All game modes generate valid questions
- [ ] Audio playback works for all sound types
- [ ] Settings persist across page reloads
- [ ] Stats update correctly after quiz
- [ ] Visualizations show correct notes
- [ ] Responsive design works on mobile
- [ ] Dark/light theme switches correctly

## Deployment

The app is configured for Cloudflare Pages deployment:

1. Build creates static files in `out/` directory
2. Cloudflare Pages serves these files
3. No server-side rendering or API routes used
4. All routing is client-side state-based

**Deploy command:**
```bash
npm run deploy
```

This runs:
1. `next build` - Creates optimized static export
2. `wrangler pages deploy` - Uploads to Cloudflare

## Common Issues & Solutions

### Audio Doesn't Play
- Ensure user has clicked something first (Web Audio API restriction)
- Check browser console for Tone.js errors
- Verify instrument samples are in `/public/instruments/`

### Build Fails
- Check for dynamic imports of server-only packages
- Ensure `output: 'export'` is set in next.config.mjs
- Verify no API routes or dynamic routes exist

### Stats Not Persisting
- Check localStorage is available (not in private browsing)
- Verify `saveGameStats()` is called after state changes
- Check for localStorage quota errors

### VexFlow Rendering Issues
- Ensure VexFlow SVG container has proper width
- Check for clef detection logic (treble vs bass)
- Verify note octave ranges are valid

## Code Style Guidelines

- **TypeScript** - Use strict mode, explicit types
- **Components** - Functional components with hooks
- **Props** - Define explicit interfaces
- **Naming** - camelCase for variables, PascalCase for components/types
- **Files** - One component per file
- **Imports** - Use @ alias for lib/ imports
- **Comments** - Minimal, prefer self-documenting code

## File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`
- CSS: `kebab-case.css` (only globals.css)

## Key Dependencies

- `next` - Framework
- `react` + `react-dom` - UI library
- `tone` - Audio synthesis and scheduling
- `vexflow` - Music notation rendering
- `typescript` - Type safety
- `wrangler` - Cloudflare deployment

## Environment

- **Node.js**: 18.x or higher
- **Package Manager**: npm
- **Build Target**: ES2020
- **TypeScript**: 5.7.2 with strict mode

---

For questions or clarifications about this codebase, refer to the code comments and TypeScript types, which are comprehensive and up-to-date.
