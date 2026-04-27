import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Project = {
  slug: string;
  title: string;
  /** Short subtitle shown on the tarot card below the title. Falls back
   *  to tags[0] when omitted. */
  subtitle?: string;
  /** Displayed year. Usually a single number, but some projects span
   *  multiple years ("2021/2026") so we accept a string as well. Use
   *  `sortYear` for the numeric position on the grid. */
  year: number | string;
  /** Overrides `year` for grid ordering only. The displayed year stays the
   *  same — this just decides where the project sits on /work. Useful
   *  when you want to manually bump a project out of the first row. */
  sortYear?: number;
  /** Free-form location string, e.g. "Salvador, Brazil". */
  location?: string;
  tags: string[];
  /** Image shown in the tarot card (and poster for the detail video if any). */
  thumbnail?: string;
  /** Image shown on the detail page when no heroVideo is provided; also
   *  the image used by the tarot card when `thumbnail` is missing. */
  hero?: string;
  /** Optional video path — if present, it becomes the main media on the
   *  detail page, with `hero` used as the poster. */
  heroVideo?: string;
  /** CSS object-position for the tarot-card hero crop. Lets each project
   *  steer which part of a landscape/portrait image shows through the
   *  5:8 card — pick the region with most movement/dynamism. Accepts
   *  any valid object-position value (e.g. "top", "50% 30%"). */
  heroFocus?: string;
  /** Extra zoom applied to the tarot-card hero image (CSS scale multiplier).
   *  Use when a landscape hero contains baked-in letterboxing or padding
   *  that would otherwise show through the card — e.g. `heroZoom: 1.3`
   *  crops 30% into the image. Defaults to 1 (no zoom). */
  heroZoom?: number;
  /** Optional closing video — auto-rendered full width below the MDX body. */
  endVideo?: string;
  tools?: string[];
  link?: string;
  /** Free-form role credits for the "Role ▸" strip in the project header. */
  role?: string[];
  /** Festival / event names shown as an "Exhibition ▸" strip under Role. */
  exhibition?: string[];
  /** Supporting imagery rendered via the <Assets /> MDX component. */
  assets?: string[];
  summary: string;
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug ?? file.replace(/\.mdx?$/, ""),
        title: data.title ?? "Untitled",
        subtitle: data.subtitle,
        year: data.year ?? new Date().getFullYear(),
        sortYear: data.sortYear,
        location: data.location,
        tags: data.tags ?? [],
        thumbnail: data.thumbnail,
        hero: data.hero,
        heroVideo: data.heroVideo,
        heroFocus: data.heroFocus,
        heroZoom: data.heroZoom,
        endVideo: data.endVideo,
        tools: data.tools ?? [],
        link: data.link,
        role: data.role ?? [],
        exhibition: data.exhibition ?? [],
        assets: data.assets ?? [],
        summary: data.summary ?? "",
        body: content,
      } satisfies Project;
    })
    .sort((a, b) => {
      // Coerce to number — `year` may be a multi-year string like
      // "2021/2026", in which case sortYear must be set to control order.
      const ay = Number(a.sortYear ?? a.year) || 0;
      const by = Number(b.sortYear ?? b.year) || 0;
      return by - ay;
    });
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}
