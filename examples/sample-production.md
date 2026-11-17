# Sample production: "Kettleo"

> **This is a worked example built around a fictional company.** "Kettleo", its numbers and its events are invented to show the workflow without publishing unverified claims about a real business. In a real run, every number below would sit on the ⚠ Verify list until you confirm it.

This transcript is condensed. Each `USER:` / `CLAUDE:` pair is one turn. Notice the pattern on every turn: at most two questions, a recommended default, gates that wait, and the `[Production State]` block at the end.

---

## Turn 1: Topic discovery

**USER:** `/discover-topics`

**CLAUDE:**
Two quick ones:
1. **Niche?** (1) failed consumer gadgets ★ recommended, (2) startup scandals, (3) "too early" ideas, (4) your own
2. **Main platform?** (1) YouTube Shorts ★, (2) TikTok, (3) Instagram Reels, (4) all three

```
[Production State]
Mode: —
Topic: —
Format/Ratio: —
Length: —
Script Style: —
Visual Preset: —
Audio Mode: —
Status: Discovery — waiting for niche + platform
```

---

## Turn 2: Ideas

**USER:** 1, and all three.

**CLAUDE:**

| # | Working title | Angle | Hook candidate | TURN | Strength |
|---|---|---|---|---|---|
| 1 | **Kettleo** | A kettle that needed Wi-Fi to boil | "The 60 million dollar kettle that couldn't boil water." | A server outage bricks every kettle | ★★★★★ |
| 2 | Sole Theory | 3D-printed sneakers that softened in summer heat | "The sneaker that melted in July." | A heatwave and a viral video | ★★★★☆ |
| 3 | Pawcast | A pet-camera subscription that kept billing after shutdown | "The pet camera you paid for... after it died." | Billing outlives the product | ★★★☆☆ |
| 4 | Glide Bags | A self-following suitcase banned by airlines | "The suitcase airlines wouldn't let fly." | Battery ban | ★★★★☆ |
| 5 | Crumbly | A cookie-delivery drone startup | "The drone that delivered 11 cookies." | The pilot program ends | ★★★☆☆ |

Kettleo scores highest: a clear number, a built-in irony, a strong visual set-piece (people waiting by dead kettles) and a ready-made kicker.

**Lock one** (number), **expand** one, or **generate more**?

```
[Production State]
Mode: —
Topic: —
Format/Ratio: —
Length: —
Script Style: —
Visual Preset: —
Audio Mode: —
Status: Discovery — 5 ideas shown, waiting for a pick
```

---

## Turn 3: Lock the topic, Step 1 (scope)

**USER:** Lock 1. `/create-video`

**CLAUDE:**
Topic locked: **Kettleo**.
1. **Single video or a series?** (1) single ★, (2) series of ___
2. **Length & ratio?** (1) 9:16, ~37 s total (VO ~32 s) ★, (2) 9:16 ~60 s, (3) 16:9 long-form 60–180 s

```
[Production State]
Mode: —
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: —
Length: —
Script Style: —
Visual Preset: —
Audio Mode: —
Status: Step 1 — Scope & specs
```

---

## Turn 4: Step 2 (script preset)

**USER:** Single, option 1.

**CLAUDE:**
Specs locked: 9:16 at 1080×1920 / 60 fps, ~37 s (0.25 s lead-in + ~32 s VO + 1 s kicker hold + 3.4 s end card).

**Script preset?**
1. **S1 Irony Label** ★: "The [number] [thing] that [ironic outcome]." Dry; the numbers do the joke.
2. **S2 Verdict Label**: "The [thing] that [was a lie]." Prosecutorial; strict allegation rules.
3. **S3 Then-vs-Now**: "[Modern thing]... but in [year]."
4. **Custom**: describe a tone or paste a reference script.

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: —
Visual Preset: —
Audio Mode: —
Status: Step 2 — choosing script preset
```

---

## Turn 5: Script draft 🛑

**USER:** 1

**CLAUDE:**

### Script: S1 Irony Label

| # | Beat | Line | Est. s |
|---|---|---|---|
| 1 | LABEL hook | The 60 million dollar kettle... that couldn't boil water. | 3.2 |
| 2 | Title | Kettleo. | 0.9 |
| 3 | Stakes | In 2019, it raised 60 million dollars... for a kettle with an app. | 4.3 |
| 4 | Stakes | Set the exact temperature from your phone. Investors called it the smart kitchen's first hit. | 5.2 |
| 5 | **TURN** | Then, one Monday morning... the servers went down. | 3.0 |
| 6 | Set-piece | Ninety thousand kettles... needed the internet to switch on. | 3.3 |
| 7 | Set-piece | No server. No kettle. | 1.6 |
| 8 | Set-piece | People stood in their kitchens... waiting for an update. | 3.0 |
| 9 | Consequence | It took four days to fix. Sales never came back. In 2022, Kettleo shut down. | 4.6 |
| 10 | **KICKER** | 60 million dollars... to beat a button your stove already had. | 3.4 |

**98 words → ~32.5 s at 3.1 words/s** (inside the 32 ± 1.5 s window).

## ⚠ Verify before recording
Source order: primary (filings, company statements) → reputable press → analysts → secondary.
- **"60 million dollars", "in 2019"**: total raised, or one round? If it was cumulative, say "raised 60 million dollars in total".
- **"Ninety thousand kettles"**: units sold vs. units active at the outage. Safer: "Tens of thousands of kettles".
- **"needed the internet to switch on"**: confirm there was no manual fallback on any model. If some had one: "most kettles needed…".
- **"one Monday morning"**, **"four days"**: confirm the outage date and duration from the company's status posts.
- **"Sales never came back"**: a judgement. Safer: "Sales fell and never recovered", backed by a cited source.
- **"In 2022, Kettleo shut down"**: wind-down announcement date vs. the date the servers went offline.
- **Kicker**: an opinion framed as irony. Fine as written; no factual claim.

🛑 **Script Review Gate:** approve, tweak specific lines, or regenerate?

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label
Visual Preset: —
Audio Mode: —
Status: Step 2 — 🛑 Script Review Gate pending
```

---

## Turn 6: Tweak, then approve

**USER:** Line 6: use "Tens of thousands of kettles". Otherwise approve.

**CLAUDE:**
Line 6 is now "Tens of thousands of kettles... needed the internet to switch on." (98 words, ~32.5 s). **Script approved.** The Verify list stays open until you close it.

**Visual preset?**
1. **V1 Mascot Story**: flat vector, navy/amber, mascot host reacts on trigger words
2. **V2 Bold Story**: crimson field, condensed caps, stamps
3. **V3 Keynote Type** ★: light-mode kinetic type and odometer numbers; a clean product look suits a gadget story
4. **V4 Case File** / 5. **V5 Tiny World 3D** / 6. **Reference** / 7. **Custom**

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label ✅
Visual Preset: —
Audio Mode: —
Status: Step 3 — choosing visual preset
```

---

## Turn 7: Storyboard 🛑

**USER:** 3

**CLAUDE:**

**V3 Keynote Type:**
- Palette: paper `#F6F4EF`, ink `#111216`, grey `#5C6169`, accent violet `#6B3CF6`, red `#E5484D` only from the TURN.
- Type: Inter Tight 500/800/900 with tabular figures, at most 2 sizes per frame.
- Layout: left-aligned stacks, never a centred card.

### Prop sheet (approve before any build)
| Prop | Must read at phone size as |
|---|---|
| Kettle | Rounded line-icon kettle with a small Wi-Fi arc above the lid; single stroke weight |
| Phone | Generic rounded outline; abstract UI blocks + a big "100°" readout |
| Wi-Fi arc | Three arcs; "dead" state = arcs grey with a red slash drawn in the icon's own transform |
| Status pill | Pill reading "SERVER: DOWN"; red dot pulses |
| Calendar card | "MON" tear-off card for the TURN |
| Day counter | Odometer "DAY 1 → DAY 4" |
| Stove knob | Plain circle knob with a tick mark; it is the kicker's "button" |

### Storyboard
| t (s) | Beat | Focal item | Motion / entrance | Camera | On-screen text | Transition | Trigger word |
|---|---|---|---|---|---|---|---|
| 0.25 | Hook | "$60,000,000" odometer | Digits roll up, motion blur, land with shadow | Slow push | **$60,000,000** / KETTLE | — | "60 million" |
| 2.10 | Hook | Kettle icon | Slam in under the number; steam line fails to rise | Hold | "couldn't boil water" (support caption) | — | "boil" |
| 3.45 | Title | "KETTLEO" | Giant word, cropped by the right edge | Dolly into the "O" | KETTLEO | Letter dolly | "Kettleo" |
| 4.40 | Stakes | "2019" + bar | Type-on year; violet funding bar grows to full width | Slide left | 2019 / $60M | Mask wipe | "2019" |
| 6.70 | Stakes | Phone | Slides up; "100°" readout ticks 40→100 | Push | — | — | "phone" |
| 9.20 | Stakes | Quote block | Words stack left-aligned | Hold, 2 px drift | "the smart kitchen's first hit" | Scale-through | "first hit" |
| 13.80 | **TURN** | Calendar "MON" | Tear-off; whip pan; palette flips to red accents | **Whip pan** | MONDAY | Whip | "Monday" |
| 15.30 | TURN | Status pill | Pops in; red dot pulses | Punch-in | SERVER: DOWN | — | "down" |
| 16.90 | Set-piece | Kettle grid | 30 small kettle icons fill the frame; their Wi-Fi arcs go grey row by row | Pull back | TENS OF THOUSANDS | — | "thousands" |
| 20.10 | Set-piece | One kettle | Grid collapses to one; red slash over its Wi-Fi arc | Push in | NO SERVER. / NO KETTLE. | Match cut | "No kettle" |
| 22.00 | Set-piece | Progress bar | "Checking for update…" bar crawls to 3% and stalls | Hold, drift | waiting for an update | — | "update" |
| 25.00 | Consequence | Day counter | Odometer DAY 1 → DAY 4 | Slide | 4 DAYS | Type-on | "four days" |
| 27.10 | Consequence | Sales bar | True-scale bars: launch vs. after; the tiny bar is the joke | Hold | — | — | "never came back" |
| 28.90 | Consequence | "2022" | Type-on; the ruler draws and snaps shut | Push | SHUT DOWN | Snap | "shut down" |
| 30.30 | **KICKER** | "$60,000,000" vs. stove knob | Number returns top-left; plain knob clicks on bottom-right | Slow push | $60,000,000 / vs. 1 button | — | "button" |
| 33.60 | Hold | Kicker frame | Everything drifts 2 px | — | — | Cut | — |
| 34.60 | End card | Your brand kit | Per `templates/brand-kit.md` | — | — | — | — |

Clear zones: the $60,000,000 odometer and the 4 DAYS counter get a paper plate that nothing crosses. Captions stay within x 90–990 and nothing goes below y 1580.

🛑 **Visual Direction Gate:** approve the preset, storyboard and prop sheet, or note changes?

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type
Audio Mode: —
Status: Step 3 — 🛑 Visual Direction Gate pending
```

---

## Turn 8: Approve, Step 4 (audio)

**USER:** Approve.

**CLAUDE:**
1. **Voiceover?** (1) I'll record and upload it ★, (2) AI voice (I'll spec the settings), (3) text-driven, no VO
2. **Music?** (1) light pizzicato / playful-documentary, 100–115 BPM, with a clear drop to hit the TURN ★, (2) dark minimal pulse, (3) you pick a track

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type ✅
Audio Mode: —
Status: Step 4 — Audio choices
```

---

## Turn 9: Cue sheet 🛑

**USER:** 1 and 1.

**CLAUDE:**

**VO plan:** record from the approved script; pauses at each `...` (0.4–0.5 s). Leave at least 0.2 s of silence before the first word. When the file arrives, I'll run the transcript check and list any differences before captioning.

**Music plan:** one licensed playful-pizzicato track. Choose the start offset so its biggest drop lands at **13.8 s, inside the pause in "Then, one Monday morning... the servers went down"**, with a 0.2 s un-duck window. Fade out over 1.5 s, ending by 33.8 s.

### Audio cue sheet
| t (s) | Cue | Type | Synced to | Level note |
|---|---|---|---|---|
| 0.25 | Tick per odometer digit | SFX | Hook count-up | −4 dB under VO |
| 2.10 | Soft "thock" | SFX | Kettle slam | full |
| 3.45 | Airy swish | SFX | Letter dolly | −3 dB |
| 6.70 | Type-on ticks | SFX | "100°" readout | −6 dB |
| 13.80 | **Music drop** + muted sub hit | Music/SFX | TURN whip, VO pause | un-ducked 0.2 s |
| 13.80 | Airy swish (directional) | SFX | Whip pan | −3 dB |
| 15.30 | Soft error blip | SFX | SERVER: DOWN pill | −4 dB |
| 16.90 | Descending glassy blips, one per row | SFX | Wi-Fi arcs going grey | −6 dB, light duck on words |
| 20.10 | Thock | SFX | "No kettle" slam | full |
| 25.00 | Ticks | SFX | Day odometer | −4 dB |
| 28.90 | Glassy descending blip | SFX | Shutdown snap | −3 dB |
| 30.30 | Single knob click | SFX | Stove knob | full (the joke) |
| 32.30–33.80 | Music fade out | Music | Before the end card | 1.5 s fade |
| 34.60 | Brand sonic logo | SFX | End card | per brand kit |

### Mix spec
- **VO chain:** HPF 80 Hz, comp 3:1, no pitch or timing edits.
- **Music:** 8 dB under the VO before ducking. Sidechain from the VO at −30 dB, 6:1, attack 20 ms, release 300 ms, 150 ms look-ahead key.
- **SFX:** 3–4 dB under the VO.
- **Rule:** the VO is louder than music + SFX on every word (to be measured).
- **Targets:** −14 LUFS, ≤ −1.5 dBTP after AAC encoding.
- **Export:** H.264 CRF 17, yuv420p, AAC 48 kHz 192 kbps, faststart.

🛑 **Audio Gate:** approve the VO plan, music placement and cue sheet?

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO ~32 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type ✅
Audio Mode: Uploaded VO + playful pizzicato (drop on TURN) + V3 SFX
Status: Step 4 — 🛑 Audio Gate pending
```

---

## Turn 10: Approve, Step 5 (thumbnails & packaging)

**USER:** Approve. VO uploaded.

**CLAUDE:**
**Transcript check:** 98/98 words match the approved script after normalisation ("60 million dollars" ↔ "$60 million"). No differences, so captions follow the VO as spoken. The VO is 32.2 s; the first word starts at 0.31 s, so it is not clipped.

1. **Thumbnail style?** (1) High-CTR ★, (2) Clean / Minimalist, (3) Match Video Theme, (4) Custom
2. **Platforms confirmed:** YouTube Shorts, TikTok and Reels. Add YouTube long-form? (1) no ★, (2) yes

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO 32.2 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type ✅
Audio Mode: Uploaded VO + playful pizzicato (drop on TURN) + V3 SFX ✅
Status: Step 5 — Thumbnails & packaging
```

---

## Turn 11: Final package 🛑

**USER:** 1, 1.

**CLAUDE:**

### Thumbnail concepts (1080×1920, built from the video's own props)
| # | Hook text (≤ 5 words) | Payoff stamp | Composition |
|---|---|---|---|
| A ★ | **$60M KETTLE** | CAN'T BOIL WATER | Giant tabular "$60M" in red cropped at the left edge; kettle icon with a red-slashed Wi-Fi arc; violet marker arrow from the number down to the kettle |
| B | **NEEDED WI-FI** | TO BOIL | Single kettle, huge; "SERVER: DOWN" pill above it; paper background with lots of negative space |
| C | **$60M vs 1 BUTTON** | — | Split frame: the odometer top, the stove knob bottom; the knob is the brightest object |

Checks: all text comes from the approved script, everything sits above the bottom UI zone, and it is legible at a ~110×200 px feed preview. No logos.

### Platform packaging
**YouTube Shorts**
- **Title:** The $60M Kettle That Couldn't Boil Water
- **Description:** A kettle that needed the internet to switch on, until the servers went down. Sources: [your verified sources].
- **Hashtags:** #shorts #startupfail #techfail #smarthome
- **Pinned comment:** Would you buy a kettle that needs Wi-Fi? 👇 Sources in the description.

**TikTok**
- **Caption:** It raised $60M… and needed Wi-Fi to boil water. Would you buy one? #techfail #startupstory #gadgets #storytime
- **Pinned comment:** Sources: [your verified sources]. What's the dumbest "smart" product you've owned?

**Instagram Reels**
- **Caption:**
  > The $60 million kettle that couldn't boil water. ☕
  > It ran on an app. Then the servers went down.
  > Four days later, nobody trusted it again.
  > Would you buy a Wi-Fi kettle?
  > #startupfail #techfail #smarthome #gadgets #storytime #business
- **Sources line:** in the first comment.

### Open items
- ⚠ Verify list: 6 claims still open (yours to close).
- End card: uses your `templates/brand-kit.md` (not filled in yet).

🛑 **Final Package Gate:** any final changes? Then choose an export: (1) Markdown ★, (2) JSON.

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO 32.2 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type ✅
Audio Mode: Uploaded VO + playful pizzicato (drop on TURN) + V3 SFX ✅
Status: Step 5 — 🛑 Final Package Gate pending
```

---

## Turn 12: Export

**USER:** Thumbnail A. `/export` JSON.

**CLAUDE:** (excerpt; the full export contains every beat, storyboard row and cue)

```json
{
  "topic": "Kettleo — the Wi-Fi kettle",
  "mode": "single",
  "episode": 1,
  "specs": {"ratio": "9:16", "resolution": "1080x1920", "fps": 60, "target_seconds": 37, "vo_seconds": 32.2},
  "script": {
    "preset": "S1",
    "beats": [
      {"id": "hook", "line": "The 60 million dollar kettle... that couldn't boil water.", "est_s": 3.2},
      {"id": "turn", "line": "Then, one Monday morning... the servers went down.", "est_s": 3.0},
      {"id": "kicker", "line": "60 million dollars... to beat a button your stove already had.", "est_s": 3.4}
    ],
    "verify": [
      {"claim": "60 million dollars, in 2019", "check": "total raised vs. one round", "safer_wording": "raised 60 million dollars in total"}
    ]
  },
  "visual": {
    "preset": "V3",
    "storyboard": [
      {"t": 13.8, "beat": "TURN", "focal": "Calendar MON", "motion": "tear-off", "camera": "whip pan", "text": "MONDAY", "transition": "whip", "trigger_word": "Monday"}
    ],
    "props": ["kettle", "phone", "wifi arc", "status pill", "calendar card", "day counter", "stove knob"]
  },
  "audio": {
    "vo_mode": "uploaded",
    "vo_settings": {"pause": "0.4-0.5 s at ..."},
    "music": {"mood": "playful pizzicato 100-115 BPM", "drop_on": "TURN"},
    "cues": [{"t": 13.8, "cue": "music drop + muted sub hit", "type": "music", "synced_to": "TURN whip, VO pause"}],
    "mix": {"lufs": -14, "true_peak_dbtp": -1.5}
  },
  "thumbnail": {"style": "high-ctr", "concepts": [{"hook_text": "$60M KETTLE", "payoff": "CAN'T BOIL WATER", "props": ["kettle", "wifi arc"]}]},
  "packaging": [
    {"platform": "youtube_shorts", "title": "The $60M Kettle That Couldn't Boil Water", "description": "A kettle that needed the internet to switch on, until the servers went down. Sources: …", "hashtags": ["#shorts", "#startupfail", "#techfail", "#smarthome"], "pinned_comment": "Would you buy a kettle that needs Wi-Fi? 👇"}
  ],
  "open_items": ["Close the ⚠ Verify list (6 claims)", "Fill in templates/brand-kit.md"]
}
```

```
[Production State]
Mode: Single
Topic: Kettleo — the Wi-Fi kettle
Format/Ratio: 9:16 Vertical
Length: ~37 s total (VO 32.2 s)
Script Style: S1 Irony Label ✅
Visual Preset: V3 Keynote Type ✅
Audio Mode: Uploaded VO + playful pizzicato (drop on TURN) + V3 SFX ✅
Status: ✅ Package exported — open items: Verify list, brand kit
```

---

## What batch mode would change

With `/batch-mode` and a 5-topic list, Turns 6–11 collapse. The ratio, V3, the audio mode, the High-CTR thumbnail style and the platforms are locked once. Each episode then shows its script at the 🛑 Script Review Gate, and after approval Claude produces that episode's storyboard, cue sheet, thumbnails and packaging in one response for a final check, then moves to the next episode.
