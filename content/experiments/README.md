# How to edit /experiments

The `/experiments` page renders as a Y2K media-player skin. Each project
sits in the playlist as a "track" — clicking it loads a slide preview
into the LCD, and the **Learn more** button opens a full detail page.

All editable text lives in this folder. No code knowledge required.

## Files

- `intro.mdx` — the welcome panel shown in the LCD before any track is
  selected (title + tagline + short prose).
- `projects/` — one `.mdx` file per experiment. Filenames are
  `01-*.mdx`, `02-*.mdx`, `03-*.mdx` etc. The number prefix controls
  the playlist order (top → bottom).

## Project frontmatter

Every project file starts with a YAML block between two `---` lines.

```yaml
---
slug: ai-fashion           # url-safe id, must be unique
title: AI & Fashion        # project name shown in playlist, slide caption,
                           #   title bar, and the detail page header
year: 2023 — Present       # date or range
tags:                      # short keywords; first 3–4 show in the slide,
                           #   all show in the detail page
  - generative
  - fashion
  - ai
summary: One-line teaser shown under the slide caption and on the
         playlist hover. Keep it short — a single sentence.
preview: /experiments/ai-fashion/bella-01.jpg
                           # optional — fallback image when `images` is empty
video: /experiments/ai-fashion/bella-04.mp4
                           # optional — reserved for future use
images:                    # files inside /public/experiments/<folder>/.
                           #   First 2 appear in the slide carousel; all of
                           #   them are laid out in the detail page.
  - /experiments/ai-fashion/bella-01.jpg
  - /experiments/ai-fashion/bella-02.png
  - /experiments/ai-fashion/bella-03.png
---
```

## Body

Everything below the closing `---` is the project description shown on
the detail page. Write paragraphs separated by a blank line:

```mdx
First paragraph — what the project is and why it exists.

Second paragraph — tools, process, lessons learned.

Third paragraph — what's next, collaborators, where it lives.
```

## Slide orientation

The slide format is detected automatically from the first image:

- If the first image is **portrait** (taller than wide) the slide
  renders as a vertical carousel beside a text panel.
- Otherwise it renders as a wide landscape slide using the **emoji cam**
  reference aspect (3600 × 1830).

Want a project to render landscape even though its images are portrait?
Add its `slug` to `FORCE_LANDSCAPE_SLUGS` in
`src/components/experiments/PlayerDisplay.tsx`.

## Adding a new experiment

1. Drop your images into `public/experiments/<folder-name>/`.
2. Copy any existing project file in `projects/`, give it the next
   number prefix (e.g. `06-*.mdx`), and edit the frontmatter + body.
3. The playlist picks it up automatically on the next reload.

## Removing or reordering

- Delete a `projects/*.mdx` file to remove an experiment.
- Rename the file with a different number prefix to reorder it.
