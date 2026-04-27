"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import TarotCard from "./TarotCard";
import type { Project } from "@/lib/projects";

type Props = { projects: Project[] };

export default function TarotGrid({ projects }: Props) {
  const searchParams = useSearchParams();

  // Filter is URL-backed (?tags=A,B) — same contract as WorkToolbar.
  const selected = useMemo(() => {
    const raw = searchParams.get("tags") ?? "";
    return new Set(raw.split(",").filter(Boolean));
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (selected.size === 0) return projects;
    return projects.filter((p) =>
      Array.from(selected).every((t) => p.tags.includes(t)),
    );
  }, [projects, selected]);

  if (filtered.length === 0) {
    return (
      <div className="grid flex-1 place-items-center bg-plum p-10 text-center">
        <div>
          <div className="font-pixel text-2xl text-code-text">
            No projects match
          </div>
          <p className="mt-2 font-mono text-sm text-code-text/70">
            Adjust the tag filter above to see more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-plum">
      <div className="mx-auto grid max-w-[92rem] grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:gap-6 md:p-7 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) => (
          <TarotCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
