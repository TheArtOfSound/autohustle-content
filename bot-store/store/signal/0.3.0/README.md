# Signal Desk Studio 0.3 — free evaluation

A local, read-only public-source change monitor with an evidence inbox. The CLI from 0.1 remains included and unchanged. Studio uses a separate data directory and cannot automatically import CLI snapshots.

## Run
Install Node.js 22 or newer, extract this archive into a dedicated directory, and run `node studio.mjs`. Open **http://127.0.0.1:4321/** on the same computer. Leave the process running. Use Ctrl+C to stop. Set SIGNAL_PORT and SIGNAL_DATA environment variables if you need a different port or data directory. Do not expose this service to the internet, other users or a reverse proxy. One instance per directory; a stale `.studio-lock` can be removed only after confirming all instances using that directory have stopped.

## Monitor a source
1. Enter a name, an authorized direct HTTP(S) URL, mode (text/raw HTML or JSON), and an interval of at least 300 seconds. URLs must not contain credentials, query parameters or fragments. Redirects are rejected. JSON Pointer optionally selects one field (e.g. `/release`).
2. Check the source to establish its baseline. Start monitoring to poll scheduled sources. Check all forces a check irrespective of schedule. The scheduler checks sequentially; operations may be temporarily unavailable during polling.
3. Review new changes in the evidence feed. Before/after excerpts are bounded around the first differing character. For snapshots totaling at most 8,192 characters and at most 120 lines each, expand Complete line comparison to see every added, removed and unchanged line. Larger snapshots explicitly fall back to excerpts. Use search, event and review filters. Mark individual changes read/unread or mark all read. Per-source checkbox controls whether matching changes are flagged unread; it does not suppress evidence. Configure Any change, Keyword appears/disappears (literal substring, optional case sensitivity), or Number crosses above/below. Numeric rules require a finite JSON number at the selected pointer (numeric strings are rejected). A crossing is strictly beyond the threshold, starting at or on the other side. First checks and rule edits establish a new baseline. Nonmatching changes remain in the feed as read; filter by relevance. Rules apply to normalized source content, not AI interpretation. There are no push, desktop or external notifications.
4. Edit a source; changing URL, mode, JSON Pointer or relevance rule resets its baseline. Removing a source leaves retained evidence intact. Export records produces JSON with source configuration, digests and bounded event excerpts and complete line comparisons for small documents, which can expose all of their content. It does not export raw baseline snapshots. Data resides in `signal-studio-data/studio.json` by default. Stop the process before copying the data directory. State and export are unencrypted; do not monitor sensitive sources. Automatic monitoring starts paused after each restart.

## Limitations
20 sources; 200 retained non-unchanged events; 512 KiB per response; 10-second request timeout; intervals 300–86400 seconds. Text is normalized raw text, not rendered HTML or semantic analysis. JSON is canonicalized by sorting object keys. This does not guarantee detection of transient changes between samples. Local loopback only; no hosted server, paid checkout, commercial license, native installer or independent security audit. Local fixtures are not a live external-source trial. Windows/macOS execution has not been tested.

## Verification
- `node --test test-rules.mjs` — 12 deterministic relevance/comparison checks.
- `node --test test-signal.mjs` — 13 original engine checks.
- `python test-studio.py` — 24 local API integration checks (requires Python 3).
- `python test-studio-ui.py` — 12 browser interaction checks (requires Python, Playwright and Chromium at `/usr/bin/chromium`). The harness tries direct local navigation and falls back to loading the actual HTML/JS in Chromium with requests bridged to the local server. Direct navigation was blocked in the test environment. No external sources or credentials were used.

All 61 checks passed in the local Linux test environment. The browser tests use controlled local fixtures, not live monitoring.
