# Building the video in code (Claude Code)

If the user wants Claude Code to render the video (rather than hand the plan to an editor):
- **Engine:** an HTML canvas (2D presets) or three.js (V5) page where **every frame is a pure function of time** — `seek(t)`, seeded random only, no CSS animations or wall-clock timers. Scenes key off **word timestamps**, never hard-coded seconds.
- **Render:** headless Chromium (Playwright) grabs frames at 60 fps (resumable), ffmpeg encodes with two-pass loudness normalisation. For WebGL, launch with GPU flags and confirm a hardware renderer before long renders.
- **Phases with gates:** environment check → prop sheet + style frames 🛑 → full draft at placeholder or real timing 🛑 → VO sync (transcript diff + synced preview) 🛑 → final mix + export 🛑.
- **QC every render:** two contact sheets, a frame strip + short clip around every scene change, trigger-word stills (+0.25 s after each key word), determinism check (same t rendered twice → identical), measured specs and loudness. Write specific findings ("caption overlaps the phone at 12.4 s"), not "looks good". A sampled check is not frame-perfect — say so.
- Pipeline file names, ffmpeg settings and the mix chain follow references/audio.md.
