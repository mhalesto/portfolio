// The glass HM mark. Always decorative: whatever it sits in (the home link,
// the loading screen) carries the words. A band of light crosses the glass
// every few seconds, masked to the mark's own shape.
const SRC = `${process.env.PUBLIC_URL}/experience/hm-logo.webp`;

export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()} style={{ '--logo-mask': `url("${SRC}")` }}>
      <img className="logo__img" src={SRC} alt="" width="384" height="240" decoding="async" draggable="false" />
      <span className="logo__sheen" aria-hidden="true" />
    </span>
  );
}
