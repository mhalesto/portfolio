import { useState } from 'react';

// The glass HM mark. Always decorative: whatever it sits in (the home link,
// the loading screen) carries the words. A band of light crosses the glass
// every few seconds, masked to the mark's own shape. If the image cannot be
// had, the initials stand in as plain text rather than a broken-image box.
const SRC = `${process.env.PUBLIC_URL}/experience/hm-logo.webp`;

export default function Logo({ className = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`logo logo--text ${className}`.trim()} aria-hidden="true">
        HM
      </span>
    );
  }
  return (
    <span className={`logo ${className}`.trim()} style={{ '--logo-mask': `url("${SRC}")` }}>
      <img
        className="logo__img"
        src={SRC}
        alt=""
        width="384"
        height="240"
        decoding="async"
        draggable="false"
        onError={() => setFailed(true)}
      />
      <span className="logo__sheen" aria-hidden="true" />
    </span>
  );
}
