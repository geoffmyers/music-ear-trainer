'use client';

interface Props {
  showSubtitle?: boolean;
  onHomeClick?: () => void;
}

export default function Header({ showSubtitle = false, onHomeClick }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    if (onHomeClick) {
      e.preventDefault();
      onHomeClick();
    }
  };

  return (
    <header className="header">
      <a href="/" className="title-link" onClick={handleClick}>
        <h1 className="title">Music Ear Trainer</h1>
      </a>
      {showSubtitle && (
        <p className="subtitle">Train your ear with intervals, chords, progressions, and perfect pitch</p>
      )}
    </header>
  );
}
