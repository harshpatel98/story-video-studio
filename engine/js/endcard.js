'use strict';
/* Brand end card, fully data-driven from video.json "endcard" (filled from the creator's brand kit).
   Fields: name, tagline, bg, fg (logo + name), tagline_color, font, logo (polyline points on the 1080 frame),
   logo_width (stroke px), lower_pattern (one period of points for a faint repeating line, optional). */
function drawEndcard(t, b) {
  const E = Object.assign({ name: 'YOUR CHANNEL', tagline: '', bg: '#111216', fg: '#FFFFFF', tagline_color: '#FFFFFF', font: 'Poppins', logo: null, logo_width: 17, lower_pattern: null }, (window.TL && TL.endcard) || {});
  const lt = t - b.start;
  ctx.fillStyle = E.bg; ctx.fillRect(0, 0, W, H);
  const txt = (s, x, y, size, color, weight) => { ctx.letterSpacing = '0px'; ctx.font = `${weight} ${size}px '${E.font}'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y); };
  const hasLogo = Array.isArray(E.logo) && E.logo.length > 1;
  if (hasLogo) strokePath(E.logo, eInOut(prog(lt, .1, 1.3)), E.logo_width, E.fg);
  const nameY = hasLogo ? 1060 : 900;
  ctx.globalAlpha = prog(lt, hasLogo ? .9 : .1, hasLogo ? 1.4 : .6);
  const ns = Math.min(64, fitSize(E.name, 960, 64, 900, E.font));
  txt(E.name, 540, nameY, ns, E.fg, 900);
  if (E.tagline) {
    ctx.globalAlpha = prog(lt, 1.4, 2.0) * .85;
    let lines = [E.tagline];
    if (tw(E.tagline, 48, 600, E.font) > 960) { const s = E.tagline.match(/[^.!?]+[.!?]?/g).map(x => x.trim()).filter(Boolean); const h = Math.ceil(s.length / 2); lines = s.length > 1 ? [s.slice(0, h).join(' '), s.slice(h).join(' ')] : wrap(E.tagline, 960, 48, 600, E.font); }
    lines.forEach((ln, i) => txt(ln, 540, nameY + 90 + i * 66, 48, E.tagline_color, 600));
  }
  ctx.globalAlpha = 1;
  if (Array.isArray(E.lower_pattern) && E.lower_pattern.length > 1) {
    const la = .16 * prog(lt, 1.6, 2.4);
    if (la > 0) {
      ctx.save(); ctx.globalAlpha = la;
      const period = E.lower_pattern[E.lower_pattern.length - 1][0], off = -((lt * 60) % period), yb = 1460;
      const row = []; for (let k = -1; k < Math.ceil(W / period) + 2; k++) for (const [x, y] of E.lower_pattern) row.push([off + k * period + x, yb + y]);
      strokePath(row, 1, 8, E.fg); ctx.restore();
    }
  }
}
