import { person } from './data';

// "Your app": a visitor names an app idea and gets an icon for it on the hero
// phone and in the finale orbit. It lives only in this browser (localStorage)
// until the visitor chooses to email it.

const STORAGE_KEY = 'hgm-your-app';
export const NAME_MAX = 24;
export const IDEA_MAX = 80;

const PALETTES = [
  ['#ff7a59', '#ff3d77'],
  ['#7c5cff', '#22d3ee'],
  ['#10b981', '#3b82f6'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
  ['#06b6d4', '#6366f1'],
  ['#84cc16', '#0ea5a4'],
  ['#f43f5e', '#f97316'],
];

// First match wins, so more specific themes come first.
const GLYPHS = [
  ['calendar', /\b(booking|bookings|book a|appointment|schedul|calendar|event|reserv)/],
  ['music', /\b(music|song|playlist|beat|audio|podcast|dj|radio)/],
  ['play', /\b(video|film|movie|stream|tv|reel)/],
  ['camera', /\b(photo|camera|picture|selfie)/],
  ['food', /\b(food|restaurant|meal|recipe|cook|kitchen|cafe|coffee|pizza|eat|bakery)/],
  ['dumbbell', /\b(gym|fitness|workout|exercise|training|running|sport)/],
  ['heart', /\b(health|care|doctor|clinic|therap|wellness|dating|love|medic|nurse)/],
  ['bag', /\b(shop|store|sell|ecommerce|market|boutique|fashion|cloth)/],
  ['car', /\b(car|taxi|ride|transport|delivery|deliver|drive|driver|logistic|truck)/],
  ['money', /\b(money|budget|finance|bank|invest|pay|wallet|expense|saving|stokvel|loan)/],
  ['book', /\b(school|learn|study|class|course|tutor|educat|homework|reading|books?|library|exam)/],
  ['chat', /\b(chat|message|community|social|talk|friends|forum|church)/],
  ['home', /\b(home|house|property|rent|estate|landlord|apartment|plumb|repair)/],
  ['paw', /\b(pet|dog|cat|vet|animal)/],
  ['leaf', /\b(garden|plant|farm|eco|green|recycl|nature)/],
  ['pin', /\b(travel|trip|tour|map|location|guide|hotel)/],
  ['game', /\b(game|gaming|quiz|puzzle|play)/],
];

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function cleanYourApp(value) {
  if (!value || typeof value.name !== 'string') return null;
  const name = value.name.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
  if (!name) return null;
  const idea = typeof value.idea === 'string' ? value.idea.replace(/\s+/g, ' ').trim().slice(0, IDEA_MAX) : '';
  return { name, idea };
}

export function loadYourApp() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? cleanYourApp(JSON.parse(raw)) : null;
  } catch (error) {
    return null;
  }
}

export function saveYourApp(app) {
  try {
    if (app) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(app));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Private mode or blocked storage: the app just won't survive a reload.
  }
}

export function yourAppColors(app) {
  const [a, b] = PALETTES[hash(app ? app.name.toLowerCase() : '') % PALETTES.length];
  return { a, b, bg: '#07080d' };
}

export function yourAppGlyph(app) {
  const text = `${app.name} ${app.idea}`.toLowerCase();
  const match = GLYPHS.find(([, pattern]) => pattern.test(text));
  return match ? match[0] : 'letter';
}

export function buildMailto(app) {
  const subject = `App idea: ${app.name}`;
  const lines = [
    `Hi ${person.firstName},`,
    '',
    `I'd like to build an app called ${app.name}.`,
    app.idea ? `What it should do: ${app.idea}` : 'What it should do: ',
    '',
    'My name: ',
    'Best way to reach me: ',
    '',
    '(Sent from the "Your app" slot on halalisani.com)',
  ];
  return `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

// Glyphs are drawn in a 100 x 100 box, white, centred on the icon.
function drawGlyph(ctx, glyph) {
  const stroke = () => ctx.stroke();
  const fill = () => ctx.fill();
  const round = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  const circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  };
  ctx.beginPath();
  switch (glyph) {
    case 'calendar':
      round(14, 22, 72, 64, 12);
      stroke();
      ctx.beginPath();
      ctx.moveTo(14, 42);
      ctx.lineTo(86, 42);
      ctx.moveTo(34, 14);
      ctx.lineTo(34, 28);
      ctx.moveTo(66, 14);
      ctx.lineTo(66, 28);
      stroke();
      [
        [32, 58],
        [50, 58],
        [68, 58],
        [32, 72],
        [50, 72],
      ].forEach(([x, y]) => {
        circle(x, y, 4.5);
        fill();
      });
      break;
    case 'music':
      ctx.moveTo(40, 72);
      ctx.lineTo(40, 22);
      ctx.lineTo(80, 14);
      ctx.lineTo(80, 64);
      stroke();
      circle(30, 74, 11);
      fill();
      circle(70, 66, 11);
      fill();
      break;
    case 'play':
      circle(50, 50, 38);
      stroke();
      ctx.beginPath();
      ctx.moveTo(41, 32);
      ctx.lineTo(69, 50);
      ctx.lineTo(41, 68);
      ctx.closePath();
      fill();
      break;
    case 'camera':
      round(12, 28, 76, 54, 12);
      stroke();
      ctx.beginPath();
      ctx.moveTo(36, 28);
      ctx.lineTo(42, 18);
      ctx.lineTo(58, 18);
      ctx.lineTo(64, 28);
      stroke();
      circle(50, 55, 15);
      stroke();
      break;
    case 'food':
      ctx.moveTo(32, 14);
      ctx.lineTo(32, 86);
      ctx.moveTo(22, 14);
      ctx.lineTo(22, 34);
      ctx.quadraticCurveTo(22, 44, 32, 44);
      ctx.quadraticCurveTo(42, 44, 42, 34);
      ctx.lineTo(42, 14);
      ctx.moveTo(68, 86);
      ctx.lineTo(68, 14);
      ctx.quadraticCurveTo(82, 26, 80, 52);
      ctx.lineTo(68, 52);
      stroke();
      break;
    case 'dumbbell':
      ctx.moveTo(30, 50);
      ctx.lineTo(70, 50);
      stroke();
      round(14, 30, 12, 40, 4);
      fill();
      round(74, 30, 12, 40, 4);
      fill();
      round(6, 38, 8, 24, 3);
      fill();
      round(86, 38, 8, 24, 3);
      fill();
      break;
    case 'heart':
      ctx.moveTo(50, 84);
      ctx.bezierCurveTo(14, 60, 10, 38, 22, 26);
      ctx.bezierCurveTo(34, 14, 48, 22, 50, 32);
      ctx.bezierCurveTo(52, 22, 66, 14, 78, 26);
      ctx.bezierCurveTo(90, 38, 86, 60, 50, 84);
      fill();
      break;
    case 'bag':
      round(18, 34, 64, 52, 10);
      stroke();
      ctx.beginPath();
      ctx.moveTo(36, 44);
      ctx.lineTo(36, 30);
      ctx.quadraticCurveTo(36, 16, 50, 16);
      ctx.quadraticCurveTo(64, 16, 64, 30);
      ctx.lineTo(64, 44);
      stroke();
      break;
    case 'car':
      ctx.moveTo(12, 64);
      ctx.lineTo(12, 50);
      ctx.lineTo(24, 46);
      ctx.lineTo(34, 30);
      ctx.lineTo(66, 30);
      ctx.lineTo(76, 46);
      ctx.lineTo(88, 50);
      ctx.lineTo(88, 64);
      ctx.closePath();
      stroke();
      circle(30, 68, 9);
      fill();
      circle(70, 68, 9);
      fill();
      break;
    case 'money':
      round(16, 58, 14, 26, 3);
      fill();
      round(43, 42, 14, 42, 3);
      fill();
      round(70, 26, 14, 58, 3);
      fill();
      ctx.beginPath();
      ctx.moveTo(14, 40);
      ctx.lineTo(40, 22);
      ctx.lineTo(54, 30);
      ctx.lineTo(80, 12);
      stroke();
      break;
    case 'book':
      ctx.moveTo(50, 28);
      ctx.quadraticCurveTo(34, 18, 12, 22);
      ctx.lineTo(12, 78);
      ctx.quadraticCurveTo(34, 74, 50, 84);
      ctx.quadraticCurveTo(66, 74, 88, 78);
      ctx.lineTo(88, 22);
      ctx.quadraticCurveTo(66, 18, 50, 28);
      ctx.lineTo(50, 84);
      stroke();
      break;
    case 'chat':
      round(12, 16, 76, 54, 16);
      stroke();
      ctx.beginPath();
      ctx.moveTo(30, 70);
      ctx.lineTo(26, 88);
      ctx.lineTo(46, 70);
      stroke();
      [34, 50, 66].forEach(x => {
        circle(x, 43, 5);
        fill();
      });
      break;
    case 'home':
      ctx.moveTo(12, 48);
      ctx.lineTo(50, 16);
      ctx.lineTo(88, 48);
      ctx.moveTo(22, 40);
      ctx.lineTo(22, 84);
      ctx.lineTo(78, 84);
      ctx.lineTo(78, 40);
      ctx.moveTo(42, 84);
      ctx.lineTo(42, 62);
      ctx.lineTo(58, 62);
      ctx.lineTo(58, 84);
      stroke();
      break;
    case 'paw':
      [
        [30, 36, 8],
        [46, 26, 8],
        [62, 28, 8],
        [74, 42, 8],
      ].forEach(([x, y, r]) => {
        circle(x, y, r);
        fill();
      });
      ctx.beginPath();
      ctx.ellipse(52, 64, 20, 17, 0, 0, Math.PI * 2);
      fill();
      break;
    case 'leaf':
      ctx.moveTo(18, 84);
      ctx.bezierCurveTo(14, 40, 44, 14, 86, 14);
      ctx.bezierCurveTo(86, 58, 60, 86, 18, 84);
      fill();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(22, 80);
      ctx.quadraticCurveTo(46, 50, 74, 26);
      stroke();
      ctx.restore();
      break;
    case 'pin':
      ctx.moveTo(50, 88);
      ctx.bezierCurveTo(26, 60, 20, 48, 20, 38);
      ctx.bezierCurveTo(20, 20, 34, 10, 50, 10);
      ctx.bezierCurveTo(66, 10, 80, 20, 80, 38);
      ctx.bezierCurveTo(80, 48, 74, 60, 50, 88);
      fill();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      circle(50, 38, 11);
      fill();
      ctx.restore();
      break;
    case 'game':
      round(10, 30, 80, 42, 21);
      stroke();
      ctx.beginPath();
      ctx.moveTo(24, 51);
      ctx.lineTo(40, 51);
      ctx.moveTo(32, 43);
      ctx.lineTo(32, 59);
      stroke();
      circle(64, 46, 5);
      fill();
      circle(74, 56, 5);
      fill();
      break;
    default:
      break;
  }
}

// Draws the icon onto a canvas (default 512 x 512). Safe to call where the
// canvas has no 2D context, e.g. in tests: it simply draws nothing.
export function drawYourAppIcon(canvas, app, size = 512) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx || !app) return canvas;
  const { a, b } = yourAppColors(app);
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, a);
  base.addColorStop(1, b);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const light = ctx.createRadialGradient(size * 0.22, size * 0.14, 0, size * 0.22, size * 0.14, size * 0.8);
  light.addColorStop(0, 'rgba(255,255,255,0.38)');
  light.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, size, size);
  const shade = ctx.createLinearGradient(0, size * 0.5, 0, size);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = size * 0.04;
  ctx.shadowOffsetY = size * 0.015;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  const glyph = yourAppGlyph(app);
  if (glyph === 'letter') {
    ctx.font = `700 ${Math.round(size * 0.52)}px "Inter Tight Variable", "Inter Tight", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(app.name.charAt(0).toUpperCase(), size / 2, size * 0.53);
  } else {
    const scale = (size * 0.5) / 100;
    ctx.translate(size / 2 - 50 * scale, size / 2 - 50 * scale);
    ctx.scale(scale, scale);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawGlyph(ctx, glyph);
  }
  ctx.restore();
  return canvas;
}

export function yourAppIconUrl(app, size = 256) {
  if (!app || typeof document === 'undefined') return '';
  const canvas = drawYourAppIcon(document.createElement('canvas'), app, size);
  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return '';
  try {
    return canvas.toDataURL('image/png');
  } catch (error) {
    return '';
  }
}
