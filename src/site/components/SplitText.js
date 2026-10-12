// Splits text into masked words (or characters) so CSS can slide each piece
// up into view. Screen readers get the untouched sentence instead.
export default function SplitText({ text, as: Tag = 'span', mode = 'words', className = '', style }) {
  const words = text.split(' ');
  let index = 0;

  return (
    <Tag className={`split ${className}`} style={style}>
      <span className="sr-only">{text}</span>
      <span className="split__inner" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`}>
            <span className="split__word">
              {mode === 'chars' ? (
                Array.from(word).map((char, charIndex) => (
                  <span key={charIndex} className="split__piece" style={{ '--i': index++ }}>
                    {char}
                  </span>
                ))
              ) : (
                <span className="split__piece" style={{ '--i': index++ }}>
                  {word}
                </span>
              )}
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
