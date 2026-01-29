'use client';

import { useEffect, useRef } from 'react';
import type { NoteOctave, Key } from '@/lib/types/music';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';

interface Props {
  notes: NoteOctave[];
  // Optional: group notes into chords (each array is a chord to be stacked)
  chordGroups?: NoteOctave[][];
}

// Convert our note format to VexFlow format
// VexFlow uses: "c/4" for C4, "c#/4" for C#4, etc.
function noteToVexFlow(note: NoteOctave): { key: string; accidental: string | null } {
  const noteName = note.note.toLowerCase();
  const hasSharp = noteName.includes('#');
  const baseName = hasSharp ? noteName.replace('#', '') : noteName;

  return {
    key: `${baseName}/${note.octave}`,
    accidental: hasSharp ? '#' : null
  };
}

// Convert note to MIDI number for range calculation
function noteToMidi(note: NoteOctave): number {
  const semitones: Record<Key, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };
  return note.octave * 12 + semitones[note.note];
}

// Determine optimal clef based on notes
function determineClef(notes: NoteOctave[]): 'treble' | 'bass' {
  if (notes.length === 0) return 'treble';

  const midiValues = notes.map(noteToMidi);
  const avgMidi = midiValues.reduce((a, b) => a + b, 0) / midiValues.length;

  // C4 = 48, threshold around E3/F3 (~41)
  return avgMidi >= 41 ? 'treble' : 'bass';
}

export default function MusicStaff({ notes, chordGroups }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use chordGroups if provided, otherwise fall back to individual notes
    const hasChordGroups = chordGroups && chordGroups.length > 0;
    const allNotes = hasChordGroups
      ? chordGroups.flat()
      : notes;

    if (!containerRef.current || allNotes.length === 0) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    // Determine clef
    const clef = determineClef(allNotes);

    // Calculate width based on number of items (chords or individual notes)
    const numItems = hasChordGroups ? chordGroups.length : notes.length;
    const staveWidth = Math.max(200, 80 + numItems * 80);
    const containerWidth = staveWidth + 20;
    const containerHeight = 150;

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(containerWidth, containerHeight);
    const context = renderer.getContext();

    // Create stave
    const stave = new Stave(10, 20, staveWidth);
    stave.addClef(clef);
    stave.setContext(context).draw();

    let vexNotes: StaveNote[];

    if (hasChordGroups) {
      // Create stacked chord notation
      vexNotes = chordGroups.map(chordNotes => {
        // Sort notes by pitch (lowest to highest) for proper stacking
        const sortedNotes = [...chordNotes].sort((a, b) => {
          const midiA = noteToMidi(a);
          const midiB = noteToMidi(b);
          return midiA - midiB;
        });

        const keys: string[] = [];
        const accidentals: (string | null)[] = [];

        sortedNotes.forEach(note => {
          const { key, accidental } = noteToVexFlow(note);
          keys.push(key);
          accidentals.push(accidental);
        });

        const staveNote = new StaveNote({
          clef: clef,
          keys: keys,
          duration: 'q'
        });

        // Add accidentals to the correct note indices
        accidentals.forEach((acc, index) => {
          if (acc) {
            staveNote.addModifier(new Accidental(acc), index);
          }
        });

        return staveNote;
      });
    } else {
      // Original behavior: individual notes
      vexNotes = notes.map(note => {
        const { key, accidental } = noteToVexFlow(note);
        const staveNote = new StaveNote({
          clef: clef,
          keys: [key],
          duration: 'q'
        });

        if (accidental) {
          staveNote.addModifier(new Accidental(accidental));
        }

        return staveNote;
      });
    }

    // Create voice and add notes
    const voice = new Voice({ numBeats: numItems, beatValue: 4 });
    voice.addTickables(vexNotes);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], staveWidth - 70);
    voice.draw(context, stave);

  }, [notes, chordGroups]);

  // Check if we have any notes to display
  const hasNotes = (chordGroups && chordGroups.length > 0) || notes.length > 0;

  if (!hasNotes) {
    return null;
  }

  return (
    <div className="music-staff">
      <div className="vexflow-container" ref={containerRef} />
    </div>
  );
}
