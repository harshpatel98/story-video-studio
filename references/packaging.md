# Thumbnails, captions and export

## Thumbnails
Same ratio as the video (vertical for Shorts/Reels/TikTok). Rules for every style:
- Built from the video's **own props, palette and fonts** so the thumbnail and the video match.
- Hook text **≤ 5 words**, plus one **payoff stamp**; only facts from the approved script.
- Readable at feed size (check a ~110×200 px preview). Keep text above the bottom UI zone.
- No real logos, no altered real faces.

Styles:
- **High-CTR / Clickbait:** the biggest number + a contradiction ("$34 BILLION TRUCK" + "WASN'T DRIVING"; "$1.75B APP" + "GONE IN 6 MONTHS"); one strong prop; a marker arrow or stamp.
- **Clean / Minimalist:** one number or one word, generous negative space, one accent.
- **Match Video Theme:** the hook frame of the video, re-composed with the hook text.
- **Custom:** follow the user's brand kit (`templates/brand-kit.md`).

## Platform packaging (per platform)
- **YouTube Shorts:** title ≤ 60 characters (front-load the number/irony), 1–2 sentence description with sources line, 3–5 hashtags, pinned comment that asks a debate question.
- **TikTok:** caption ≤ 150 characters with the hook + a question, 3–5 hashtags (one broad, two niche, one series tag), pinned comment with the source note.
- **Instagram Reels:** caption with a 1-line hook, 2–3 short lines of context, a question, 5–8 hashtags at the end.
- **YouTube long-form (16:9):** title ≤ 70 characters, description with a 2-sentence summary, chapters (timestamps from the beat table), sources list, 3 hashtags; pinned comment with sources + a question.
- Always include a **sources line** drawn from the closed Verify list, and keep titles free of claims the script doesn't make.

## Export (`/export`)

`/export` produces the production sheet:

**Markdown:** Topic · Specs · Script (+ Verify list) · Beat table · Storyboard · Prop list · Audio cue sheet · Mix spec · Thumbnail concepts · Platform packaging · Open items.

**JSON (schema):**
```json
{
  "topic": "", "mode": "single|series|batch", "episode": 1,
  "specs": {"ratio": "9:16", "resolution": "1080x1920", "fps": 60, "target_seconds": 37, "vo_seconds": 32},
  "script": {"preset": "S1", "beats": [{"id": "hook", "line": "", "est_s": 0}], "verify": [{"claim": "", "check": "", "safer_wording": ""}]},
  "visual": {"preset": "V3", "storyboard": [{"t": 0, "beat": "", "focal": "", "motion": "", "camera": "", "text": "", "transition": "", "trigger_word": ""}], "props": []},
  "audio": {"vo_mode": "uploaded|ai|text", "vo_settings": {}, "music": {"mood": "", "drop_on": "TURN"}, "cues": [{"t": 0, "cue": "", "type": "sfx", "synced_to": ""}], "mix": {"lufs": -14, "true_peak_dbtp": -1.5}},
  "thumbnail": {"style": "", "concepts": [{"hook_text": "", "payoff": "", "props": []}]},
  "packaging": [{"platform": "", "title": "", "description": "", "hashtags": [], "pinned_comment": ""}],
  "open_items": []
}
```
