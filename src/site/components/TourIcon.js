// Play and pause marks for the tour controls, drawn to sit optically centred
// in a round button.
export default function TourIcon({ playing = false, size = 10 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true" focusable="false">
      {playing ? (
        <path d="M2.4 1.6h2.5v8.8H2.4zM7.1 1.6h2.5v8.8H7.1z" fill="currentColor" />
      ) : (
        <path d="M3.4 1.5v9L10.9 6z" fill="currentColor" />
      )}
    </svg>
  );
}
