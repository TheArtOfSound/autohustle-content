# AutoHustle Articles — publishing and release

Production: https://articles.autohustle.online/ . This repository uses the editorial Worker, not a static assets-only deployment. Do not deploy the entire historical repository as Cloudflare assets. Do not deploy to PumpFun or other products.

## Source of truth

- `editorial/content-manifest.json`: 722 catalogued top-level entries, review states, approved priority selection, release ID and source references.
- `editorial/nested-blog-inventory.json`: directory-level inventory only; 12,029 candidates, not verified articles. No automatic promotion.
- `editorial/revisions/`: rewritten source snapshots. Signed articles are pinned to an immutable Git commit at runtime. Historical pages use the archive source and remain unreviewed.
- `editorial-edge-worker-20261127.js`: editorial runtime; `wrangler.jsonc` points at it explicitly. Static landing pages remain in the repository; edits to page templates must also update the embedded Worker versions.

## Publishing gate

1. Use one unique slug. Write a complete article with transparent attribution, support for factual claims, date, clear disclosure and appropriate safety review. No invented tests, prices, testimonials or affiliate ownership. Check similar titles in the prior audit. Human approval is required before promoting a new article. Do not classify an article as signed-source unless the original byline exists; record its immutable commit. For editorial rewrites add the source snapshot and update REVISED in the Worker. Add/update the corresponding library and department card and manifest record; increment release ID and runtime release info, including signed source map when needed.
2. Run `node scripts/editorial-build.mjs --write` to generate sitemap, RSS and the embedded discovery block. Run `node scripts/editorial-build.mjs` to check manifest uniqueness, eligible states, source existence, revised link restrictions, static/discovery parity, explicit Worker entry and JS syntax. This gate is not an independent fact checker. For a signed article ensure that the pinned ref contains the reviewed body.
3. Commit and review the diff. Confirm the intended repo and Worker. Inspect Cloudflare's active deployment and `/release.json`; set EXPECTED_PRODUCTION_RELEASE to that exact release (or missing only after confirming a stale release). With Node 22+ and already installed Wrangler, run `node scripts/editorial-release.mjs --deploy`. The script refuses a dirty tree, a changed live release or a failing gate. Deploy through one designated release owner only. Do not run direct Wrangler deployments from stale clones. Re-read the current Git head before any direct API deployment.
4. Run `node scripts/editorial-release.mjs` after deployment. It checks the public release ID, all priority URLs, canonical and robots controls. Check a legacy article, commercial links, search, mobile UI and a nonexistent path as well. If production drift occurs, investigate competing publishers rather than repeatedly overwriting. The guard does not lock Cloudflare globally or stop an external actor with deployment permissions.

## Editorial and commercial controls

Affiliate mode paused: legacy Amazon tag closed; no active account established. No direct unverified checkout links. Owned service invitations use explicit disclosures and article-specific UTM parameters. No blanket indexing of newly recovered blog entries. Add only eligible articles to the priority sitemap and feed. Google Search Console submission remains pending access. Never treat sitemap inclusion as indexing success.

## Maintenance

Check the active version and release marker before and after each release. Keep the manifest and library in sync. Recheck changed products and claims against current reliable sources, record review evidence, and compare title/body overlap before consolidation. Preserve legacy URLs and do not delete files without an explicit migration decision. Rollback only to a known verified editorial version after confirming no newer authorized work would be lost.
