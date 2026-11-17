"""Headless Chromium renders player.html frame by frame: seek(t) -> PNG. Resumable."""
import asyncio, base64, json, os, time
from pathlib import Path

ENGINE = Path(__file__).resolve().parent.parent
URL = (ENGINE / "player.html").as_uri()
GRAB = "t => { seek(t); return document.getElementById('c').toDataURL('image/png'); }"


async def _page(browser, tl):
    page = await browser.new_page(viewport={"width": 1080, "height": 1920})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    await page.add_init_script("window.TL = " + json.dumps(tl) + ";")
    await page.goto(URL)
    try:
        await page.wait_for_function("window.READY === true || window.READY_ERROR", timeout=60000)
    except Exception:
        raise RuntimeError("player did not start: " + "; ".join(errors))
    if errors:
        raise RuntimeError("player errors: " + "; ".join(errors))
    return page, errors


def _save(data, path):
    open(path, "wb").write(base64.b64decode(data.split(",", 1)[1]))


async def _stills(tl, times, outdir):
    from playwright.async_api import async_playwright
    os.makedirs(outdir, exist_ok=True)
    out = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page, errors = await _page(b, tl)
        events = await page.evaluate("window.EVENTS")
        for t in times:
            f = os.path.join(outdir, f"t_{t:06.2f}.png"); _save(await page.evaluate(GRAB, t), f); out.append(f)
        same = (await page.evaluate(GRAB, times[0])) == (await page.evaluate(GRAB, times[0])) if times else True
        await b.close()
    return out, events, same, errors


async def _frames(tl, fps, workers, outdir, log):
    from playwright.async_api import async_playwright
    os.makedirs(outdir, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pages = [(await _page(b, tl))[0] for _ in range(workers)]
        n = int(round(tl["duration"] * fps)); start = time.time(); done = [0]

        async def work(k, page):
            for i in range(k, n, workers):
                f = os.path.join(outdir, f"f_{i:06d}.png")
                if not os.path.exists(f):
                    _save(await page.evaluate(GRAB, i / fps), f)
                done[0] += 1
                if done[0] % 300 == 0:
                    log(f"  frame {done[0]}/{n}  ({time.time() - start:.0f}s)")
        await asyncio.gather(*(work(k, pg) for k, pg in enumerate(pages)))
        await b.close()
    return n


def stills(tl, times, outdir):
    return asyncio.run(_stills(tl, times, outdir))


def frames(tl, fps, workers, outdir, log=print):
    return asyncio.run(_frames(tl, fps, workers, outdir, log))
