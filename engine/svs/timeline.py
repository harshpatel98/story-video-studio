"""video.json -> timeline (beats with word times). Placeholder pace until a real voice recording exists."""
import json, os, re

WPS = 3.1            # placeholder reading pace (words per second)
ELLIPSIS_PAUSE = 0.45
GAP = 0.3
VO_OFFSET = 0.25     # the voice starts this late in the video
PRE_ROLL = 0.12      # a beat starts this long before its first word
KICKER_HOLD = 1.0    # the last line holds this long before the end card
END_CARD = 3.4
LOOKS = ("v3", "v2")
TURN_WORDS = ("then", "but", "until", "so", "one day", "that's when", "and then")


class ProjectError(Exception):
    pass


def load(project):
    path = os.path.join(project, "video.json")
    if not os.path.exists(path):
        raise ProjectError(f"No video.json in {project}")
    cfg = json.load(open(path, encoding="utf-8"))
    beats = cfg.get("beats") or []
    if not beats:
        raise ProjectError("video.json has no beats")
    for i, b in enumerate(beats):
        if not str(b.get("say", "")).strip():
            raise ProjectError(f"beat {i + 1} has no 'say' line")
        b.setdefault("id", f"b{i + 1}")
        b.setdefault("show", [])
    look = str(cfg.get("look", "v3")).lower().split()[0].replace("keynote", "v3").replace("bold", "v2")
    if look not in LOOKS:
        raise ProjectError(f"look '{cfg.get('look')}' is not built into the engine yet (available: {', '.join(LOOKS)})")
    cfg["look"] = look
    if not any(b.get("turn") for b in beats):
        cand = [i for i, b in enumerate(beats) if i >= 2 and b["say"].strip().lower().startswith(TURN_WORDS)]
        beats[cand[0] if cand else round(len(beats) * .45)]["turn"] = True
    for p in ("voice", "music"):
        if cfg.get(p):
            f = os.path.join(project, cfg[p])
            if not os.path.exists(f):
                raise ProjectError(f"{p} file not found: {cfg[p]}")
            cfg[p] = f
    return cfg


def tokens(cfg):
    """[(beat_index, raw_token)] in script order: the caption words."""
    return [(i, tok) for i, b in enumerate(cfg["beats"]) for tok in b["say"].split()]


_n = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())


def _hl_set(beat):
    s = set()
    for el in beat["show"]:
        for k in ("title", "number", "text", "stamp", "date", "span"):
            if k == "text" and not el.get("hl"):
                continue
            if k in el and not isinstance(el[k], (list, bool)):
                s |= {_n(w) for w in str(el[k]).split() if len(_n(w)) > 2}
    return s


def build(cfg, timing=None):
    """timing: None (placeholder pace) or [(t, end)] per token in tokens(cfg) order, in VO seconds."""
    beats_out, k = [], 0
    t = 0.4
    for i, b in enumerate(cfg["beats"]):
        hl = _hl_set(b)
        words = []
        if timing is None:
            wt = t
            for tok in b["say"].split():
                words.append({"w": tok, "t": round(wt, 3), "end": round(wt + 1 / WPS * .85, 3)})
                wt += 1.0 / WPS + (ELLIPSIS_PAUSE if tok.endswith("...") or tok.endswith("…") else 0)
            start, end = t, wt + GAP
            t = end
        else:
            for tok in b["say"].split():
                a, z = timing[k]; k += 1
                words.append({"w": tok, "t": round(a + VO_OFFSET, 3), "end": round(z + VO_OFFSET, 3)})
            start = 0.0 if i == 0 else words[0]["t"] - PRE_ROLL
            end = None
        for w in words:
            w["hl"] = bool(re.search(r"\d", w["w"])) or _n(w["w"]) in hl
        beats_out.append({"i": i, "id": b["id"], "say": b["say"], "show": b["show"], "turn": bool(b.get("turn")),
                          "caption": b.get("caption", True), "start": round(start, 3), "end": end and round(end, 3), "words": words})
    if timing is not None:
        for i, b in enumerate(beats_out):
            b["end"] = beats_out[i + 1]["start"] if i + 1 < len(beats_out) else round(b["words"][-1]["end"] + KICKER_HOLD, 3)
    else:
        beats_out[-1]["end"] = round(beats_out[-1]["end"] + KICKER_HOLD - GAP, 3)
    beats_out[0]["start"] = 0.0
    ec = beats_out[-1]["end"]
    beats_out.append({"i": len(beats_out), "id": "endcard", "say": "", "show": [], "turn": False, "caption": False,
                      "start": ec, "end": round(ec + END_CARD, 3), "words": []})
    return {"fps": 60, "w": 1080, "h": 1920, "duration": round(ec + END_CARD, 3), "look": cfg["look"],
            "accent": cfg.get("accent"), "title": cfg.get("title", ""), "endcard": cfg.get("endcard") or {},
            "voOffset": VO_OFFSET, "placeholder": timing is None, "beats": beats_out}
