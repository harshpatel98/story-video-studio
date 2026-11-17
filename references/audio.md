# Sound

## Voiceover
- One consistent voice across a series (same voice, same settings).
- Uploaded VO: check duration against the target; flag if the start sounds clipped (e.g. under ~50 ms of lead silence before the first word) or if a line is missing.
- AI voice: provide the exact script text with `...` pauses, plus voice type, tone (e.g. calm documentary, punchy), energy (1–5) and pace (default 3.1 words/s; `...` = 0.4–0.5 s pause).

## Music & mix spec (defaults)
- **One licensed track** per video, cut to length. Pick the start offset so the track's biggest drop/lift lands **on the TURN, inside a real pause in the VO** (measure the VO, don't trust transcript word ends — they can be ~0.1–0.15 s early). Use a short (~0.1–0.3 s) un-duck window so the hit plays at full level, ending before the next word.
- Fade the music out (~1.5 s) so it is gone before the end card.
- **Ducking:** sidechain-compress the music only, keyed by the VO — threshold −30 dB, ratio 6:1, attack 20 ms, release 300 ms, with a ~150 ms look-ahead key so lines that start after a pause aren't masked.
- **VO chain:** high-pass 80 Hz, gentle compression 3:1; de-ess only if sibilants measure louder than vowels. No pitch or timing edits.
- **Levels before ducking:** music 7–10 dB under the VO (denser tracks need more), SFX 3–4 dB under the VO plus a light SFX duck when a hit lands on a word.
- **Rule:** the VO must be louder than music + SFX on **every word** (measure it). Lower or move the offending SFX rather than the VO.
- **Targets:** −14 LUFS integrated, ≤ −1.5 dBTP **after** AAC encoding (leave ~1.5 dB headroom for encoder overshoot; a −3.5 dBFS oversampled limiter before a linear loudness pass works).
- **Export:** 9:16 1080×1920 or 16:9 1920×1080, 60 fps, H.264 CRF 16–18, yuv420p, AAC 48 kHz ~192 kbps, faststart.

## Audio cue sheet format
```
| t (s) | Cue | Type (SFX/music/VO) | Synced to (picture event / word) | Level note |
| 0.05 | sub-bass swell | SFX | hook slam | full |
| 15.60 | music drop | music | TURN cut, VO pause 15.57–15.77 | un-ducked 0.1 s |
```

## Uploaded-VO transcript check
Transcribe with word timestamps, normalise both texts (case, punctuation, "$400" ↔ "four hundred dollars", "%" ↔ "percent", split numbers like "11 ,260"), and list every real difference. Ask the user about each one; then caption the VO as spoken and time every caption word from the VO.

## SFX palettes per visual preset
- **V1 Mascot Story:** whoosh on entrances, boom on the hook, pop on highlighted caption words, stab on the TURN, slashes for an X, thud + chime on a verdict stamp, flatline tone, boom on the kicker.
- **V2 Bold Story:** sub-bass on the hook, whoosh on entrances, ticks on count-ups, stab on the TURN, stamp hits, gavel knock, boom on the kicker, soft pops on caption words.
- **V3 Keynote Type:** tick per odometer digit, soft "thock" on slams, airy swish on slides/whips, muted sub hit on the TURN, glassy descending blip for a shutdown, type-on ticks.
- **V4 Case File:** lamp click (+ one flicker on the TURN), paper rustle, thinned typewriter keys, pin push, string pluck, stamp thunk, camera shutter per polaroid, tally clicks, folder slap, tape peel for redactions.
- **V5 Tiny World 3D:** wooden clack per tile pop, tiny van beeps, engine hum, conveyor hum inside buildings, coin clinks, crumbling rumble + crumble bursts for the collapse.
- **Shared end card:** single heartbeat-style blip as the logo draws, two soft chimes, a warm pad (or the creator's own sonic logo).

## No voice (text only)
On-screen text carries the story. Time reading at ~2.5 words/s, hold number beats an extra 0.3 s, and let the music carry the twist.
