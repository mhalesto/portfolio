// Where the floating astronaut fits in the hero. Pure arithmetic over a few
// measured boxes, so the placement can be reasoned about and tested apart
// from the page.
//
// The astronaut reclines from boots at the lower left to an open hand at the
// upper right. Two places can hold him: the band between the end of the name
// and whatever stands on the right (the 3D phone, the icon grid, the screen
// edge), or the open sky above the name when the window is tall enough. He
// takes whichever lets him be larger.

export const FIGURE_ASPECT = 960 / 594;

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

// All numbers are pixels in one coordinate space (the hero's own box).
//   width, height   the hero's visible size
//   gutter          the page's side margin
//   stacked         the phone layout: name under the 3D phone, nothing to its right
//   title           { top, height } of the name block
//   nameRight       where the ink of the longer line of the name ends
//   skyTop          the lowest thing above the name's open sky (the top line)
//   rightLimit      the left edge of whatever stands to the right
export function placeSpaceman({ width, height, gutter, stacked, title, nameRight, skyTop, rightLimit }) {
  if (![width, height, gutter, nameRight, rightLimit].every(Number.isFinite) || !title) return null;

  if (stacked) {
    // Beside the name, as an accent: there is no sky here, the phone has it.
    const left = nameRight + 10;
    const size = Math.min(width - gutter - left, width * 0.42);
    if (size < 70) return null;
    const tall = size / FIGURE_ASPECT;
    return { left, top: title.top + title.height * 0.46 - tall / 2, width: size, mode: 'beside' };
  }

  const most = Math.min(width * 0.36, 560);
  const bandLeft = nameRight + 26;
  const bandRight = rightLimit - 30;

  // Beside the name, level with its first line.
  const besideWidth = Math.min(bandRight - bandLeft, most);
  const besideTall = besideWidth / FIGURE_ASPECT;
  const beside = {
    left: bandRight - besideWidth,
    top: Math.max(skyTop + 16, title.top + title.height * 0.25 - besideTall * 0.56),
    width: besideWidth,
    mode: 'beside',
  };

  // Above the name, lying back over its last letters and reaching right.
  const skyBottom = title.top - 22;
  const aboveTall = Math.min(skyBottom - (skyTop + 16), most / FIGURE_ASPECT);
  const aboveWidth = Math.min(aboveTall * FIGURE_ASPECT, bandRight - gutter);
  const aboveRight = Math.min(bandRight, nameRight + aboveWidth * 0.42);
  const above = {
    left: clamp(aboveRight - aboveWidth, gutter, Math.max(gutter, bandRight - aboveWidth)),
    top: skyBottom - aboveWidth / FIGURE_ASPECT,
    width: aboveWidth,
    mode: 'above',
  };

  const best = above.width > beside.width ? above : beside;
  return best.width >= 150 ? best : null;
}

// The 3D phone's left edge in the side-by-side hero. It is drawn on a canvas,
// so this mirrors the scene's own framing (centre at 73% of the width, about
// 68% of the height tall, tilted) rather than measuring anything.
export const phoneLeftEdge = (width, height) => width * 0.73 - height * 0.165;
