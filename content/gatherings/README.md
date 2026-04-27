# Editing Gatherings text

All text on the **Gatherings** page is now stored as plain markdown
documents in this folder. Open any file in a text editor (TextEdit,
VS Code, etc.) and edit. The site picks up the changes the next time
it builds — no code needed.

## Folder map

```
content/gatherings/
  README.md                   ← this file
  intro.md                    ← top of /gatherings (welcome popup)
  educational-intro.md        ← intro paragraph in the Educational popup
  featured/                   ← big festival popups (ARTELLIGENT, IMMER)
    01-artelligent.md
    02-immer.md
  events/                     ← "More events" cards + detail pages
    01-here-where.md
    02-festival-brasilia.md
    03-oxe-festival.md
    04-mostra-walfredo.md
  educational/                ← Educational cards + modal pop-ups
    01-laguardia.md
    02-ml5-itp.md
    03-nyu-videomapping.md
    04-processing-foundation.md
    05-synthetic-narratives.md
    06-enearte-expocom.md
```

The `01-`, `02-` prefixes control the **display order** on the page.
Rename them to reorder.

## Anatomy of an entry file

Each entry file has two parts:

```markdown
---
title: ARTELLIGENT
year: 2025
teaser: One- or two-line summary used on the preview card.
... more structured fields ...
---

The full body text shown inside the detailed page.

Paragraphs are separated by a blank line. Multiple paragraphs render
as separate paragraphs on the page.
```

- **Top section (between the `---` lines)** — the *preview* text and
  structured fields like year, location, role, tags, image paths.
  This is what shows on the cluster card.
- **Body (after the second `---`)** — the *detailed page* / pop-up
  copy. Write as many paragraphs as you want.

So **one file per entry**, with preview vs. detailed text cleanly
separated inside it.

## Common edits

- **Change a teaser (preview blurb)** → edit the `teaser:` line.
- **Change the full description** → edit the body text below the
  `---` lines.
- **Reorder cards** → rename files (e.g. `02-…` ↔ `03-…`).
- **Add or remove tags** → edit the `tags:` list.
- **Swap the cover image** → change the `previewImage:` path
  (educational) or `image:` path (events) or `hero:` path (featured).

## Things to be careful with

- Keep the two `---` lines exactly as they are — they mark the start
  and end of the structured top section.
- If a value contains a colon, em-dash, or quote mark, wrap the value
  in `"double quotes"` (e.g. `tagline: "Where art meets — and bends — AI."`).
- Image paths must start with `/gatherings/...` and the file must
  exist under `public/gatherings/...`.
- Don't rename the file extensions (`.md`).

If a build fails after a text edit, the most common cause is missing
quotes around a value with special punctuation — wrap it in `"…"` and
try again.
