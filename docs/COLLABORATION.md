# Working on this together

Harry and Julie both work on this site from different machines, sharing one
Claude Code account. Everything lives in GitHub so either person can pick the
project up anywhere, on any device.

**Repo:** https://github.com/SanctaAngeli/Leah-schwartz-archive
**Live site:** https://leah-schwartz-archive.netlify.app

---

## First-time setup

You need [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (v20 or
newer — this project is developed on v24).

```bash
git clone https://github.com/SanctaAngeli/Leah-schwartz-archive.git
cd Leah-schwartz-archive
npm install
npm run dev
```

The dev server prints a `http://localhost:5173` URL. Open it and you have the
whole site running locally.

**The first clone is a big download — around 450MB.** The repo carries the
full-resolution artwork scans, which is the point: the art travels with the
code, so neither of us ever has assets that the other is missing. Give it a
few minutes on a slow connection. You only pay this cost once.

---

## The daily rhythm

The whole workflow is two habits. They matter more than anything else in this
document.

### Start of every session — pull first

```bash
git pull
```

Do this *before* you open Claude Code or touch a file. It pulls down whatever
the other person did last. Skipping it is how you end up building on top of a
stale copy of the site.

If `npm run dev` behaves strangely after a pull, someone probably added a
dependency — run `npm install` and try again.

### End of every session — push everything

```bash
git add -A
git commit -m "describe what changed"
git push
```

Or just tell Claude Code: *"commit and push everything."*

Once this lands, the other person can `git pull` and be exactly where you left
off. **Work that is only committed locally does not exist as far as the other
person is concerned** — an unpushed commit is invisible from the other machine.

---

## Handing the project back and forth

Only one person should be actively working at a time. There's no lock enforcing
this — it's just a matter of saying so. A message along the lines of *"pushed,
all yours"* is enough.

If you both edit at once, Git will stop you at the `git pull` with a merge
conflict. That's Git protecting the work rather than a disaster — nothing is
lost. Ask Claude Code to resolve the conflict; it can see both versions and
reconcile them.

The genuinely risky case is when both people have been working for hours
without pushing. That's what the two habits above are for.

---

## Deploying

The live site does **not** update automatically when you push. It's published
manually from Harry's machine:

```bash
npm run build
netlify deploy --prod
```

This means Julie cannot currently deploy — the Netlify project sits under
Harry's personal account.

**This is worth fixing.** Connecting the Netlify project to the GitHub repo
would make every push to `main` deploy itself, and neither person would need
Netlify credentials at all. Push becomes publish. See
`Netlify → Project configuration → Build & deploy → Link repository`.

---

## What's in the repo, and what isn't

Committed and shared:

- `src/` — the site itself
- `public/` — all artwork, scans, and assets
- `docs/` — the plan, design concepts, reviews, session notes
- `CLAUDE.md` — the house rules Claude Code follows on this project

Deliberately *not* committed (each machine generates its own):

- `node_modules/` — rebuilt by `npm install`
- `dist/` — rebuilt by `npm run build`
- `.netlify/` — local deploy link

So: if you add artwork or a document and want the other person to see it, it
goes in the repo and gets pushed. That's the whole rule.

---

## If something goes wrong

Nothing pushed to GitHub is ever really lost — every version is recoverable.
Before trying to fix a tangle by hand, ask Claude Code. Describe what happened
in plain language; it can read the repo state and work out what to do.

The one thing to avoid is `git push --force`, which can overwrite the other
person's work. If you find yourself reaching for it, ask first.
