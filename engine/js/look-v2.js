'use strict';
/* V2 — Bold Story: crimson field with halftone + grunge, Anton caps, highlight boxes, distressed stamps,
   marker arrows, hard cuts with punch-in + shake, white flash on big cuts, field flips to black at the TURN. */
var LOOKS = window.LOOKS || {};
(() => {
  const F = 'Anton';
  const P = { red: '#E01020', redD: '#9E0A16', ink: '#0E0E10', paper: '#F4F1EA', grey: '#8C8A86', greyD: '#3A3A3E', green: '#1DB954' };
  const CX = 540, CW = 960;
  const onRed = b => !postTurn(b);
  const boxBg = b => onRed(b) ? P.ink : P.red;

  function txt(s, x, y, size, color, align = 'center', font = F, weight = 400) { ctx.letterSpacing = '0px'; ctx.font = `${weight} ${size}px '${font}'`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y); }
  const atw = (s, size) => tw(s, size, 400, F);
  const fit = (s, maxW, max) => fitSize(s, maxW, max, 400, F);

  /* ---------- texture: halftone + speckle, baked once ---------- */
  let TEX = null;
  function tex() {
    if (TEX) return TEX; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); const r = rng(5);
    for (let y = 0; y < H; y += 18) for (let x = (y / 18) % 2 ? 9 : 0; x < W; x += 18) {
      const e = Math.max(Math.abs(x - W / 2) / (W / 2), Math.abs(y - H * .45) / (H * .55)); const f = .5 + .5 * Math.sin(x * .004 + y * .0025);
      g.fillStyle = 'rgba(0,0,0,.30)'; g.beginPath(); g.arc(x, y, 1.2 + 4.2 * Math.pow(e, 2.2) * f, 0, 7); g.fill(); }
    for (let i = 0; i < 5200; i++) { const x = r() * W, y = r() * H, s = r() * 2.2 + .4; g.fillStyle = r() < .5 ? 'rgba(0,0,0,.22)' : 'rgba(255,255,255,.07)'; g.fillRect(x, y, s, s); }
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1.2;
    for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, l = 40 + r() * 160, a = r() * Math.PI; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    return TEX = c;
  }
  function field(col) {
    ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = col === P.ink ? .8 : 1; ctx.drawImage(tex(), 0, 0); ctx.globalAlpha = 1;
    const v = ctx.createRadialGradient(W / 2, H * .45, H * .2, W / 2, H * .5, H * .8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }

  /* ---------- marker strokes ---------- */
  const SHADE = { [P.paper]: '#C9C4BA', [P.red]: '#A80C18', [P.ink]: '#000000', [P.green]: '#118A3C' };
  function markerPath(pts, p, col, w = 22, seed = 1) {
    if (p <= 0) return; const r = rng(seed); const ph = r() * 6, ph2 = r() * 6;
    const q = pts.map(([x, y], i) => [x + Math.sin(i * .21 + ph) * 2.5, y + Math.cos(i * .17 + ph2) * 2.5]);
    let total = 0; const seg = []; for (let i = 1; i < q.length; i++) { const d = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); seg.push(d); total += d; }
    const left = total * clamp(p);
    const stroke = (lw, c, dx, dy, alpha) => { ctx.globalAlpha = alpha; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      let l = left; ctx.beginPath(); ctx.moveTo(q[0][0] + dx, q[0][1] + dy);
      for (let i = 1; i < q.length && l > 0; i++) { const f = Math.min(1, l / seg[i - 1]); ctx.lineTo(lerp(q[i - 1][0], q[i][0], f) + dx, lerp(q[i - 1][1], q[i][1], f) + dy); l -= seg[i - 1]; }
      ctx.stroke(); ctx.globalAlpha = 1; };
    stroke(w, col, 0, 0, 1); stroke(w * .28, SHADE[col] || col, w * .18, w * .18, .7);
  }
  function curvePts(x0, y0, cx, cy, x1, y1, n = 40) { const a = []; for (let i = 0; i <= n; i++) { const t = i / n; a.push([(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1]); } return a; }
  function markerArrow(x0, y0, cx, cy, x1, y1, p, col, w = 26, seed = 3) {
    const pts = curvePts(x0, y0, cx, cy, x1, y1); markerPath(pts, eOutCubic(clamp(p / .8)), col, w, seed);
    const hp = prog(p, .75, 1); if (hp <= 0) return;
    const a = Math.atan2(y1 - pts[pts.length - 3][1], x1 - pts[pts.length - 3][0]); const L = w * 3.2 * eOutBack(hp);
    for (const s of [-1, 1]) { const b = a + Math.PI + s * .5; const h = []; for (let i = 0; i <= 8; i++) h.push([x1 + Math.cos(b) * L * i / 8, y1 + Math.sin(b) * L * i / 8]); markerPath(h, 1, col, w, seed + s + 5); }
  }
  function hiBox(text, x, y, size, bg, fg, o = {}) {
    const w = atw(text, size) + size * .5, h = size * 1.18; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.sc ?? 1, o.sc ?? 1);
    fillRR(-w / 2, -h / 2, w, h, 4, bg); txt(text, 0, size * .03, size, fg); ctx.restore(); return w;
  }
  function stampAt(x, y, text, rot, sc, col, size) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    const w = atw(text, size) + 80, h = size * 1.35; ctx.lineWidth = 14; ctx.strokeStyle = col; rr(-w / 2, -h / 2, w, h, 10); ctx.stroke(); txt(text, 0, 4, size, col);
    ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = .55; ctx.drawImage(tex(), 0, 0, w, h, -w / 2, -h / 2, w, h);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.restore();
  }
  function iconDisc(kind, x, y, r, b) { circ(x, y, r, P.paper); icon(kind, x, y, r / 125, { col: P.ink, lw: 12 }); }

  /* ---------- entrances ---------- */
  function entrance(el) {
    if (['icon', 'icons'].includes(el.type)) return 'pop';
    if (['bars', 'span', 'trend'].includes(el.type)) return 'grow';
    if (el.type === 'small') return 'type';
    return 'slam';
  }
  const slamK = (lt, from = 1.6) => lt <= 0 ? 0 : lerp(from, 1, eOutBack(prog(lt, 0, .22), 2.6));

  /* ---------- measure / draw ---------- */
  const textLines = s => { const S = String(s).toUpperCase(); let z = fit(S, CW, 230); if (z < 140 && S.includes(' ')) { const ls = balance(S); z = Math.min(230, ...ls.map(l => fit(l, CW, 230))); return { lines: ls, size: z }; } return { lines: [S], size: z }; };
  function measure(el) {
    switch (el.type) {
      case 'title': return 420;
      case 'number': { const z = fit(String(el.value), 860, 360); return z * 1.25 + (el.label ? 150 : 10); }
      case 'text': { const L = textLines(el.value); return L.lines.length * L.size * 1.08; }
      case 'small': return wrap(String(el.value), 900, 54, 800, 'Poppins').length * 70;
      case 'icon': case 'icons': return 240;
      case 'bars': return el.value.length * 210;
      case 'date': return 520;
      case 'phone': return 620;
      case 'stamp': return 240;
      case 'span': return 260;
      case 'trend': return 340;
    }
    return 120;
  }
  function draw(el, t, b) {
    const lt = t - el.t0; const h = el.h;
    switch (el.type) {
      case 'title': { const S = String(el.value).toUpperCase(); const z = fit(S, 860, 300); const k = slamK(lt);
        hiBox(S, CX, h / 2, z, onRed(b) ? P.paper : P.red, onRed(b) ? P.ink : P.paper, { sc: k, rot: -.03 }); break; }
      case 'number': {
        const s = String(el.value).toUpperCase(); const z = fit(s, 860, 360); const k = slamK(lt, 2);
        const cs = el.count === false ? s : countStr(s, prog(lt, 0, .65));
        ctx.save(); ctx.translate(CX, z * .62); ctx.scale(k, k); const bw = Math.max(420, atw(s, z) + 120);
        fillRR(-bw / 2, -z * .62, bw, z * 1.24, 10, boxBg(b)); txt(cs, 0, z * .03, z, P.paper); ctx.restore();
        if (el.label) { const lk = slamK(lt - .15); if (lk > 0) { ctx.save(); ctx.translate(CX, z * 1.25 + 80); ctx.scale(lk, lk); txt(String(el.label).toUpperCase(), 0, 0, fit(String(el.label).toUpperCase(), 900, 130), P.paper); ctx.restore(); } }
        break;
      }
      case 'text': {
        const L = textLines(el.value); const k = slamK(lt, 1.4);
        L.lines.forEach((ln, i) => { const y = L.size * .54 + i * L.size * 1.08;
          if (el.hl) hiBox(ln, CX, y, L.size * .9, boxBg(b), onRed(b) ? P.red : P.paper, { sc: k, rot: i % 2 ? .02 : -.02 });
          else { ctx.save(); ctx.translate(CX, y); ctx.scale(k, k); txt(ln, 0, 0, L.size, P.paper); ctx.restore(); } });
        break;
      }
      case 'small': { const a = eOutCubic(prog(lt, 0, .25)); ctx.globalAlpha = a;
        wrap(String(el.value), 900, 54, 800, 'Poppins').forEach((ln, i) => txt(ln, CX, 35 + i * 70 + (1 - a) * 20, 54, P.paper, 'center', 'Poppins', 800)); ctx.globalAlpha = 1; break; }
      case 'icon': { const s = eOutBack(prog(lt, 0, .3), 2); if (s <= 0) break; iconDisc(el.value, CX, 120, 110 * s, b);
        if (el.tStrike != null) { const p = prog(t, el.tStrike, el.tStrike + .3); markerPath([[CX - 110, 10], [CX + 110, 230]], p, onRed(b) ? P.ink : P.red, 26, 4); markerPath([[CX + 110, 10], [CX - 110, 230]], prog(t, el.tStrike + .12, el.tStrike + .4), onRed(b) ? P.ink : P.red, 26, 5); }
        break; }
      case 'icons': { const list = el.value.slice(0, 4); const gapx = Math.min(250, CW / list.length); const x0 = CX - gapx * (list.length - 1) / 2;
        list.forEach((k, i) => { const s = eOutBack(prog(lt, i * .12, i * .12 + .3), 2); if (s > 0) iconDisc(k, x0 + i * gapx, 120, 100 * s, b);
          if ((el.strike === true || el.strike === i) && el.tStrike != null) { const x = x0 + i * gapx; markerPath([[x - 100, 20], [x + 100, 220]], prog(t, el.tStrike, el.tStrike + .3), onRed(b) ? P.ink : P.red, 24, 4 + i); } });
        break; }
      case 'bars': { const rows = el.value; const max = Math.max(...rows.map(r => Number(r[1]) || 0)) || 1;
        rows.forEach(([lab, v], i) => { const t0 = i * .35; const a = eOutCubic(prog(lt - t0, 0, .25)); if (a <= 0) return; const y = i * 210;
          const vs = typeof v === 'number' ? v.toLocaleString('en-US') : String(v);
          ctx.globalAlpha = a; txt(String(lab).toUpperCase(), 60, y + 50, fit(String(lab).toUpperCase(), CW - atw(vs, 84) - 50, 84), P.paper, 'left'); txt(countStr(vs, prog(lt - t0, 0, .6)), 1020, y + 50, 84, P.paper, 'right'); ctx.globalAlpha = 1;
          fillRR(60, y + 105, Math.max(4, CW * (Number(v) / max) * eOutCubic(prog(lt - t0, 0, .5))), 70, 4, i === 0 ? P.paper : 'rgba(14,14,16,.55)'); });
        break; }
      case 'date': { const k = slamK(lt, 2); if (el.top) txt(String(el.top).toUpperCase(), CX, 60, 90, P.paper);
        const s = String(el.value).toUpperCase(); const z = fit(s, 780, 300); ctx.save(); ctx.translate(CX, 300); ctx.scale(k, k); const bw = atw(s, z) + 120;
        fillRR(-bw / 2, -z * .62, bw, z * 1.24, 10, boxBg(b)); txt(s, 0, z * .03, z, P.paper); ctx.restore(); break; }
      case 'phone': { const a = eOutCubic(prog(lt, 0, .3)); ctx.save(); ctx.translate(CX, 310 + (1 - a) * 400); ctx.rotate(-.05);
        fillRR(-160, -300, 320, 600, 48, P.paper); fillRR(-130, -260, 260, 320, 22, P.ink);
        if (el.value && el.value !== true) txt(String(el.value).toUpperCase(), 0, -100, fit(String(el.value).toUpperCase(), 220, 110), P.paper);
        for (let i = 0; i < 3; i++) fillRR(-130, 90 + i * 58, i === 2 ? 160 : 260, 30, 15, P.grey); ctx.restore(); break; }
      case 'stamp': { const S = String(el.value).toUpperCase(); const z = fit(S, 760, 150); const k = slamK(lt, 1.9); if (k <= 0) break;
        stampAt(CX, 120, S, -.08, k, onRed(b) ? P.paper : P.red, z); break; }
      case 'span': { const S = String(el.value).toUpperCase(); const z = fit(S, CW, 150); const k = slamK(lt, 1.4);
        ctx.save(); ctx.translate(CX, z * .55); ctx.scale(k, k); txt(S, 0, 0, z, P.paper); ctx.restore();
        const snap = el.tSnap != null ? eInOut(prog(t, el.tSnap, el.tSnap + .25)) : 0; const len = 860 * (1 - snap) + 40 * snap;
        markerPath([[CX - len / 2, z + 90], [CX + len / 2, z + 90]], prog(lt, .1, .5), P.paper, 26, 9); break; }
      case 'trend': { const up = String(el.value).toLowerCase() !== 'down'; const col = up ? P.green : (onRed(b) ? P.ink : P.red);
        if (up) markerArrow(CX - 300, 320, CX - 20, 260, CX + 260, 30, prog(lt, 0, .6), col, 34, 11); else markerArrow(CX - 300, 30, CX - 20, 90, CX + 260, 320, prog(lt, 0, .6), col, 34, 12);
        if (el.label) txt(String(el.label).toUpperCase(), CX, up ? 330 : 20, 70, P.paper); break; }
    }
  }

  /* ---------- frame: hard cut + punch-in + shake on slams; field flips to black at the TURN ---------- */
  function camera(t, b) {
    const lt = t - b.start; let s = 1 + .06 * Math.exp(-9 * lt), x = 0, y = 0;
    const shakeAt = (t0, amp) => { const k = t - t0; if (k > 0 && k < .35) { const e = 1 - k / .35; x += Math.sin(t * 97) * amp * e; y += Math.cos(t * 83) * amp * e; } };
    if (b.turn) shakeAt(b.start, 16);
    for (const el of (b.els || [])) if (['number', 'stamp', 'date', 'title'].includes(el.type)) shakeAt(el.t0 + .08, el.type === 'stamp' ? 14 : 10);
    if (b.i === 0) s = 1;
    return { s, x, y };
  }
  function frame(t, b) {
    field(onRed(b) ? P.red : P.ink);
    const cam = camera(t, b);
    ctx.save(); ctx.translate(W / 2 + cam.x, H * .42 + cam.y); ctx.scale(cam.s, cam.s); ctx.translate(-W / 2, -H * .42);
    drawElements(t, b); ctx.restore();
  }
  function overlay(t, b) {
    const last = BEATS[BEATS.length - 2];
    const flashes = []; if (b.turn || b === last) flashes.push(b.start);
    for (const el of (b.els || [])) if (el.type === 'stamp') flashes.push(el.t0 + .1);
    for (const f0 of flashes) { const f = 1 - prog(t, f0, f0 + .05); if (t >= f0 && f > 0) fade(P.paper, f * .7); }
  }

  /* ---------- captions: Anton caps word pop, highlight words in a box, max 2 lines, bottom y 1520 ---------- */
  function caption(t, b) {
    if (!b.words.length || (b.els || []).some(e => e.type === 'title')) return;
    const size = 84, lh = 96, maxW = 900; ctx.font = `400 ${size}px '${F}'`; const sp = ctx.measureText(' ').width;
    if (!b._pages) { b._pages = []; const chunks = []; let cur = [];
      for (const w of b.words) { cur.push(w); if (/(\.|:|\?|!|\.\.\.)$/.test(w.w)) { chunks.push(cur); cur = []; } } if (cur.length) chunks.push(cur);
      for (const chunk of chunks) { const lines = []; let cl = [], cw = 0;
        for (const w of chunk) { const s = w.w.toUpperCase(); ctx.font = `400 ${size}px '${F}'`; const ww = ctx.measureText(s).width; if (cl.length && cw + sp + ww > maxW) { lines.push({ ws: cl, w: cw }); cl = []; cw = 0; } cw += (cl.length ? sp : 0) + ww; cl.push(Object.assign({}, w, { s, ww })); }
        if (cl.length) lines.push({ ws: cl, w: cw }); for (let i = 0; i < lines.length; i += 2) b._pages.push(lines.slice(i, i + 2)); } }
    const pages = b._pages; let pi = 0; for (let i = 0; i < pages.length; i++) if (t >= pages[i][0].ws[0].t) pi = i;
    const lines = pages[pi]; const ns = pages[pi + 1] ? pages[pi + 1][0].ws[0].t : b.end; const fd = 1 - prog(t, ns - .08, ns);
    lines.forEach((ln, li) => { const y = 1520 - (lines.length - 1 - li) * lh; let x = W / 2 - ln.w / 2;
      for (const w of ln.ws) { const p = prog(t, w.t, w.t + .16);
        if (p > 0) { const sc = .5 + .5 * eOutBack(p, 2.4); ctx.save(); ctx.globalAlpha = clamp(p * 4) * fd; ctx.translate(x + w.ww / 2, y); ctx.scale(sc, sc);
          if (w.hl) { fillRR(-w.ww / 2 - 10, -size * .6, w.ww + 20, size * 1.2, 4, onRed(b) ? P.ink : P.red); txt(w.s, 0, 0, size, onRed(b) ? P.red : P.paper); }
          else { ctx.font = `400 ${size}px '${F}'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.strokeText(w.s, 0, 0); txt(w.s, 0, 0, size, P.paper); }
          ctx.restore(); }
        x += w.ww + sp; } });
  }

  LOOKS.v2 = { fonts: [`400 40px '${F}'`, "800 40px 'Poppins'"], region: { top: 170, bottom: 1330 }, align: 'center', entrance, measure, draw, frame, caption, overlay };
})();
window.LOOKS = LOOKS;
