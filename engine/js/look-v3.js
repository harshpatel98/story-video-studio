'use strict';
/* V3 — Keynote Type: light mode, Inter Tight, left-aligned stacks, tabular numbers, rotated entrances,
   one whip pan into the TURN, red only from the TURN onward. */
var LOOKS = window.LOOKS || {};
(() => {
  const F = 'Inter Tight';
  const P = { paper: '#F6F4EF', ink: '#111216', grey: '#8A8F98', greyT: '#5C6169', greyL: '#D9D6CF', red: '#E5484D' };
  const X0 = 60, CW = 960;
  const accent = () => (window.TL && TL.accent) || '#6B3CF6';
  const colorOf = (el, b, dflt) => {
    const c = el.color || dflt;
    if (c === 'accent') return postTurn(b) ? P.red : accent();
    if (c === 'loss') return P.red; if (c === 'muted') return P.greyT; if (c === 'ink') return P.ink;
    return c;
  };

  /* ---------- type ---------- */
  function T(s, x, y, size, col, weight = 800, align = 'left', o = {}) {
    setFont(size, weight, F); ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
    if (o.shadow) { ctx.save(); ctx.fillStyle = 'rgba(17,18,22,.10)'; ctx.filter = 'blur(14px)'; ctx.fillText(s, x + 6, y + 14); ctx.fillStyle = 'rgba(17,18,22,.14)'; ctx.filter = 'blur(3px)'; ctx.fillText(s, x + 2, y + 4); ctx.restore(); }
    ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.letterSpacing = '0px';
  }
  // tabular figures: each digit in a fixed cell, so counting numbers never jitter
  function tabW(s, size) { setFont(size, 900, F); const cell = ctx.measureText('0').width * .98; let w = 0; for (const ch of s) w += /\d/.test(ch) ? cell : ctx.measureText(ch).width * .95; ctx.letterSpacing = '0px'; return w; }
  function tabNum(s, x, y, size, col, o = {}) {
    setFont(size, 900, F); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const cell = ctx.measureText('0').width * .98; let cx = x;
    for (const ch of s) {
      const w = /\d/.test(ch) ? cell : ctx.measureText(ch).width * .95;
      if (o.shadow) { ctx.save(); ctx.fillStyle = 'rgba(17,18,22,.12)'; ctx.filter = 'blur(12px)'; ctx.fillText(ch, cx + w / 2 + 5, y + 12); ctx.restore(); }
      if (o.blur && /\d/.test(ch)) { ctx.globalAlpha = .22; ctx.fillStyle = col; ctx.fillText(ch, cx + w / 2, y - size * .07); ctx.fillText(ch, cx + w / 2, y + size * .07); ctx.globalAlpha = 1; }
      ctx.fillStyle = col; ctx.fillText(ch, cx + w / 2, y); cx += w;
    }
    ctx.letterSpacing = '0px'; return cx - x;
  }
  const fitNum = (s, maxW, max = 400) => { let z = max; while (z > 60 && tabW(countMax(s), z) > maxW) z -= 4; return z; };
  const countMax = s => s; // authored string is the widest state of a count-up
  const textLines = (s, max = 200) => {
    const S = String(s).toUpperCase(); let z = fitSize(S, CW, max, 900, F);
    if (z < 130 && S.includes(' ')) { const ls = balance(S); z = Math.min(max, ...ls.map(l => fitSize(l, CW, max, 900, F))); return { lines: ls, size: z }; }
    return { lines: [S], size: z };
  };

  /* ---------- props ---------- */
  function field() {
    ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W / 2, H * .45, H * .35, W / 2, H * .5, H * .85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,55,45,.10)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }
  function phone(x, y, s, readout, col) {
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(-.04); ctx.scale(s, s);
    ctx.save(); ctx.fillStyle = 'rgba(17,18,22,.10)'; ctx.filter = 'blur(24px)'; ctx.beginPath(); ctx.roundRect(-136, -272, 300, 600, 48); ctx.fill(); ctx.restore();
    ctx.fillStyle = P.paper; ctx.beginPath(); ctx.roundRect(-150, -300, 300, 600, 48); ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 6 / s; ctx.stroke();
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.roundRect(-120, -260, 240, 300, 22); ctx.fill();
    if (readout) { const z = fitSize(String(readout), 200, 110, 900, F); T(String(readout), 0, -110 + z * .35, z, '#FFFFFF', 900, 'center'); }
    else { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-22, -150); ctx.lineTo(-22, -70); ctx.lineTo(42, -110); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = P.greyL; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.roundRect(-120, 70 + i * 58, i === 2 ? 150 : 240, 30, 15); ctx.fill(); }
    ctx.restore();
  }
  function calendar(x, y, s, top, val, head) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.05); ctx.scale(s, s);
    ctx.save(); ctx.fillStyle = 'rgba(17,18,22,.14)'; ctx.filter = 'blur(20px)'; ctx.beginPath(); ctx.roundRect(-240, -208, 500, 460, 36); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-250, -230, 500, 460, 36); ctx.fill();
    ctx.fillStyle = head; ctx.beginPath(); ctx.roundRect(-250, -230, 500, 130, [36, 36, 0, 0]); ctx.fill();
    if (top) T(String(top).toUpperCase(), 0, -140, fitSize(String(top).toUpperCase(), 440, 80, 900, F), '#FFFFFF', 900, 'center');
    const v = String(val); const z = fitNum(v, 420, 230); tabNum(v, -tabW(v, z) / 2, 150, z, P.ink);
    for (const rx of [-150, 150]) { ctx.fillStyle = P.ink; ctx.beginPath(); ctx.roundRect(rx - 10, -260, 20, 70, 10); ctx.fill(); }
    ctx.restore();
  }
  function ruler(x, y, len, p, snap = 0) {
    const dl = eOutExpo(p); const L = len * dl * (1 - snap) + len * .02 * snap;
    ctx.strokeStyle = P.ink; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y); ctx.stroke();
    ctx.lineWidth = 6; for (let m = 0; m <= 6; m++) { const mx = x + L * m / 6; if (m / 6 <= dl + 1e-6) { ctx.beginPath(); ctx.moveTo(mx, y - (m % 6 ? 26 : 44)); ctx.lineTo(mx, y + (m % 6 ? 26 : 44)); ctx.stroke(); } }
  }
  function maskWipe(y, h, p, draw) {
    if (p <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, y, W * p, h); ctx.clip(); draw(); ctx.restore();
    if (p < 1) { ctx.fillStyle = accent(); ctx.fillRect(W * p - 14, y, 14, h); }
  }
  // 3-sample motion blur for fast horizontal moves
  function mblur(draw, vel) { if (Math.abs(vel) > 1) { for (const [k, a] of [[2, .12], [1, .22]]) { ctx.save(); ctx.globalAlpha = a; ctx.translate(-vel * k * .016, 0); draw(); ctx.restore(); } } draw(); }

  /* ---------- entrances ---------- */
  const ROT = ['slam', 'slide', 'wipe'];
  function entrance(el, b) {
    if (el.type === 'small') return 'type';
    if (el.type === 'title') return 'wipe';
    if (['icon', 'icons'].includes(el.type)) return 'pop';
    if (['bars', 'span', 'trend'].includes(el.type)) return 'grow';
    if (el.type === 'phone') return 'slide';
    if (['date', 'stamp'].includes(el.type)) return 'slam';
    return ROT[(b.i + el.k) % ROT.length];
  }
  // run draw() inside the element's entrance; h = row height
  function enter(el, t, h, draw) {
    const lt = t - el.t0;
    if (el.entrance === 'slam') { const s = spring(lt, 13, 6); const k = lerp(.65, 1, clamp(s)) * (s > 1 ? 1 + .04 * (s - 1) : 1); ctx.save(); ctx.translate(X0, h); ctx.scale(k, k); ctx.translate(-X0, -h); draw(s >= .98); ctx.restore(); }
    else if (el.entrance === 'slide') { const a = eOutExpo(prog(lt, 0, .32)); const dir = el.k % 2 ? 1 : -1; const off = (1 - a) * 700 * dir; mblur(() => { ctx.save(); ctx.translate(off, 0); draw(a >= 1); ctx.restore(); }, -(1 - a) * 900 * dir); }
    else if (el.entrance === 'wipe') { maskWipe(-40, h + 80, eOutExpo(prog(lt, 0, .35)), () => draw(lt > .35)); }
    else if (el.entrance === 'pop') { const s = eOutBack(prog(lt, 0, .35), 1.8); ctx.save(); ctx.globalAlpha = clamp(s * 2); draw(s >= 1, s); ctx.restore(); }
    else draw(true, 1, lt);
  }

  /* ---------- measure / draw per element type ---------- */
  function measure(el) {
    switch (el.type) {
      case 'title': return 520;
      case 'number': { const z = fitNum(String(el.value), CW); return z * .76 + (el.label ? 100 : 20); }
      case 'text': { const L = textLines(el.value); return L.lines.length * L.size * .92; }
      case 'small': return wrap(String(el.value), 940, 64, 500, F).length * 80;
      case 'icon': case 'icons': return 230;
      case 'bars': return el.value.length * 230;
      case 'date': return 480;
      case 'phone': return 620;
      case 'stamp': return 210;
      case 'span': return 250;
      case 'trend': return 300;
    }
    return 120;
  }
  function draw(el, t, b) {
    const lt = t - el.t0; const h = el.h;
    switch (el.type) {
      case 'title': {
        const S = String(el.value).toUpperCase(); const z = fitSize(S, 890, 520, 900, F); const [dx] = drift(t, 4);
        enter(el, t, h, () => T(S, 90 + dx * .5, 260 + z * .35, z, colorOf(el, b, 'accent'), 900)); break;
      }
      case 'number': {
        const s = String(el.value); const z = fitNum(s, CW); const col = colorOf(el, b, postTurn(b) ? 'loss' : 'ink');
        const cp = el.count === false ? 1 : prog(lt, 0, .65); const [dx, dy] = drift(t, el.k + 1);
        enter(el, t, h, (landed) => { tabNum(countStr(s, cp), X0 + dx, z * .76 + dy, z, col, { shadow: landed && cp >= 1, blur: cp < 1 });
          if (el.label) T(String(el.label), X0 + 4, z * .76 + 80, 64, P.greyT, 500); });
        break;
      }
      case 'text': {
        const L = textLines(el.value); const col = colorOf(el, b, el.hl ? 'accent' : 'ink'); const [dx, dy] = drift(t, el.k + 3);
        enter(el, t, h, (landed) => L.lines.forEach((ln, i) => T(ln, X0 + dx * .6, L.size * .8 + i * L.size * .92 + dy, L.size, col, 900, 'left', { shadow: landed })));
        break;
      }
      case 'small': {
        const lines = wrap(String(el.value), 940, 64, 500, F); let n = Math.floor(clamp(lt * 28 + 4, 0, 999));
        lines.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, n)); n -= ln.length + 1; if (s) T(s, X0 + 4, 60 + i * 80, 64, colorOf(el, b, 'muted'), 500); });
        break;
      }
      case 'icon': {
        const [dx, dy] = drift(t, el.k + 6); const x = 860 + dx, y = 115 + dy; const s = eOutBack(prog(lt, 0, .35), 1.8);
        ctx.save(); ctx.globalAlpha = clamp(s * 2); icon(el.value, x, y, 1.0 * Math.max(.2, s), { col: P.ink }); ctx.restore();
        if (el.tStrike != null) strike(x, y, 1.0, eOutExpo(prog(t, el.tStrike, el.tStrike + .25)), P.red);
        break;
      }
      case 'icons': {
        const list = el.value.slice(0, 4); const gapx = Math.min(250, CW / list.length);
        list.forEach((k, i) => { const s = eOutBack(prog(lt, i * .12, i * .12 + .35), 1.8); if (s <= 0) return; const [dx, dy] = drift(t, i + 7); const x = X0 + 110 + i * gapx + dx, y = 115 + dy;
          ctx.save(); ctx.globalAlpha = clamp(s * 2); icon(k, x, y, .95 * Math.max(.2, s), { col: P.ink }); ctx.restore();
          const st = el.strike === true || el.strike === i; if (st && el.tStrike != null) strike(x, y, .95, eOutExpo(prog(t, el.tStrike, el.tStrike + .25)), P.red); });
        break;
      }
      case 'bars': {
        const rows = el.value; const max = Math.max(...rows.map(r => Number(r[1]) || 0)) || 1;
        rows.forEach(([lab, v], i) => { const t0 = i * .35; const a = slideIn(lt - t0); if (a <= 0) return; const y = i * 230;
          const vs = typeof v === 'number' ? v.toLocaleString('en-US') : String(v); const cs = countStr(vs, prog(lt - t0, 0, .6)); const z = 84; const vw = tabW(vs, z);
          T(String(lab).toUpperCase(), lerp(-400, X0, a), y + 84, fitSize(String(lab).toUpperCase(), CW - vw - 50, 84, 900, F), P.ink, 900);
          tabNum(cs, 1020 - vw, y + 84, z, P.ink);
          ctx.fillStyle = i === 0 ? P.ink : P.greyL; ctx.fillRect(X0, y + 115, Math.max(3, CW * (Number(v) / max) * eOutExpo(prog(lt - t0, 0, .5))), 70); });
        break;
      }
      case 'date': {
        const s = spring(lt, 13, 6); const k = lerp(1.5, 1, clamp(s)) * (s > 1 ? 1 + .05 * (s - 1) : 1);
        calendar(X0 + 270, 240, .95 * k, el.top || '', el.value, postTurn(b) ? P.red : accent()); break;
      }
      case 'phone': {
        const a = eOutExpo(prog(lt, 0, .35)); const [dx, dy] = drift(t, 9);
        mblur(() => phone(lerp(-300, X0 + 170, a) + dx, 310 + dy, .98, el.value === true ? '' : el.value, accent()), -(1 - a) * 1200); break;
      }
      case 'stamp': {
        const S = String(el.value).toUpperCase(); const z = fitSize(S, 820, 130, 900, F); const s = spring(lt, 13, 6);
        ctx.save(); ctx.translate(X0 + 30, 105); ctx.rotate(-.04); const k = lerp(1.6, 1, clamp(s)); ctx.scale(k, k); ctx.globalAlpha = clamp(lt * 8);
        const w = tw(S, z, 900, F) + 70; ctx.strokeStyle = P.red; ctx.lineWidth = 12; rr(0, -z * .7, w, z * 1.35, 14); ctx.stroke(); T(S, 35, z * .36, z, P.red, 900); ctx.restore(); break;
      }
      case 'span': {
        const S = String(el.value).toUpperCase(); const z = fitSize(S, CW, 120, 900, F);
        const a = eOutExpo(prog(lt, 0, .3)); ctx.globalAlpha = a; T(S, X0, z * .8, z, P.ink, 900); ctx.globalAlpha = 1;
        const snap = el.tSnap != null ? eInOut(prog(t, el.tSnap, el.tSnap + .25)) : 0; ruler(X0 + 4, z + 90, 900, prog(lt, .1, .7), snap); break;
      }
      case 'trend': {
        const up = String(el.value).toLowerCase() !== 'down'; const col = up ? accent() : P.red; const p = eOutExpo(prog(lt, 0, .7));
        ctx.strokeStyle = P.greyL; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X0, 20); ctx.lineTo(X0, 280); ctx.lineTo(1020, 280); ctx.stroke();
        const pts = up ? [[X0 + 20, 250], [330, 190], [540, 210], [760, 110], [990, 30]] : [[X0 + 20, 40], [330, 110], [540, 90], [760, 190], [990, 260]];
        strokePath(pts, p, 16, col);
        if (el.label) T(String(el.label).toUpperCase(), up ? X0 + 30 : 1020, 70, 56, P.greyT, 800, up ? 'left' : 'right'); break;
      }
    }
  }
  const slideIn = lt => eOutExpo(prog(lt, 0, .3));

  /* ---------- frame: field, ghost word, camera, whip pan into the TURN ---------- */
  function ghost(b) { const el = (b.els || []).find(e => ['text', 'title', 'number'].includes(e.type)); return el ? String(el.value).toUpperCase().split(' ').reduce((a, w) => w.length > a.length ? w : a, '') : ''; }
  function drawBeat(t, b) {
    field();
    const g = ghost(b); if (g) { ctx.save(); ctx.globalAlpha = .06; T(g, -40 - (t - b.start) * 18, 360, 420, P.ink, 900); ctx.restore(); }
    const s = 1 + .03 * eInOut(prog(t, b.start, b.end));
    ctx.save(); ctx.translate(W / 2, 800); ctx.scale(s, s); ctx.translate(-W / 2, -800); drawElements(t, b); ctx.restore();
  }
  function frame(t, b) {
    const prev = BEATS[b.i - 1]; const wp = prog(t, b.start, b.start + .28);
    if (b.turn && prev && wp < 1) {
      const e = eOutCubic(wp), off = (1 - e) * W, v = (1 - wp) * 60;
      ctx.save(); ctx.translate(off - W, 0); drawBeat(prev.end - .001, prev); ctx.restore();
      for (const [k, a] of [[3, .15], [2, .2], [1, .3]]) { ctx.save(); ctx.globalAlpha = a; ctx.translate(off + k * v, 0); drawBeat(t, b); ctx.restore(); }
      ctx.save(); ctx.beginPath(); ctx.rect(off, 0, W, H); ctx.clip(); ctx.translate(off, 0); drawBeat(t, b); ctx.restore();
    } else drawBeat(t, b);
  }

  /* ---------- support caption: the spoken line, small, ink, word by word, max 2 lines ---------- */
  function caption(t, b) {
    if (!b.words.length || (b.els || []).some(e => e.type === 'title')) return;
    const size = 56, lh = 70, maxW = 880; setFont(size, 500, F); const sp = ctx.measureText(' ').width;
    if (!b._pages) { b._pages = []; const lines = []; let cur = [], cw = 0;
      for (const w of b.words) { const ww = ctx.measureText(w.w).width; if (cur.length && cw + sp + ww > maxW) { lines.push(cur); cur = []; cw = 0; } cw += (cur.length ? sp : 0) + ww; cur.push(Object.assign({}, w, { ww })); }
      if (cur.length) lines.push(cur); for (let i = 0; i < lines.length; i += 2) b._pages.push(lines.slice(i, i + 2)); }
    const pages = b._pages; let pi = 0; for (let i = 0; i < pages.length; i++) if (t >= pages[i][0][0].t) pi = i;
    const next = pages[pi + 1] ? pages[pi + 1][0][0].t : b.end; const fd = 1 - prog(t, next - .08, next);
    pages[pi].forEach((ln, li) => { let x = 90; const y = 1560 - (pages[pi].length - 1 - li) * lh;
      for (const w of ln) { const p = prog(t, w.t, w.t + .12); if (p > 0) { ctx.globalAlpha = clamp(p * 3) * fd; T(w.w, x, y + 6 * (1 - p), size, P.ink, 500); ctx.globalAlpha = 1; } x += w.ww + sp; } });
  }

  LOOKS.v3 = { fonts: [`500 40px '${F}'`, `800 40px '${F}'`, `900 40px '${F}'`], region: { top: 170, bottom: 1440 }, align: 'left', entrance, measure, draw, frame, caption };
})();
window.LOOKS = LOOKS;
