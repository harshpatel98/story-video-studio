"""Encode (two-pass loudness to -14 LUFS / -1.5 dBTP) and QC sheets."""
import json, os, re, subprocess


def _run(args): return subprocess.run(args, capture_output=True, text=True)


def encode(frames_dir, fps, audio, out):
    r = _run(["ffmpeg", "-hide_banner", "-i", audio, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]).stderr
    j = json.loads(r[r.rfind("{"):r.rfind("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(fps), "-i", os.path.join(frames_dir, "f_%06d.png"), "-i", audio,
                    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high", "-af", ln,
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out], check=True)
    return measure(out)


def measure(video):
    p = _run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,width,height,avg_frame_rate", "-of", "json", video]).stdout
    info = json.loads(p)
    e = _run(["ffmpeg", "-hide_banner", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    s = e[e.rfind("Summary:"):]
    v = next((x for x in info["streams"] if x.get("width")), {})
    return {"duration_s": round(float(info["format"]["duration"]), 2), "size": f"{v.get('width')}x{v.get('height')}", "fps": v.get("avg_frame_rate"),
            "lufs": float(s.split("I:")[1].split("LUFS")[0]), "true_peak_dbfs": float(s.split("Peak:")[1].split("dBFS")[0])}


def contact_sheet(images, out, cols=6, w=216, h=384):
    """images -> one tiled PNG (for quick review without video playback)."""
    from PIL import Image
    rows = (len(images) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (w + 6), rows * (h + 6)), "white")
    for i, f in enumerate(images):
        sheet.paste(Image.open(f).convert("RGB").resize((w, h)), ((i % cols) * (w + 6), (i // cols) * (h + 6)))
    sheet.save(out)


def qc_video(video, tl, qcdir):
    os.makedirs(qcdir, exist_ok=True)
    D = tl["duration"]; half = D / 2
    for k, ss in ((1, .5), (2, half)):
        _run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{ss}", "-t", f"{half}", "-i", video, "-vf", f"fps=16/{half},scale=216:384,tile=8x2:padding=4:color=white", "-frames:v", "1", os.path.join(qcdir, f"contact_sheet_{k}.png")])
    for b in tl["beats"][1:]:
        s = max(0, b["start"] - .6)
        _run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{s:.3f}", "-t", "1.2", "-i", video, "-vf", "fps=10,scale=135:240,tile=12x1", "-frames:v", "1",
              os.path.join(qcdir, f"strip_{b['start']:06.2f}_{re.sub(r'[^A-Za-z0-9_-]', '', b['id'])}.png")])
