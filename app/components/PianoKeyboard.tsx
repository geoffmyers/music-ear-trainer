'use client';

import type { NoteOctave, Key } from '@/lib/types/music';

interface Props {
  highlightedNotes: NoteOctave[];
  startOctave?: number;
  endOctave?: number;
}

const WHITE_KEYS: Key[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS: Key[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

// Black key positions relative to white keys
// White keys are 18px wide, positioned at index * 14.28% (20px spacing in 140px octave)
// The gap between white keys is at ~13.57% from each white key's left edge
// To center black key on the boundary: position ≈ 0.95 + white_key_index
const BLACK_KEY_POSITIONS: Record<string, number> = {
  'C#': 0.95,  // centered on boundary between C (0) and D (1)
  'D#': 1.95,  // centered on boundary between D (1) and E (2)
  'F#': 3.95,  // centered on boundary between F (3) and G (4)
  'G#': 4.95,  // centered on boundary between G (4) and A (5)
  'A#': 5.95,  // centered on boundary between A (5) and B (6)
};

function isBlackKey(note: Key): boolean {
  return BLACK_KEYS.includes(note);
}

function noteOctaveMatches(a: NoteOctave, b: NoteOctave): boolean {
  return a.note === b.note && a.octave === b.octave;
}

function isNoteHighlighted(note: Key, octave: number, highlightedNotes: NoteOctave[]): boolean {
  return highlightedNotes.some(n => noteOctaveMatches(n, { note, octave }));
}

export default function PianoKeyboard({
  highlightedNotes,
  startOctave = 3,
  endOctave = 5
}: Props) {
  const octaves = [];
  for (let o = startOctave; o <= endOctave; o++) {
    octaves.push(o);
  }

  return (
    <div className="piano-keyboard">
      <div className="piano-container">
        {octaves.map(octave => (
          <div key={octave} className="piano-octave">
            {/* White keys */}
            {WHITE_KEYS.map((note, index) => {
              const isHighlighted = isNoteHighlighted(note, octave, highlightedNotes);
              return (
                <div
                  key={`${note}${octave}`}
                  className={`piano-key white-key ${isHighlighted ? 'highlighted' : ''}`}
                  style={{ left: `${index * 14.28}%` }}
                >
                  {isHighlighted && (
                    <span className="key-label">{note}{octave}</span>
                  )}
                </div>
              );
            })}
            {/* Black keys */}
            {BLACK_KEYS.map(note => {
              const isHighlighted = isNoteHighlighted(note, octave, highlightedNotes);
              const position = BLACK_KEY_POSITIONS[note];
              return (
                <div
                  key={`${note}${octave}`}
                  className={`piano-key black-key ${isHighlighted ? 'highlighted' : ''}`}
                  style={{ left: `${position * 14.28}%` }}
                >
                  {isHighlighted && (
                    <span className="key-label">{note}{octave}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
