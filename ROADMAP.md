# Music Ear Trainer

## To Do

- (none)

## In Progress

- (none)

## Done

- Add favicon.svg for browser tab icon
- Download instrument samples locally and serve from /public/samples/ (piano, guitar, violin, flute, trumpet)
- Fix the design, layout, and styling of the piano keyboard shown after answering a question (was upside-down)
- Fix the design, layout, and styling of the musical staff notation shown after answering a question (was overflowing container)
- Change slider increment for "Questions per Quiz" setting to 5 per step and the "Time Limit" setting to 5 seconds per step
- Change default sound type from sinewave to piano
- Remove separate "Settings" panel interface (div.settings-panel) and move settings to "Global Settings" panel
- Auto advance to the next question in Perfect Pitch mode when the user answers correctly (same as in other modes)
- Link the "Music Ear Trainer" title/logo in the header of all pages to the home page
- Add "Back to Menu" button/link to final results page after quiz completion
- Add a confetti animation when the user completes a quiz with a perfect score
- Use slider UI elements for the following global settings:
  - Questions per Quiz
  - Time Limit
  - Lowest Note
  - Highest Note
- Add synthesized instruments to sound types:
  - Piano
  - Guitar
  - Violin
  - Flute
  - Trumpet
- Add new game mode: scales (major, melodic minor, harmonic minor, natural minor, pentatonic, etc.)
- Add "© 2025 Geoff Myers" to the footer of all pages linked to https://www.geoffmyers.com
- After the user submits an answer to a question, show the note/pitch names as text, as a piano keyboard visualization, and in musical staff notation
- Add global settings in the footer of all pages for the following options:
  - Color theme (options: light, dark; default: dark)
- Add "Music Ear Trainer" title/logo to the header of all pages
- Change design/layout of modes from 3 columns to 2 columns (i.e., 2 x 2 grid)
- Add global settings in the footer of all pages for the following options:
  - Questions per quiz (range: 1 to 100; default: 10)
  - Time limit per question (range: 1 to 60 seconds or none/infinite; default: none)
  - Lowest note/pitch (range: A0 to C8; default: C3)
  - Highest note/pitch (range: A0 to C8; default: C5)
  - Sound type (options: sine, square, sawtooth, triangle; default: sine)
  - Accidentals (options: sharps, flats, both, none/neither; default: both)
  - Play notes/pitches separately or together (for intervals and chords; default: separately)
  - Allow multiple plays per question (default: true)
