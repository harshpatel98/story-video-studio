"""Sound: synthesised SFX placed on the renderer's own events, music offset so its biggest lift lands on the
TURN, and the final mix (voice chain, sidechain ducking, levels, limiter) with a word-level voice check."""
import os, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000


# ---------------------------------------------------------------- SFX synthesis
class Synth:
    def __init__(self, dur):
        self.N = int((dur + .3) * SR); self.L = np.zeros(self.N); self.R = np.zeros(self.N); self.rs = np.random.default_rng(42)

    def place(self, sig, t, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.N: return
        if i < 0: sig = sig[-i:]; i = 0
        sig = sig[: self.N - i] * gain; l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
        self.L[i:i + len(sig)] += sig * l * 1.414; self.R[i:i + len(sig)] += sig * r * 1.414

    def write(self, path):
        x = np.stack([self.L, self.R], 1); pk = np.abs(x).max() or 1
        wavfile.write(path, SR, (x / pk * .9).astype(np.float32))


tvec = lambda d: np.arange(int(d * SR)) / SR
def env(d, a=.005, decay=8.):
    t = tvec(d); e = np.exp(-decay * t); na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na); return e
def sweep(f0, f1, d): t = tvec(d); f = f0 * (f1 / f0) ** (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR)
_rs = np.random.default_rng(7)
def noise(d): return _rs.standard_normal(int(d * SR))
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, fc): return sosfilt(butter(2, fc, btype="low", fs=SR, output="sos"), x)

def boom(d=1.2, f0=110, f1=38): return sweep(f0, f1, d) * env(d, .003, 3.2) + lp(noise(d), 300) * env(d, .002, 18) * .5
def thud(d=.35): return sweep(160, 55, d) * env(d, .002, 14) + lp(noise(d), 900) * env(d, .001, 30) * .4
def pop(f=900, d=.09): return sweep(f, f * 1.9, d) * env(d, .002, 40)
def tick(f=2400, d=.03): return np.sin(2 * np.pi * f * tvec(d)) * env(d, .001, 140)
def chime(f=1320, d=1.1): t = tvec(d); return sum(np.sin(2 * np.pi * f * k * t) / k ** 1.4 for k in (1, 2.01, 3.03)) * env(d, .003, 4.5) * .6
def whoosh(d=.45):
    n = noise(d); t = tvec(d); sh = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return (bp(n, 200, 700) * np.clip(1 - 2 * t / d, 0, 1) + bp(n, 700, 2500) * np.sin(np.pi * t / d) + bp(n, 2500, 7000) * np.clip(2 * t / d - 1, 0, 1)) * sh * .9
def swish(d=.3): return bp(noise(d), 2500, 9000) * np.sin(np.pi * np.clip(tvec(d) / d, 0, 1)) ** 2 * .5
def thock(): x = thud(.22) * .6; c = bp(noise(.05), 600, 2500) * env(.05, .001, 70) * .25; x[:len(c)] += c; return x
def type_tick(): return bp(noise(.02), 2000, 7000) * env(.02, .0005, 200) * .25
def scribble(d=.35): n = bp(noise(d), 1500, 6000); t = tvec(d); return n * (.5 + .5 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * t / d) * .6
def stab(d=.9):
    t = tvec(d); x = sum(np.sign(np.sin(2 * np.pi * f * t)) * .25 + np.sin(2 * np.pi * f * t) for f in (220, 233.1, 329.6, 349.2))
    return lp(x, 2600) * env(d, .004, 5.) * .35 + boom(d, 90, 45) * .6
def sub_hit(): return boom(.9, 70, 32) * .8
def beep(f, d): t = tvec(d); e = np.ones_like(t); fa = int(.01 * SR); e[:fa] = np.linspace(0, 1, fa); e[-fa:] = np.linspace(1, 0, fa); return np.sin(2 * np.pi * f * t) * e
def glass_down():
    out = np.zeros(int(1.2 * SR))
    for i, f in enumerate((1976, 1568, 1319, 988)):
        c = chime(f, .6) * .45; j = int(i * .13 * SR); out[j:j + len(c)] += c[: len(out) - j]
    return out


def make_sfx(tl, events, path):
    s = Synth(tl["duration"]); look = tl["look"]; last = {}
    def once(key, t, gap=.09):  # avoid stacking identical hits
        if t - last.get(key, -9) < gap: return False
        last[key] = t; return True
    first = tl["beats"][0]["start"]
    for e in events:
        k, t = e["kind"], e["t"]
        if look == "v2":
            if k == "slam" and once("slam", t): s.place(whoosh(.3), t - .12, .35); s.place(thud(), t, .55)
            elif k == "pop" and once("pop", t): s.place(pop(), t, .35)
            elif k == "grow" and once("grow", t): s.place(whoosh(.4), t, .3)
            elif k == "type" and once("type", t): s.place(swish(.25), t, .25)
            elif k == "count":
                for i in range(14): u = i / 13; s.place(tick(2600 - 20 * i, .025), t + (e["t1"] - t) * (1 - (1 - u) ** 2), .25)
            elif k == "stamp": s.place(thud(.5), t, .8); s.place(boom(.8, 80, 40), t, .35)
            elif k == "turn": s.place(stab(), t, .7)
            elif k == "strike": s.place(scribble(), t, .45)
            elif k == "kicker": s.place(boom(), t, .6)
            elif k == "hlword" and once("hl", t, .25): s.place(pop(1200, .06), t, .12)
        else:
            if k == "slam" and once("slam", t): s.place(thock(), t, .65)
            elif k in ("slide", "wipe") and once("sw", t): s.place(swish(.3 if k == "slide" else .35), t - .03, .35, -.3 if k == "slide" else .3)
            elif k == "pop" and once("pop", t): s.place(pop(800, .07), t, .25)
            elif k == "grow" and once("grow", t): s.place(swish(.4), t, .25)
            elif k == "type":
                for i in range(6): s.place(type_tick(), t + i * .05, .6)
            elif k == "count":
                for i in range(18): u = i / 17; s.place(tick(2600 - 20 * i, .025), t + (e["t1"] - t) * (1 - (1 - u) ** 2), .28)
            elif k == "stamp": s.place(thock(), t, .8); s.place(glass_down(), t + .05, .4)
            elif k == "turn": s.place(sub_hit(), t, .8); s.place(swish(.35), t, .4)
            elif k == "strike": s.place(scribble(.3), t, .35)
            elif k == "snap": s.place(thock(), t, .6); s.place(glass_down(), t + .05, .35)
    ec = next(b for b in tl["beats"] if b["id"] == "endcard")["start"]
    if (tl.get("endcard") or {}).get("sound", True):  # end card: blip as the logo draws, two chimes, warm pad
        s.place(beep(880, .09) * .35, ec + .33); s.place(chime(659.3, 2.4), ec + 1.0, .35); s.place(chime(987.8, 2.2), ec + 1.05, .25)
        pd = 2.6; tt = tvec(pd)
        pad = sum(np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.004 * tt) for f in (220, 277.2, 329.6, 440))
        s.place(lp(pad, 1500) * np.minimum(1, np.minimum(tt / .8, (pd - tt) / 1.2)) * .05, ec + .8)
    s.write(path)


# ---------------------------------------------------------------- music offset
def music_offset(music, target, must_end):
    """Music time to start at video 0 so a strong lift/downbeat lands at video `target` and enough music remains."""
    SRa = 22050
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", music, "-ac", "1", "-ar", str(SRa), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32); dur = len(x) / SRa
    if dur < must_end: return 0.0, "music is shorter than the video; starting at 0"
    hop, win = 512, 2048
    fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    spec = np.abs(np.fft.rfft(fr, axis=1)); ft = (np.arange(len(spec)) * hop + win / 2) / SRa; fps = SRa / hop
    rms_db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    low = spec[:, : int(150 / SRa * win)].sum(1)
    flux = np.r_[0, np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1)]; flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]; lags = np.arange(len(ac)) / fps
    ok = (lags > 60 / 180) & (lags < 60 / 60); period = lags[ok][np.argmax(ac[ok])]
    phases = np.linspace(0, period, 60, endpoint=False)
    score = [flux[np.clip((np.arange(ph, dur, period) * fps).astype(int), 0, len(flux) - 1)].sum() for ph in phases]
    beats = np.arange(phases[int(np.argmax(score))], dur, period); bar = 4 * period
    at = lambda a, t: a[min(len(a) - 1, max(0, int(t * fps)))]
    mean_db = lambda t0, t1: rms_db[(ft >= t0) & (ft < t1)].mean() if ((ft >= t0) & (ft < t1)).any() else -120
    best = None
    for b in beats:
        o = b - target
        if o < 0 or o + must_end > dur: continue
        sc = (mean_db(b, b + bar) - mean_db(b - bar, b)) + .6 * (at(flux, b) + .5 * np.log1p(at(low, b)))
        if best is None or sc > best[0]: best = (sc, o, b)
    if best is None: return 0.0, "no lift fits; starting at 0"
    return round(float(best[1]), 3), f"lift at music {best[2]:.2f}s lands on the TURN ({target:.2f}s video)"


# ---------------------------------------------------------------- mix
def _ff(*args):
    args = list(args)
    if args[-1].endswith(".wav"): args = args[:-1] + ["-c:a", "pcm_f32le", args[-1]]
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args], check=True)


def lufs(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = out[out.rfind("Summary:"):]
    return float(summ.split("I:")[1].split("LUFS")[0]), float(summ.split("Peak:")[1].split("dBFS")[0])


def mix(tl, build, voice=None, music=None, music_start=None):
    """Writes build/audio_final.wav; returns a dict report."""
    D = tl["duration"]; rep = {}; m = lambda f: os.path.join(build, f)
    VO_T = -20.0; SFX_UNDER = 4.0; MUS_UNDER = 7.0 if voice else 3.0
    beats = tl["beats"]; ec = beats[-1]["start"]; turn = next(b for b in beats if b.get("turn"))
    stems = []
    if voice:
        off = tl["voOffset"]
        _ff("-i", voice, "-af", f"highpass=f=80,acompressor=threshold=-24dB:ratio=3:attack=10:release=150:makeup=1,aresample=48000,"
            f"pan=stereo|c0=c0|c1=c0,adelay={int(off * 1000)}|{int(off * 1000)},apad,atrim=0:{D}", m("vo_chain.wav"))
        vi, _ = lufs(m("vo_chain.wav")); _ff("-i", m("vo_chain.wav"), "-af", f"volume={VO_T - vi:.2f}dB", m("vo.wav")); stems.append(m("vo.wav"))
        # ducking key: VO advanced 150 ms (look-ahead), muted in a short window so the music hit lands in the pause before the TURN
        w0 = turn["words"][0]["t"] if turn["words"] else turn["start"]
        prev_end = max((w["end"] for b in beats if b["i"] < turn["i"] for w in b["words"]), default=0)
        hit = max(prev_end + .05, w0 - .1); holes = [(hit - .14, w0 - .03)] if w0 - prev_end > .25 else []
        rep["turn_hit"] = round(hit, 2)
        hx = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in holes) or "0"
        _ff("-i", m("vo.wav"), "-af", f"atrim=start=0.15,asetpts=PTS-STARTPTS,apad,atrim=0:{D},volume='if({hx},0.0,1.0)':eval=frame", m("vo_key.wav"))
    else:
        hit = turn["start"]; rep["turn_hit"] = round(hit, 2)
    si, _ = lufs(m("sfx.wav")); _ff("-i", m("sfx.wav"), "-af", f"volume={VO_T - SFX_UNDER - si:.2f}dB,atrim=0:{D}", m("sfx_lvl.wav"))
    if voice:
        _ff("-i", m("sfx_lvl.wav"), "-i", m("vo_key.wav"), "-filter_complex", "[0:a][1:a]sidechaincompress=threshold=0.03:ratio=4:attack=5:release=180:makeup=1[d]", "-map", "[d]", m("sfx_mix.wav"))
    else:
        os.replace(m("sfx_lvl.wav"), m("sfx_mix.wav"))
    stems.append(m("sfx_mix.wav"))
    if music:
        if music_start is None:
            music_start, why = music_offset(music, hit, ec)
            rep["music_offset_reason"] = why
        rep["music_start"] = music_start
        fo_end = ec - .1; fo = fo_end - 1.5
        _ff("-ss", f"{music_start}", "-i", music, "-af", f"aresample=48000,atrim=0:{D},afade=t=in:st=0:d=0.4,afade=t=out:st={fo:.3f}:d=1.5,apad,atrim=0:{D}", m("music_cut.wav"))
        _ff("-i", m("music_cut.wav"), "-af", f"atrim=1:{fo:.3f}", m("_mbody.wav")); mi, _ = lufs(m("_mbody.wav"))
        _ff("-i", m("music_cut.wav"), "-af", f"volume={VO_T - MUS_UNDER - mi:.2f}dB", m("music_lvl.wav"))
        if voice:
            _ff("-i", m("music_lvl.wav"), "-i", m("vo_key.wav"), "-filter_complex", "[0:a][1:a]sidechaincompress=threshold=0.0316:ratio=6:attack=20:release=300:makeup=1[d]", "-map", "[d]", m("music_mix.wav"))
        else:
            os.replace(m("music_lvl.wav"), m("music_mix.wav"))
        stems.append(m("music_mix.wav"))
    ins = sum((["-i", s] for s in stems), [])
    _ff(*ins, "-filter_complex", "".join(f"[{i}:a]" for i in range(len(stems))) + f"amix=inputs={len(stems)}:duration=longest:normalize=0,atrim=0:{D}[m]", "-map", "[m]", "-ar", "48000", m("mix_raw.wav"))
    ri, _ = lufs(m("mix_raw.wav"))
    _ff("-i", m("mix_raw.wav"), "-af", f"volume={-14.0 - ri + .3:.2f}dB,aresample=192000,alimiter=limit={10 ** (-3.5 / 20):.4f}:attack=3:release=60:level=disabled,aresample=48000", m("audio_final.wav"))
    if voice:
        rep.update(voice_check(tl, m("vo.wav"), [s for s in stems[1:]]))
    return rep


def voice_check(tl, vo, others):
    """The voice must be louder than music + SFX on every word."""
    def load(p):
        sr, x = wavfile.read(p); x = x.astype(np.float64); return x.mean(1) if x.ndim == 2 else x
    v = load(vo); os_ = [load(p) for p in others]; n = min([len(v)] + [len(x) for x in os_])
    v = v[:n]; o = sum(x[:n] for x in os_)
    db = lambda a: 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-12)
    rows = []
    for b in tl["beats"]:
        for w in b["words"]:
            a, z = int(w["t"] * SR), int(max(w["end"], w["t"] + .06) * SR)
            if z <= n: rows.append((w["w"], w["t"], db(v[a:z]) - db(o[a:z])))
    rows.sort(key=lambda r: r[2])
    return {"voice_over_bed_min_db": round(rows[0][2], 1) if rows else None, "voice_over_bed_median_db": round(float(np.median([r[2] for r in rows])), 1) if rows else None,
            "closest_words": [f"{w!r} @{t:.2f}s {d:+.1f} dB" for w, t, d in rows[:5]]}
