# Rendering the video (Claude Code)

The skill ships a render engine in `engine/`. **Do not write animation code.** Write one `video.json`, then run one command. Supported looks: **V3 Keynote Type** and **V2 Bold Story** (9:16). For V1/V4/V5, say they are not in the engine yet and offer V3 or V2, or a hand-built render.

## Steps
1. Find the engine: `<skill folder>/engine/make_video.py` (usually `~/.claude/skills/story-video-studio/engine`).
2. First time only: `python <engine>/make_video.py check`. If something is missing, show the user the exact install lines it prints and ask before installing.
3. Make a project folder (e.g. `./<topic>-video/`) with `video.json`. Put the user's voice recording and music file in it if they have them.
4. `python <engine>/make_video.py <project> preview`. Read `qc/preview_sheet.png` and fix anything cramped, overlapping or empty **before** the full render. This is the Look ✔ visual.
5. With a voice file: `... voice` lists every difference between the script and the recording. Show the user each one and ask. Only if they confirm the words are fine, add `--accept-voice` to the next command. Never edit their recording.
6. `... draft` (30 fps, about 1 minute) → let the user watch it → `... final` (60 fps + QC). Report the numbers it prints. Look at `qc/contact_sheet_*.png` and `qc/strip_*.png` and describe specific problems; don't claim you watched the video.

## video.json
```json
{
  "title": "Kettleo",
  "look": "v3",                       // "v3" Keynote Type | "v2" Bold Story
  "accent": "#6B3CF6",                // V3 only, optional
  "voice": "vo.wav",                  // optional; null = placeholder pace (3.1 words/s)
  "music": "music.mp3",               // optional; licensed track
  "music_start": null,                // optional seconds; null = engine lands the music's lift on the TURN
  "endcard": { "name": "", "tagline": "", "bg": "#111216", "fg": "#FFFFFF", "tagline_color": "#FFFFFF",
               "font": "Poppins", "logo": [[x,y],...], "lower_pattern": [[x,y],...], "sound": true },
  "beats": [
    { "id": "hook", "say": "The 60 million dollar kettle... that couldn't boil water.",
      "show": [ {"number": "$60,000,000"}, {"text": "KETTLE"}, {"icon": "kettle", "at": "boil", "strike_at": "water"} ] },
    { "id": "turn", "say": "Then, one Monday morning... the servers went down.", "turn": true, "show": [ ... ] }
  ]
}
```
- The `//` notes above are explanations only; real video.json has no comments.
- `say` = the **approved script line, exactly**. One beat per script line. Never change wording here.
- Exactly one beat has `"turn": true` (the twist). If none is marked, the engine picks the first line starting with Then/But/…
- `endcard`: copy from `templates/brand-kit.md`. `logo` = polyline points on the 1080×1920 frame; omit for a text-only card.

## `show` elements (1–4 per beat, stacked top to bottom automatically)
| Element | Example | Use for |
|---|---|---|
| `number` | `{"number": "$1.75B", "label": "raised", "count": false}` | Hero numbers. Counts up unless `count: false`. Never cropped. |
| `text` | `{"text": "STUCK AT HOME.", "hl": true}` | Display words (≤ 6). `hl` = accent colour (red after the TURN). |
| `small` | `{"small": "that couldn't boil water"}` | Support line, types on. |
| `title` | `{"title": "Kettleo"}` | The name beat only. Hides the caption. |
| `icon` | `{"icon": "kettle", "strike_at": "water"}` | One line icon; `strike` / `strike_at` crosses it out. |
| `icons` | `{"icons": ["bus","train","coffee"], "strike": 2}` | Row of up to 4. `strike`: index or `true`. |
| `bars` | `{"bars": [["Kettleo", 90000], ["Rival", 1200000]]}` | True-scale comparison ("the tiny bar is the joke"). |
| `date` | `{"date": "2020", "top": "April"}` | Calendar card (best on the TURN). |
| `phone` | `{"phone": "100°"}` or `{"phone": true}` | Generic phone with a readout. |
| `stamp` | `{"stamp": "Shut down"}` | Verdict stamp. Only facts from the script; allegations stay "alleged". |
| `span` | `{"span": "SIX MONTHS", "snap_at": "shutting"}` | A ruler that draws, then snaps shut. |
| `trend` | `{"trend": "down", "label": "sales"}` | Up/down line or marker arrow. |

Common to all: `"at": "word"` = appear when that word is spoken (default: the element's own first word or number, if it's in the line). `"color": "accent" | "loss" | "ink" | "muted" | "#hex"`. Per beat: `"caption": false` hides the caption.

**Icons:** money, coins, chart-up, chart-down, phone, laptop, tv, play, car, truck, bus, train, plane, rocket, house, store, building, factory, box, cart, bag, person, people, clock, calendar, globe, bulb, wifi, server, battery, coffee, kettle, shoe, gavel, warning, lock, heart, mail, cloud, game, question. Unknown names draw a question mark, so pick the nearest.

## Rules for good beats
- The first element of each beat opens the beat. Make it a strong one (number, text, icon), not a `small` line, where possible.
- 2–3 elements per beat reads best on a phone; 4 is the maximum. Keep `text` short; long lines shrink.
- A number that returns in the kicker (hook callback) uses the same string, so it lands in the same spot (match cut). Use `count: false` the second time.
- Red is automatic from the TURN onward. Don't force `loss` before the TURN.
- Accuracy: no element may state anything the approved script doesn't.

## Output
- `PROJECT/<Title>_draft.mp4` or `<Title>.mp4`: 1080×1920, 60 fps, H.264, AAC, −14 LUFS, ≤ −1.5 dBTP.
- `PROJECT/qc/`: preview sheet, contact sheets, transition strips, `report.json` (loudness, voice-over-bed margin per word, music offset, determinism check).
- Generated files live in `PROJECT/build` (safe to delete).
