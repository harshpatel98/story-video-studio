'use strict';
/* Core: turns window.TL (beats + word times + "show" elements) into a deterministic seek(t).
   Looks (look-v3.js, look-v2.js) only decide how each element type looks and moves. */
const TL = window.TL;
const LOOK = LOOKS[TL.look] || LOOKS.v3;
const BEATS = TL.beats;
const TURN_I = Math.max(0, BEATS.findIndex(b => b.turn));
const postTurn = b => b.i >= TURN_I;
const TYPES = ['title', 'number', 'text', 'small', 'icon', 'icons', 'bars', 'date', 'phone', 'stamp', 'span', 'trend'];
const EVENTS = [];

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9.%]/g, '').replace(/\.$/, '');
function wordT(b, sub, after = -1) {
  const n = norm(sub); if (!n) return null;
  const w = b.words.find(w => w.t > after && norm(w.w).includes(n)) || b.words.find(w => norm(w.w).includes(n));
  return w ? w.t : null;
}
// default trigger word for an element: its first digits (numbers) or its first meaningful word
function autoAt(el) {
  const v = Array.isArray(el.value) ? (el.value[0] && el.value[0][0]) || '' : String(el.value);
  const d = v.match(/\d+/); if (el.type === 'number' || el.type === 'date') return d ? d[0] : v;
  const ws = v.split(/\s+/).filter(w => norm(w).length > 2); return ws[0] || v;
}

function prepare() {
  for (const b of BEATS) {
    if (b.id === 'endcard') continue;
    const first = b.words.length ? b.words[0].t : b.start;
    const els = (b.show || []).map((raw, k) => {
      const type = TYPES.find(T => raw[T] !== undefined) || 'text';
      const el = Object.assign({}, raw, { type, value: raw[type], k });
      let t = el.at !== undefined ? wordT(b, el.at) : wordT(b, autoAt(el));
      if (t == null) t = first + k * .45;
      el.t0 = clamp(t - .06, b.start, Math.max(b.start, b.end - .3));
      if (el.strike_at) el.tStrike = wordT(b, el.strike_at); else if (el.strike) el.tStrike = el.t0 + .6;
      if (el.snap_at) el.tSnap = wordT(b, el.snap_at);
      el.entrance = LOOK.entrance(el, b);
      return el;
    });
    // never leave a beat empty: the earliest element always opens the beat, so a cut never shows a blank frame
    if (els.length) els.reduce((a, e) => e.t0 < a.t0 ? e : a).t0 = b.start;
    b.els = els;
    // vertical auto-layout: a left/centred stack inside the look's safe region, scaled down if it overflows
    const R = LOOK.region; const gap = 44;
    const hs = els.map(el => LOOK.measure(el, b));
    const total = hs.reduce((a, h) => a + h, 0) + gap * Math.max(0, els.length - 1);
    const s = Math.min(1, (R.bottom - R.top) / Math.max(1, total));
    let y = R.top + ((R.bottom - R.top) - total * s) * .42;
    b.layout = { s, y0: y };
    let acc = 0; els.forEach((el, i) => { el.y = acc; el.h = hs[i]; acc += hs[i] + gap; });
    // sound/QC events
    EVENTS.push({ t: b.start, kind: 'beat', beat: b.id });
    if (b.turn) EVENTS.push({ t: b.start, kind: 'turn', beat: b.id });
    for (const el of els) {
      EVENTS.push({ t: el.t0, kind: el.entrance, type: el.type, beat: b.id });
      if (el.type === 'number' && el.count !== false && parseNum(el.value)) EVENTS.push({ t: el.t0, t1: el.t0 + .65, kind: 'count', beat: b.id });
      if (el.type === 'stamp') EVENTS.push({ t: el.t0 + .12, kind: 'stamp', beat: b.id });
      if (el.tStrike != null) EVENTS.push({ t: el.tStrike, kind: 'strike', beat: b.id });
      if (el.tSnap != null) EVENTS.push({ t: el.tSnap, kind: 'snap', beat: b.id });
    }
    for (const w of b.words) if (w.hl) EVENTS.push({ t: w.t, kind: 'hlword', beat: b.id });
  }
  const ec = BEATS.find(b => b.id === 'endcard'); if (ec) EVENTS.push({ t: ec.start, kind: 'endcard' });
  EVENTS.push({ t: BEATS[BEATS.length - 2].start, kind: 'kicker' });
  EVENTS.sort((a, b) => a.t - b.t);
}

function beatAt(t) { for (let i = BEATS.length - 1; i >= 0; i--) if (t >= BEATS[i].start) return BEATS[i]; return BEATS[0]; }

// draw every element of beat b at time t, in the stack layout
function drawElements(t, b) {
  const L = b.layout; if (!L) return;
  ctx.save(); ctx.translate(0, L.y0); ctx.scale(L.s, L.s);
  if (L.s < 1) ctx.translate((W / L.s - W) * (LOOK.align === 'center' ? .5 : 0), 0);
  const cw = W / L.s;
  for (const el of b.els) {
    if (t < el.t0 - .001) continue;
    ctx.save(); ctx.translate(0, el.y); LOOK.draw(el, t, b, cw); ctx.restore();
  }
  ctx.restore();
}

function seek(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const b = beatAt(t);
  if (b.id === 'endcard') { drawEndcard(t, b); fade('#000', 1 - prog(t - b.start, 0, .35)); return; }
  LOOK.frame(t, b);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (b.caption !== false) LOOK.caption(t, b);
  if (LOOK.overlay) LOOK.overlay(t, b);
  const next = BEATS[b.i + 1];
  if (next && next.id === 'endcard') fade('#000', prog(t, next.start - .3, next.start));
  if (t < .3) fade('#000', 1 - t / .3);
}

window.seek = seek; window.END = TL.duration; window.EVENTS = EVENTS;
window.READY = false;
// layout measures text, so fonts must be loaded before prepare()
Promise.all(LOOK.fonts.concat(["600 40px 'Poppins'", "900 40px 'Poppins'"]).map(f => document.fonts.load(f)))
  .then(() => { prepare(); seek(0); window.READY = true; })
  .catch(e => { window.READY_ERROR = String(e); });
