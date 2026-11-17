# Story Video Studio

A Claude skill for producing short documentary-style **story videos**: the "what happened to X" format of rises, falls, scandals, turnarounds and bets that went wrong. It works for 9:16 Shorts, Reels and TikTok, and for 16:9 YouTube.

Claude takes you from a topic idea to a publish-ready production package, one reviewed step at a time:

**topic → script (with fact-check list) → storyboard → audio cue sheet & mix spec → thumbnails → titles, descriptions, hashtags → export**

The script formats, visual presets and mixing targets come from a real production run of finished story-shorts. They are written down exactly, so you can repeat them on purpose.

---

## Key features

### 🛑 Review Gates
Production stops at four mandatory gates and waits for your approval or edits:

1. **Script Review Gate**: the script, beat table and ⚠ Verify list
2. **Visual Direction Gate**: the preset, storyboard and prop list
3. **Audio Gate**: the voiceover plan, music placement and SFX cue sheet
4. **Final Package Gate**: thumbnails, platform packaging and export format

Gates are never merged or skipped, and silence is never taken as approval.

### 📋 Session State Block
Every response in a production run ends with a compact state block, so you (and Claude) never lose track in a long session:

```
[Production State]
Mode: Series (ep 2 of 5)
Topic: The 3D-printed sneaker that melted
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label
Visual Preset: V3 Keynote Type
Audio Mode: Uploaded VO + licensed track + preset SFX
Status: Step 2 — Script Review Gate pending
```

Type `/state` at any time to reprint it.

### ⚡ Batch Mode
`/batch-mode` (or "use defaults") locks the format, visual preset, audio mode and packaging style **once** for a whole series. Each episode then stops only at its **Script Review Gate** and at its final package. Type `/unlock` to go back to full gates.

### 🎨 Named presets
| Script presets | Visual presets |
|---|---|
| **S1 Irony Label**: "The $400 machine that lost to a human hand." | **V1 Mascot Story**: flat vector, navy/amber palette, a locked mascot host |
| **S2 Verdict Label**: "The truck that was a lie." | **V2 Bold Story**: crimson field, condensed caps, stamps, marker arrows |
| **S3 Then-vs-Now**: "Instacart… but in 1999." | **V3 Keynote Type**: light-mode kinetic typography, odometer numbers |
| **C Custom** | **V4 Case File**: cork board, typed cards, red string, redactions |
| | **V5 Tiny World 3D**: toy diorama in three.js, tilt-shift, scale jokes |
| | **R Reference** / **C Custom** |

All script presets share one backbone, the **Story-Short arc**: LABEL hook → title → stakes → TURN → set-piece → consequence → KICKER.

### 🔎 Accuracy built in
- Every script ships with a **⚠ Verify list**: each number, date and claim, with a suggested source order and safer wording.
- Allegations stay allegations until the record says otherwise.
- No real logos, no recreated real documents, and no altered faces of real people.

### 🔊 Real mixing targets
The skill specifies sidechain ducking settings, where the music drop should land (on the TURN, inside a voiceover pause), −14 LUFS / ≤ −1.5 dBTP after encoding, and a "voiceover beats music + SFX on every word" rule.

### 🏷️ Bring your own brand
The end card, caption overrides, thumbnail badge and voice settings come from **your** brand kit in [`templates/brand-kit.md`](templates/brand-kit.md). Nothing about another creator's brand is baked in.

---

## Installation

### Claude Code

**Personal (all projects):**
```bash
git clone https://github.com/<your-username>/story-video-studio.git ~/.claude/skills/story-video-studio
```

**One project only:**
```bash
git clone https://github.com/<your-username>/story-video-studio.git .claude/skills/story-video-studio
```

Restart Claude Code or start a new session. The skill loads automatically when you type `/discover-topics`, `/create-video` or `/batch-mode`, or when you ask to plan or script a short story video.

> Copying the folder works too. Claude only needs `SKILL.md` at `<skills-dir>/story-video-studio/SKILL.md`, with `templates/` beside it.

### Claude Web / Desktop (Projects)

1. Create a **Project** (for example, "Story Videos").
2. Open **Project Knowledge** and upload `SKILL.md` and `templates/brand-kit.md` (filled in with your brand). You can also upload `examples/sample-production.md` as a worked reference.
3. In the project's **custom instructions**, add:
   > Follow SKILL.md from Project Knowledge for every request. Commands: /discover-topics, /create-video, /batch-mode, /state, /export, /unlock, /presets.
4. Start a chat in the project and type `/discover-topics`.

> If your Claude plan supports uploading custom skills (Settings → Capabilities → Skills), you can zip the `story-video-studio` folder and upload it as a skill instead.

---

## Quick start

### 1. Find a topic
```
/discover-topics
```
Claude asks for a niche (and, if needed, the platform). It returns 5–10 ideas, each with an angle, a hook line, the TURN and a story-strength score. Pick one to lock it.

### 2. Produce one video
```
/create-video
```
or skip discovery:
```
/create-video  The airline that sold unlimited lifetime tickets
```
Claude walks you through scope → script 🛑 → visuals 🛑 → audio 🛑 → thumbnails & packaging 🛑, asking at most two questions per turn. Finish with `/export` to get the production sheet as Markdown or JSON.

### 3. Produce a series fast
```
/batch-mode
```
Answer the setup questions once (topics, ratio, length, script preset, visual preset, audio mode, thumbnail style, platforms). Claude confirms the locked settings, then produces each episode and stops only at each script for your approval.

### Other commands
| Command | What it does |
|---|---|
| `/state` | Reprints the current Production State block |
| `/presets` | Lists every script and visual preset |
| `/export` | Exports the production sheet (Markdown or JSON) |
| `/unlock` | Leaves batch mode and goes back to full gates |

---

## Customizing

- **Brand:** fill in [`templates/brand-kit.md`](templates/brand-kit.md) with your end card, captions, thumbnail badge and voice.
- **New presets:** add a row to the tables in `SKILL.md` §4.2 (script) or a block in §5.1 (visual). Keep the §5.0 universal rules.
- **Rendering in code:** §8 of `SKILL.md` describes an optional Claude Code pipeline (HTML canvas or three.js frames as a pure function of time, Playwright capture, ffmpeg encode, QC contact sheets). The core skill only needs Read, Write, Edit, Glob and Grep. Rendering requires you to install Python, Playwright and ffmpeg yourself.

## Folder structure

```
story-video-studio/
├── SKILL.md                     # the skill (frontmatter + full workflow and presets)
├── README.md                    # this file
├── LICENSE                      # MIT
├── templates/
│   └── brand-kit.md             # fill-in-your-brand end card, captions, thumbnails, voice
└── examples/
    └── sample-production.md     # one complete worked production, discovery to export
```

## A note on facts

Story videos are about real companies and real people. The skill flags every claim for verification but cannot check sources for you. You are responsible for confirming the ⚠ Verify list before you record or publish.

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, and make it yours.
