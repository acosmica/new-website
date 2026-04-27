/**
 * Static data for the /gatherings page. Sourced from the editable
 * markdown documents under `content/gatherings/` (see the README in
 * that folder for the file map). All fields are read at build time
 * via gray-matter; nothing here is dynamic at runtime.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content", "gatherings");

function readFile(rel: string) {
  const full = path.join(ROOT, rel);
  const raw = fs.readFileSync(full, "utf8");
  return matter(raw);
}

function readDir(subdir: string) {
  const dir = path.join(ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => readFile(path.join(subdir, f)));
}

/** Split markdown body into individual paragraphs. Blank lines (one
 *  or more) separate paragraphs in the source, mirroring how authors
 *  naturally write prose. */
function paragraphs(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/* ─────────────────────────────────────────────────────────────────── */
/*                              INTRO                                  */
/* ─────────────────────────────────────────────────────────────────── */

const introMatter = readFile("intro.md");
export const intro = {
  title: (introMatter.data.title as string) ?? "Gatherings",
  tagline: (introMatter.data.tagline as string) ?? "",
  body: paragraphs(introMatter.content),
};

const eduIntroMatter = readFile("educational-intro.md");
/** Single-paragraph intro shown in the Educational popup header. */
export const educationalIntro = paragraphs(eduIntroMatter.content).join("\n\n");

/* ─────────────────────────────────────────────────────────────────── */
/*                            FEATURED                                 */
/* ─────────────────────────────────────────────────────────────────── */

export type Featured = {
  slug: "artelligent" | "immer";
  eyebrow: string;
  title: string;
  tagline: string;
  teaser: string;
  years: string;
  location: string;
  role: string;
  tags: string[];
  body: string[];
  hero: string;
  heroFocus?: string;
  heroSlides?: string[];
  mosaic: { src: string; aspect: string; span?: "wide" | "tall" }[];
};

export const featured: Featured[] = readDir("featured").map(({ data, content }) => ({
  slug: data.slug as Featured["slug"],
  eyebrow: data.eyebrow as string,
  title: data.title as string,
  tagline: data.tagline as string,
  teaser: data.teaser as string,
  years: String(data.years ?? ""),
  location: (data.location as string) ?? "",
  role: (data.role as string) ?? "",
  tags: (data.tags as string[]) ?? [],
  body: paragraphs(content),
  hero: data.hero as string,
  heroFocus: data.heroFocus as string | undefined,
  heroSlides: data.heroSlides as string[] | undefined,
  mosaic: (data.mosaic as Featured["mosaic"]) ?? [],
}));

/* ─────────────────────────────────────────────────────────────────── */
/*                          PRODUCTION                                 */
/* ─────────────────────────────────────────────────────────────────── */

export type ProductionEntry = {
  slug: string;
  role: string;
  title: string;
  year: string;
  teaser: string;
  body: string;
  image: string;
  imageFocus?: string;
  gallery?: string[];
};

export const production: ProductionEntry[] = readDir("events").map(
  ({ data, content }) => ({
    slug: data.slug as string,
    role: data.role as string,
    title: data.title as string,
    year: String(data.year ?? ""),
    teaser: data.teaser as string,
    body: content.trim().replace(/\s+/g, " "),
    image: data.image as string,
    imageFocus: data.imageFocus as string | undefined,
    gallery: data.gallery as string[] | undefined,
  }),
);

/* ─────────────────────────────────────────────────────────────────── */
/*                         EDUCATIONAL                                 */
/* ─────────────────────────────────────────────────────────────────── */

export type EducationalEntry = {
  slug: string;
  kind: string;
  title: string;
  venue: string;
  year: string;
  teaser: string;
  body: string;
  images: string[];
  previewImage?: string;
  imageFocus?: string;
  link?: { href: string; label: string };
};

export const educational: EducationalEntry[] = readDir("educational").map(
  ({ data, content }) => ({
    slug: data.slug as string,
    kind: data.kind as string,
    title: data.title as string,
    venue: data.venue as string,
    year: String(data.year ?? ""),
    teaser: data.teaser as string,
    body: content.trim().replace(/\s+/g, " "),
    images: (data.images as string[]) ?? [],
    previewImage: data.previewImage as string | undefined,
    imageFocus: data.imageFocus as string | undefined,
    link: data.link as EducationalEntry["link"],
  }),
);
