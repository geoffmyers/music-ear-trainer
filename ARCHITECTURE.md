# Architecture

A **static export** single-page app. All state is client-side; navigation is
state-based rather than routed, because the export has no server.

## Flow

```
mode select → difficulty → question generated → audio plays →
answer → feedback + visualisation → next question → results
```

## Layout

| Path | What lives there |
|---|---|
| `lib/audio/` | `AudioEngine.ts` (a Tone.js singleton) plus one generator per mode — interval, chord, progression, scale, pitch. `InstrumentLoader.ts` lazily loads sampled instruments and falls back to oscillators. |
| `lib/music/` | The theory layer: note frequencies and transposition, interval and chord definitions, progressions, scales. Pure data and functions. |
| `lib/game/` | `quizEngine.ts` generates questions, `difficultyConfig.ts` decides what appears at each level, `scoreManager.ts` grades, `localStorage.ts` persists stats with migration. |
| `lib/context/` | `GlobalSettingsContext` — user preferences, persisted automatically. |
| `app/components/` | UI, including `PianoKeyboard` and a VexFlow `MusicStaff` for answer visualisation. |

## Constraints

- **Static export**: no API routes, no dynamic routes, no server code. Tone.js
  and VexFlow are client-only.
- **Web Audio needs a gesture.** Tone.js cannot start until the user has
  interacted, so audio is initialised on first play rather than on mount.
- Adding a mode touches a known list of files — see *Adding a New Game Mode* in
  `CLAUDE.md`.
