'use strict';
/* Shared math, text and drawing helpers. Every frame is a pure function of time t. */
const C = document.getElementById('c');
const ctx = C.getContext('2d');
const W = 1080, H = 1920;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eOutCubic = t => 1 - Math.pow(1 - t, 3);
const eOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOutBack = (t, s = 1.70158) => { const c = s + 1; return 1 + c * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
const spring = (t, f = 14, d = 6) => t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(f * t);
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// gentle idle drift so nothing at rest is frozen
const drift = (t, seed, amp = 3) => [Math.sin(t * .9 + seed) * amp, Math.cos(t * .7 + seed * 1.7) * amp * .7];

/* ---------- text ---------- */
function setFont(size, weight, family) {
  ctx.font = `${weight} ${size}px '${family}'`;
  ctx.letterSpacing = (family === 'Inter Tight' && size >= 150) ? `${-0.02 * size}px` : '0px';
}
function tw(s, size, weight, family) { setFont(size, weight, family); const w = ctx.measureText(s).width; ctx.letterSpacing = '0px'; return w; }
// largest size <= max at which s fits maxW
function fitSize(s, maxW, max, weight, family, min = 40) { let z = max; while (z > min && tw(s, z, weight, family) > maxW) z -= 4; return z; }
// split a phrase into <= 2 balanced lines when a single line would be too small
function balance(s) {
  const ws = s.split(' '); if (ws.length < 2) return [s];
  let best = [s], bd = 1e9;
  for (let i = 1; i < ws.length; i++) { const a = ws.slice(0, i).join(' '), b = ws.slice(i).join(' '); const d = Math.abs(a.length - b.length); if (d < bd) { bd = d; best = [a, b]; } }
  return best;
}
// wrap into lines of max width
function wrap(s, maxW, size, weight, family) {
  const out = []; let cur = '';
  for (const w of s.split(' ')) { const c = cur ? cur + ' ' + w : w; if (cur && tw(c, size, weight, family) > maxW) { out.push(cur); cur = w; } else cur = c; }
  if (cur) out.push(cur); return out;
}

/* ---------- numbers: "$1.75B", "300,000", "60%", "4 YEARS" ---------- */
function parseNum(s) {
  const m = String(s).match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const raw = m[2]; const dec = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { pre: m[1], val: parseFloat(raw.replace(/,/g, '')), dec, commas: raw.includes(','), suf: m[3] };
}
function fmtNum(n, v) {
  let s = v.toFixed(n.dec);
  if (n.commas) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? '.' + b : ''); }
  return n.pre + s + n.suf;
}
// counted string at local progress p (0..1); the final string is always exactly the authored one
function countStr(s, p) { const n = parseNum(s); if (!n || p >= 1) return s; return fmtNum(n, n.val * eOutCubic(clamp(p))); }

/* ---------- shapes ---------- */
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, c) { rr(x, y, w, h, r); ctx.fillStyle = c; ctx.fill(); }
function circ(x, y, r, c) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); }
// stroke a polyline drawn on with progress p
function strokePath(pts, p, lw, col) {
  let total = 0; for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let left = total * p; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); const f = Math.min(1, left / d); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= d; }
  ctx.stroke();
}
function fade(col, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
