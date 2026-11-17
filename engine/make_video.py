"""Story Video Studio render engine - one command from video.json to a finished MP4.

  python make_video.py check                 is everything installed?
  python make_video.py PROJECT preview       key stills + a contact sheet (about 30 s)
  python make_video.py PROJECT voice         compare the voice recording with the script (no render)
  python make_video.py PROJECT draft         quick 30 fps MP4 with sound
  python make_video.py PROJECT final         full 60 fps MP4 + QC report

Options: --accept-voice (the listed voice differences are fine; time captions from the recording)
         --workers N (parallel browser pages, default 4)

PROJECT is a folder with video.json (and optionally the voice recording and music named in it).
Everything generated goes to PROJECT/build and PROJECT/qc; the video is written to PROJECT.
"""
import hashlib, json, os, re, shutil, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)


def say(*a): print(*a, flush=True)


def check():
    ok = True
    def row(name, good, fix):
        nonlocal ok; ok &= good; say(f"  {'OK ' if good else 'MISSING'}  {name}" + ("" if good else f"   ->  {fix}"))
    say("Checking what the render engine needs:")
    row("Python 3.9+", sys.version_info >= (3, 9), "install Python from python.org")
    for mod, pkg in (("numpy", "numpy"), ("scipy", "scipy"), ("PIL", "pillow"), ("playwright", "playwright")):
        try: __import__(mod); g = True
        except ImportError: g = False
        row(pkg, g, f"pip install {pkg}")
    try:
        __import__("faster_whisper"); fw = True
    except ImportError: fw = False
    say(f"  {'OK ' if fw else 'optional'}  faster-whisper (only needed with your own voice recording)" + ("" if fw else "   ->  pip install faster-whisper"))
    row("ffmpeg", shutil.which("ffmpeg") is not None and shutil.which("ffprobe") is not None, "install ffmpeg (ffmpeg.org) and add it to PATH")
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p: p.chromium.launch().close(); br = True
    except Exception: br = False
    row("headless Chromium", br, "python -m playwright install chromium")
    say("All set." if ok else "Install the missing items above, then run this check again.")
    return ok


def project_hash(tl):
    return hashlib.sha1((json.dumps(tl, sort_keys=True) + "".join(open(os.path.join(HERE, "js", f), encoding="utf-8").read() for f in sorted(os.listdir(os.path.join(HERE, "js"))))).encode()).hexdigest()[:10]


def main(argv):
    if not argv or argv[0] in ("-h", "--help"): say(__doc__); return 0
    if argv[0] == "check": return 0 if check() else 1
    if len(argv) < 2: say(__doc__); return 2
    from svs import timeline, voice, render, audio, finish
    proj, mode = os.path.abspath(argv[0]), argv[1]
    accept = "--accept-voice" in argv
    workers = int(argv[argv.index("--workers") + 1]) if "--workers" in argv else 4
    build, qc = os.path.join(proj, "build"), os.path.join(proj, "qc")
    os.makedirs(build, exist_ok=True)
    try:
        cfg = timeline.load(proj)
    except timeline.ProjectError as e:
        say("Problem with the project:", e); return 2
    name = re.sub(r"[^A-Za-z0-9]+", "_", cfg.get("title") or os.path.basename(proj)).strip("_") or "video"

    # 1) timing: the voice recording if there is one, otherwise the placeholder pace
    timing = None
    if cfg.get("voice"):
        say("Listening to the voice recording...")
        vo = voice.transcribe(cfg["voice"], os.path.join(build, "voice_words.json"))
        raw = [tok for _, tok in timeline.tokens(cfg)]
        diffs, timing = voice.compare(raw, vo)
        ls = voice.lead_silence(vo)
        if ls is not None and ls < .05: say(f"  Note: the first word starts {ls * 1000:.0f} ms into the file - the start may be clipped.")
        if diffs:
            say(f"  {len(diffs)} difference(s) between the script and the recording:")
            for d in diffs: say(f"   - {d['kind']:9s} script: {d['script']!r:32s} voice: {d['voice']!r}" + (f"  at {d['at']:.2f}s" if d['at'] is not None else ""))
            json.dump(diffs, open(os.path.join(build, "voice_diffs.json"), "w"), indent=1)
            if not accept:
                say("Stopping here. If these are fine (same words, just heard differently), run again with --accept-voice."); return 3
        else:
            say("  The recording matches the script.")
        if mode == "voice": return 0
    elif mode == "voice":
        say("video.json has no 'voice' file."); return 2
    tl = timeline.build(cfg, timing)
    json.dump(tl, open(os.path.join(build, "timeline.json"), "w"), indent=1)
    say(f"Timeline: {len(tl['beats']) - 1} beats, {tl['duration']:.1f} s ({'placeholder pace' if tl['placeholder'] else 'timed from the recording'}), look {tl['look'].upper()}")

    # 2) preview: stills at the moment each beat is fully built, plus the end card
    if mode == "preview":
        times = []
        for b in tl["beats"][:-1]:
            last = max([w["t"] for w in b["words"]] or [b["start"]])
            times.append(round(min(b["end"] - .05, last + .5), 2))
        times.append(round(tl["beats"][-1]["start"] + 2.6, 2))
        files, events, same, _ = render.stills(tl, times, os.path.join(qc, "preview"))
        finish.contact_sheet(files, os.path.join(qc, "preview_sheet.png"))
        json.dump(events, open(os.path.join(build, "events.json"), "w"), indent=1)
        say(f"Preview: {len(files)} stills in qc/preview, overview in qc/preview_sheet.png (deterministic: {'yes' if same else 'NO'})")
        return 0

    if mode not in ("draft", "final"): say(f"Unknown mode '{mode}'."); return 2
    fps = 30 if mode == "draft" else 60
    h = project_hash(tl)
    fdir = os.path.join(build, f"frames_{fps}_{h}")
    for d in os.listdir(build):  # frames from an older version of the timeline are stale
        if d.startswith(f"frames_{fps}_") and d != os.path.basename(fdir): shutil.rmtree(os.path.join(build, d))
    t0 = time.time()
    say(f"Rendering {int(tl['duration'] * fps)} frames at {fps} fps...")
    _, events, same, _ = render.stills(tl, [tl["duration"] / 2], os.path.join(build, "probe"))
    render.frames(tl, fps, workers, fdir, say)
    say(f"  frames done in {time.time() - t0:.0f}s")
    say("Making the sound...")
    audio.make_sfx(tl, events, os.path.join(build, "sfx.wav"))
    rep = audio.mix(tl, build, cfg.get("voice"), cfg.get("music"), cfg.get("music_start"))
    out = os.path.join(proj, f"{name}{'_draft' if mode == 'draft' else ''}.mp4")
    say("Encoding...")
    spec = finish.encode(fdir, fps, os.path.join(build, "audio_final.wav"), out)
    report = {"video": os.path.basename(out), "mode": mode, "spec": spec, "mix": rep, "deterministic_frame_check": same,
              "timing": "placeholder pace" if tl["placeholder"] else "from the voice recording"}
    if mode == "final":
        say("QC sheets..."); finish.qc_video(out, tl, qc)
    json.dump(report, open(os.path.join(qc if mode == "final" else build, "report.json"), "w"), indent=1)
    say(f"Done: {out}")
    say(f"  {spec['duration_s']} s, {spec['size']}, {spec['lufs']:.1f} LUFS, true peak {spec['true_peak_dbfs']:.1f} dBFS")
    if rep.get("voice_over_bed_min_db") is not None:
        say(f"  voice over music+SFX on every word: min {rep['voice_over_bed_min_db']:+.1f} dB (closest: {', '.join(rep['closest_words'][:3])})")
    if rep.get("music_offset_reason"): say(f"  music: start at {rep['music_start']}s - {rep['music_offset_reason']}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
