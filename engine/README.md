# Render engine

Turns a `video.json` into a finished 9:16 MP4 in two looks: **V3 Keynote Type** and **V2 Bold Story**. Claude writes the `video.json` for you during `/video`; you only run one command.

## One-time setup
```bash
pip install numpy scipy pillow playwright faster-whisper
python -m playwright install chromium
```
You also need **ffmpeg** on your PATH ([ffmpeg.org](https://ffmpeg.org)). Then check everything is in place:
```bash
python make_video.py check
```
`faster-whisper` is only needed if you use your own voice recording.

## Commands
| Command | What you get | Time* |
|---|---|---|
| `python make_video.py my-video preview` | One still per scene + `qc/preview_sheet.png` | a few seconds |
| `python make_video.py my-video voice` | Differences between your recording and the script | under a minute |
| `python make_video.py my-video draft` | `Title_draft.mp4` at 30 fps with sound | ~45 s |
| `python make_video.py my-video final` | `Title.mp4` at 60 fps + QC report | ~1.5 min |

\*Measured on the 41-second example below with `--workers 6` on one desktop PC; yours may differ. `--workers N` sets how many browser pages render in parallel (default 4).

If the voice check finds differences, read them. If they're just the same words heard differently, add `--accept-voice`.

## What it does for you
- **Times every word** from your recording (or a 3.1 words/s placeholder before you record).
- **Lays out each scene** automatically: numbers, words, icons, bars, calendar, phone, stamps, rulers, trend lines. Numbers are never cropped.
- **Places sound effects** on the exact frames where things appear.
- **Finds where the music's big lift is** and lines it up with your story's twist, in the pause before the next word.
- **Mixes for phones:** ducks the music under your voice, keeps the voice louder than music + effects on every word, and hits −14 LUFS.
- **Checks itself:** contact sheets, transition strips, loudness and a frame-determinism test in `qc/`.

## Example
[`../examples/kettleo/video.json`](../examples/kettleo/video.json) is a complete project (fictional company):
```bash
python make_video.py ../examples/kettleo preview
```

## Folder layout
```
engine/
├── make_video.py      # the one command
├── player.html        # loads the fonts and scripts below in headless Chromium
├── js/                # core.js (timing + layout), look-v3.js, look-v2.js, icons.js, endcard.js, util.js
├── svs/               # timeline.py, voice.py, render.py, audio.py, finish.py
└── fonts/             # Inter Tight, Poppins, Anton (SIL Open Font License, see fonts/OFL.txt)
```
To add a look, create `js/look-<id>.js` with the same interface as `look-v3.js` (`measure`, `draw`, `frame`, `caption`), add it to `player.html`, and allow it in `svs/timeline.py` `LOOKS`.
