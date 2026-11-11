import { FIGURE_ASPECT, phoneLeftEdge, placeSpaceman } from './spaceman';

// A 1440x900 window: the name ends at 620 and its block starts at 414.
const tall = {
  width: 1440, height: 900, gutter: 49, stacked: false,
  title: { top: 414, height: 252 }, nameRight: 620, skyTop: 119, rightLimit: phoneLeftEdge(1440, 900),
};
// A 1366x650 laptop: the name fills the height, with almost no sky above it.
const squat = {
  width: 1366, height: 650, gutter: 46, stacked: false,
  title: { top: 181, height: 239 }, nameRight: 588, skyTop: 119, rightLimit: phoneLeftEdge(1366, 650),
};
const phone = {
  width: 390, height: 664, gutter: 18, stacked: true,
  title: { top: 389, height: 102 }, nameRight: 248, skyTop: 375, rightLimit: 372,
};
const bottom = place => place.top + place.width / FIGURE_ASPECT;

test('in a tall window he lies above the name, clear of it and of the top line', () => {
  const place = placeSpaceman(tall);
  expect(place.mode).toBe('above');
  expect(place.top).toBeGreaterThanOrEqual(tall.skyTop + 16);
  expect(bottom(place)).toBeLessThanOrEqual(tall.title.top - 22 + 0.01);
  // Reaching toward the phone, never onto it.
  expect(place.left + place.width).toBeLessThan(tall.rightLimit);
  expect(place.left).toBeGreaterThanOrEqual(tall.gutter);
});

test('with no sky above the name he floats in the band beside it', () => {
  const place = placeSpaceman(squat);
  expect(place.mode).toBe('beside');
  // Between the end of the name and the phone, touching neither.
  expect(place.left).toBeGreaterThan(squat.nameRight);
  expect(place.left + place.width).toBeLessThan(squat.rightLimit);
  expect(place.top).toBeGreaterThanOrEqual(squat.skyTop + 16);
});

test('he takes whichever place lets him be larger', () => {
  const above = placeSpaceman(tall);
  // The same window with the name pushed up to the top line leaves only the band.
  const beside = placeSpaceman({ ...tall, title: { top: 150, height: 252 } });
  expect(beside.mode).toBe('beside');
  expect(above.width).toBeGreaterThan(beside.width);
});

test('he never grows past a share of the window, however much room there is', () => {
  const place = placeSpaceman({ ...tall, width: 3840, height: 2160, title: { top: 1200, height: 400 }, nameRight: 900, rightLimit: 2400 });
  expect(place.width).toBeLessThanOrEqual(560);
});

test('on a phone he is an accent beside the name, inside the screen', () => {
  const place = placeSpaceman(phone);
  expect(place.mode).toBe('beside');
  expect(place.left).toBeGreaterThan(phone.nameRight);
  expect(place.left + place.width).toBeLessThanOrEqual(phone.width - phone.gutter);
  // Level with the name, not up in the 3D phone's space.
  expect(place.top).toBeGreaterThanOrEqual(phone.title.top - 4);
  expect(bottom(place)).toBeLessThanOrEqual(phone.title.top + phone.title.height);
});

test('he stays away where there is no room for him', () => {
  // A 320px phone: the name runs almost to the edge.
  expect(placeSpaceman({ ...phone, width: 320, nameRight: 232, rightLimit: 302 })).toBeNull();
  // A narrow desktop window with the name against the phone and no sky.
  expect(placeSpaceman({ ...squat, width: 800, nameRight: 470, rightLimit: 520, title: { top: 150, height: 200 } })).toBeNull();
  // Something on the right that starts left of where the name ends.
  expect(placeSpaceman({ ...squat, rightLimit: 400, title: { top: 150, height: 200 } })).toBeNull();
});

test('measurements that are not ready yet place nothing rather than something wrong', () => {
  expect(placeSpaceman({ ...tall, nameRight: NaN })).toBeNull();
  expect(placeSpaceman({ ...tall, title: null })).toBeNull();
  expect(placeSpaceman({ ...tall, rightLimit: undefined })).toBeNull();
});

test('the phone edge follows the scene: further right in a wide window, further left in a tall one', () => {
  expect(phoneLeftEdge(1920, 1080)).toBeGreaterThan(phoneLeftEdge(1440, 900));
  expect(phoneLeftEdge(1280, 1024)).toBeLessThan(phoneLeftEdge(1280, 610));
});
