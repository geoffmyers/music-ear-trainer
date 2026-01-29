'use client';

import type { AudioQuestionData, GameMode } from '@/lib/types/game';
import type { NoteOctave } from '@/lib/types/music';
import { addSemitones } from '@/lib/music/noteFrequencies';
import { INTERVALS } from '@/lib/music/intervals';
import { getChordNotes } from '@/lib/music/chords';
import { getProgressionChords } from '@/lib/music/progressions';
import PianoKeyboard from './PianoKeyboard';
import MusicStaff from './MusicStaff';

interface Props {
  audioData: AudioQuestionData;
  correctAnswer: string;
}

function formatNoteDisplay(note: NoteOctave): string {
  return `${note.note}${note.octave}`;
}

function getNotesFromAudioData(audioData: AudioQuestionData): NoteOctave[] {
  const { mode } = audioData;

  if (mode === 'pitches' && audioData.pitch) {
    return [audioData.pitch.note];
  }

  if (mode === 'intervals' && audioData.interval) {
    const { rootNote, intervalSemitones, direction } = audioData.interval;
    const targetNote = addSemitones(rootNote, intervalSemitones);

    if (direction === 'descending') {
      return [rootNote, addSemitones(rootNote, -intervalSemitones)];
    }
    return [rootNote, targetNote];
  }

  if (mode === 'chords' && audioData.chord) {
    const { rootNote, chordType, inversion } = audioData.chord;
    return getChordNotes(rootNote, chordType, inversion || 0);
  }

  if (mode === 'progressions' && audioData.progression) {
    // Get all notes from all chords in the progression
    const { key, progression } = audioData.progression;
    const chords = getProgressionChords(key, progression);
    const allNotes: NoteOctave[] = [];

    chords.forEach(({ rootNote, chord }) => {
      const chordNotes = getChordNotes(rootNote, chord, 0);
      allNotes.push(...chordNotes);
    });

    return allNotes;
  }

  if (mode === 'scales' && audioData.scale) {
    // Generate all notes in the scale
    const { rootNote, scaleType } = audioData.scale;
    const scaleNotes: NoteOctave[] = [];

    scaleType.intervals.forEach(semitones => {
      scaleNotes.push(addSemitones(rootNote, semitones));
    });

    return scaleNotes;
  }

  return [];
}

// Get chord groups for progressions (each chord as a separate group)
function getChordGroupsFromAudioData(audioData: AudioQuestionData): NoteOctave[][] | null {
  if (audioData.mode !== 'progressions' || !audioData.progression) {
    return null;
  }

  const { key, progression } = audioData.progression;
  const chords = getProgressionChords(key, progression);

  return chords.map(({ rootNote, chord }) => {
    return getChordNotes(rootNote, chord, 0);
  });
}

function getIntervalDescription(audioData: AudioQuestionData): string {
  if (audioData.mode !== 'intervals' || !audioData.interval) return '';

  const { rootNote, intervalSemitones, direction } = audioData.interval;
  const interval = INTERVALS.find(i => i.semitones === intervalSemitones);
  const targetNote = direction === 'descending'
    ? addSemitones(rootNote, -intervalSemitones)
    : addSemitones(rootNote, intervalSemitones);

  const directionLabel = direction === 'harmonic' ? 'played together' :
    direction === 'ascending' ? 'ascending' : 'descending';

  return `${formatNoteDisplay(rootNote)} → ${formatNoteDisplay(targetNote)} (${interval?.name || ''}, ${directionLabel})`;
}

function getChordDescription(audioData: AudioQuestionData): string {
  if (audioData.mode !== 'chords' || !audioData.chord) return '';

  const { rootNote, chordType, inversion } = audioData.chord;
  const notes = getChordNotes(rootNote, chordType, inversion || 0);

  const inversionLabel = inversion === 1 ? ' (1st inversion)' :
    inversion === 2 ? ' (2nd inversion)' : '';

  return `${rootNote.note} ${chordType.name}${inversionLabel}: ${notes.map(formatNoteDisplay).join(' - ')}`;
}

function getPitchDescription(audioData: AudioQuestionData): string {
  if (audioData.mode !== 'pitches' || !audioData.pitch) return '';

  return formatNoteDisplay(audioData.pitch.note);
}

function getProgressionDescription(audioData: AudioQuestionData): string {
  if (audioData.mode !== 'progressions' || !audioData.progression) return '';

  const { key, progression } = audioData.progression;
  const chords = getProgressionChords(key, progression);
  const chordNames = chords.map(({ rootNote, chord }) =>
    `${rootNote.note} ${chord.name}`
  ).join(' - ');

  return `Key of ${key}: ${progression.romanNumerals.join(' - ')} (${chordNames})`;
}

function getScaleDescription(audioData: AudioQuestionData): string {
  if (audioData.mode !== 'scales' || !audioData.scale) return '';

  const { rootNote, scaleType, direction } = audioData.scale;
  const directionLabel = direction === 'both' ? 'ascending & descending' : direction;

  return `${rootNote.note} ${scaleType.name} (${directionLabel})`;
}

function getModeLabel(mode: GameMode): string {
  switch (mode) {
    case 'pitches': return 'Pitch';
    case 'intervals': return 'Interval';
    case 'chords': return 'Chord';
    case 'progressions': return 'Progression';
    case 'scales': return 'Scale';
    default: return '';
  }
}

export default function AnswerVisualization({ audioData, correctAnswer }: Props) {
  const notes = getNotesFromAudioData(audioData);
  const chordGroups = getChordGroupsFromAudioData(audioData);
  const mode = audioData.mode;

  // Get description based on mode
  const getDescription = (): string => {
    switch (mode) {
      case 'pitches': return getPitchDescription(audioData);
      case 'intervals': return getIntervalDescription(audioData);
      case 'chords': return getChordDescription(audioData);
      case 'progressions': return getProgressionDescription(audioData);
      case 'scales': return getScaleDescription(audioData);
      default: return '';
    }
  };

  // Calculate appropriate octave range for piano
  const minOctave = notes.length > 0
    ? Math.min(...notes.map(n => n.octave)) - 1
    : 3;
  const maxOctave = notes.length > 0
    ? Math.max(...notes.map(n => n.octave)) + 1
    : 5;

  return (
    <div className="answer-visualization">
      <h3 className="visualization-title">{getModeLabel(mode)} Details</h3>

      {/* Text description */}
      <div className="visualization-text">
        <span className="viz-label">Answer:</span>
        <span className="viz-value">{correctAnswer}</span>
      </div>

      {getDescription() && (
        <div className="visualization-text">
          <span className="viz-label">Notes:</span>
          <span className="viz-value">{getDescription()}</span>
        </div>
      )}

      {/* Show piano and staff for all modes with notes */}
      {notes.length > 0 && (
        <>
          {/* Piano keyboard */}
          <div className="visualization-section">
            <h4 className="section-title">Piano</h4>
            <PianoKeyboard
              highlightedNotes={notes}
              startOctave={Math.max(1, minOctave)}
              endOctave={Math.min(7, maxOctave)}
            />
          </div>

          {/* Music staff */}
          <div className="visualization-section">
            <h4 className="section-title">Staff Notation</h4>
            <MusicStaff notes={notes} chordGroups={chordGroups ?? undefined} />
          </div>
        </>
      )}
    </div>
  );
}
