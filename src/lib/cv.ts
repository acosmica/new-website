/**
 * CV data, sourced from the editable markdown document at
 * `content/cv.md`. Frontmatter holds the structured fields (name,
 * email, experience, education, skills); the markdown body is the
 * Summary paragraph(s).
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Role = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export type CV = {
  name: string;
  title: string;
  email: string;
  location?: string;
  summary: string[];
  experience: Role[];
  education: Role[];
  skills: string[];
};

function paragraphs(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const file = path.join(process.cwd(), "content", "cv.md");
const raw = fs.readFileSync(file, "utf8");
const { data, content } = matter(raw);

export const cv: CV = {
  name: (data.name as string) ?? "",
  title: (data.title as string) ?? "",
  email: (data.email as string) ?? "",
  location: (data.location as string) || undefined,
  summary: paragraphs(content),
  experience: (data.experience as Role[]) ?? [],
  education: (data.education as Role[]) ?? [],
  skills: (data.skills as string[]) ?? [],
};
