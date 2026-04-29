/**
 * Static data for the /experiments page. Sourced from editable MDX
 * documents under `content/experiments/` (one per project, plus the
 * shared intro). Read at build time via gray-matter.
 *
 * Editing the page content is just opening the matching .mdx file —
 * frontmatter (title, tags, images, summary) lives at the top, body
 * prose lives below. Paragraphs are separated by blank lines.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content", "experiments");

function readFile(rel: string) {
  const raw = fs.readFileSync(path.join(ROOT, rel), "utf8");
  return matter(raw);
}

function readDir(subdir: string) {
  const dir = path.join(ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => readFile(path.join(subdir, f)));
}

function paragraphs(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const introMatter = readFile("intro.mdx");
export const intro = {
  title: (introMatter.data.title as string) ?? "Experiments",
  tagline: (introMatter.data.tagline as string) ?? "",
  body: paragraphs(introMatter.content),
};

export type ComponentKind = "chip" | "module" | "led" | "resistor";

export type Experiment = {
  slug: string;
  title: string;
  label: string;
  // Retained for future use. The new ProjectCard ignores `kind` — every
  // project renders with the same unified shell.
  kind: ComponentKind;
  year: string;
  tags: string[];
  summary: string;
  preview?: string;
  previewImages: string[];
  video?: string;
  images: string[];
  body: string[];
};

export const experiments: Experiment[] = readDir("projects").map(
  ({ data, content }) => ({
    slug: data.slug as string,
    title: data.title as string,
    label: (data.label as string) ?? "",
    kind: (data.kind as ComponentKind) ?? "chip",
    year: String(data.year ?? ""),
    tags: (data.tags as string[]) ?? [],
    summary: (data.summary as string) ?? "",
    preview: data.preview as string | undefined,
    previewImages: (data.previewImages as string[]) ?? [],
    video: data.video as string | undefined,
    images: (data.images as string[]) ?? [],
    body: paragraphs(content),
  }),
);
