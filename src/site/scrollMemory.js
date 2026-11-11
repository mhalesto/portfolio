// Remembers how far each history entry was scrolled, so Back returns a
// visitor to the chapter they left instead of the top of a very long page.
// Kept in memory only: a reload still opens at the top, as it always has.

const LIMIT = 60;
const positions = new Map();

export function rememberScroll(key, y) {
  if (!key || !Number.isFinite(y)) return;
  // Re-inserting keeps the most recently visited entries when trimming.
  positions.delete(key);
  positions.set(key, Math.max(0, Math.round(y)));
  if (positions.size > LIMIT) positions.delete(positions.keys().next().value);
}

export function recallScroll(key) {
  return positions.has(key) ? positions.get(key) : null;
}

export function forgetScroll() {
  positions.clear();
}
