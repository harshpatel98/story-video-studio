"""Voice recording -> word timestamps -> differences vs the script -> per-caption-word timing.

Normalisation only makes the comparison fair ("$1.75 billion" == "1.75 billion dollars", "60%" == "60 percent").
It never changes caption text. Differences are reported to the creator before anything is timed from them.
"""
import difflib, json, os, re

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def _int_words(n):
    if n < 20: return [ONES[n]]
    if n < 100: return [TENS[n // 10]] + ([ONES[n % 10]] if n % 10 else [])
    if n < 1000: return [ONES[n // 100], "hundred"] + (_int_words(n % 100) if n % 100 else [])
    for v, name in ((10 ** 9, "billion"), (10 ** 6, "million"), (1000, "thousand")):
        if n >= v: return _int_words(n // v) + [name] + (_int_words(n % v) if n % v else [])
    return [str(n)]


def num_words(s):
    s = s.replace(",", "")
    if "." in s:
        a, b = s.split(".", 1)
        return (_int_words(int(a)) if a else ["zero"]) + ["point"] + [ONES[int(c)] for c in b if c.isdigit()]
    return _int_words(int(s))


def norm_tokens(raw):
    """raw tokens -> [(word, source_index)] in a spoken-words space."""
    out, i = [], 0
    while i < len(raw):
        t = raw[i].lower().replace("wi-fi", "wifi").replace("…", "").replace("&", "and")
        t = re.sub(r"[^\w$%.\-']", "", t).strip(".-'")
        m = re.fullmatch(r"\$?(\d[\d,]*(?:\.\d+)?)([kmb%]?)", t)
        if m:
            dollar = t.startswith("$")
            words = num_words(m.group(1))
            suf = {"k": ["thousand"], "m": ["million"], "b": ["billion"], "%": ["percent"]}.get(m.group(2), [])
            nxt = raw[i + 1].lower().strip(".,!?") if i + 1 < len(raw) else ""
            extra, step = [], 1
            if not suf and nxt in ("million", "billion", "thousand", "trillion"):
                extra, step = [nxt], 2
            out += [(w, i) for w in words + suf + extra]
            if dollar: out.append(("dollars", i))
            i += step
            continue
        t = t.replace("%", "")
        for part in t.split("-"):
            if part:
                out.append(({"dollar": "dollars", "percent": "percent"}.get(part, part), i))
        i += 1
    merged = []
    for w, i in out:  # whisper sometimes splits "Wi-Fi" into "Wi" "-Fi"
        if w == "fi" and merged and merged[-1][0] == "wi": merged[-1] = ("wifi", merged[-1][1])
        else: merged.append((w, i))
    return merged


def transcribe(vo, cache):
    if os.path.exists(cache):
        c = json.load(open(cache))
        if c.get("file") == vo and c.get("mtime") == os.path.getmtime(vo):
            return c
    from faster_whisper import WhisperModel
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    segs, info = model.transcribe(vo, word_timestamps=True, beam_size=5, vad_filter=False)
    words = [{"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)} for s in segs for w in s.words]
    # merge "$1" + ".75" splits
    mw = []
    for w in words:
        if mw and re.fullmatch(r"\.\d+[.,]?", w["w"]) and re.fullmatch(r"\$?\d+", mw[-1]["w"]):
            mw[-1] = {**mw[-1], "w": mw[-1]["w"] + w["w"], "end": w["end"]}
        else:
            mw.append(w)
    c = {"file": vo, "mtime": os.path.getmtime(vo), "duration": info.duration, "words": mw}
    json.dump(c, open(cache, "w"), indent=1)
    return c


def compare(script_raw, vo):
    """Returns (diffs, timing). diffs: list of dicts; timing: [(t, end)] per script token."""
    vwords = vo["words"]
    s_norm = norm_tokens(script_raw)
    v_norm = norm_tokens([w["w"] for w in vwords])
    a, b = [w for w, _ in s_norm], [w for w, _ in v_norm]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    ops = [op for op in sm.get_opcodes() if op[0] != "equal"]
    diffs = []
    for tag, i1, i2, j1, j2 in ops:
        si = sorted({s_norm[k][1] for k in range(i1, i2)}); vj = sorted({v_norm[k][1] for k in range(j1, j2)})
        diffs.append({"kind": {"replace": "different", "delete": "not said", "insert": "extra"}[tag],
                      "script": " ".join(script_raw[k] for k in si), "voice": " ".join(vwords[k]["w"] for k in vj),
                      "at": vwords[vj[0]]["start"] if vj else None})
    s2v = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            s2v.setdefault(s_norm[blk.a + k][1], v_norm[blk.b + k][1])
    span = {}
    for tag, i1, i2, j1, j2 in ops:
        if tag == "replace":  # creator confirmed it's the same spoken word(s): time from the VO span
            si = sorted({s_norm[k][1] for k in range(i1, i2)}); vj = sorted({v_norm[k][1] for k in range(j1, j2)})
            for n, s in enumerate(si):
                a0 = vj[min(len(vj) - 1, round(n * len(vj) / len(si)))]; a1 = vj[min(len(vj) - 1, max(0, round((n + 1) * len(vj) / len(si)) - 1))]
                span[s] = (vwords[a0]["start"], vwords[a1]["end"])
    out = []
    for i in range(len(script_raw)):
        if i in span: out.append(list(span[i]))
        elif i in s2v: w = vwords[s2v[i]]; out.append([w["start"], w["end"]])
        else: out.append([None, None])
    for i, o in enumerate(out):  # interpolate words that were not heard
        if o[0] is None:
            p = next((out[k] for k in range(i - 1, -1, -1) if out[k][0] is not None), None)
            n = next((out[k] for k in range(i + 1, len(out)) if out[k][0] is not None), None)
            t0 = p[1] if p else 0.0; t1 = n[0] if n else t0 + .4
            o[0] = round((t0 + t1) / 2, 3); o[1] = round(min(t1, o[0] + .3), 3)
    for k in range(1, len(out)):  # captions stay in order
        if out[k][0] < out[k - 1][0]:
            out[k][0] = out[k - 1][1]; out[k][1] = max(out[k][1], out[k][0] + .1)
    return diffs, [tuple(o) for o in out]


def lead_silence(vo):
    """seconds before the first word (to flag a clipped start)."""
    return vo["words"][0]["start"] if vo["words"] else None
