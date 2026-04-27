import { Suspense } from "react";
import { getAllProjects } from "@/lib/projects";
import TarotGrid from "@/components/work/TarotGrid";

export default function WorkIndex() {
  const projects = getAllProjects();
  return (
    <Suspense
      fallback={
        <div className="grid flex-1 place-items-center bg-plum text-code-text">
          <span className="font-pixel text-sm opacity-60">Loading projects…</span>
        </div>
      }
    >
      <TarotGrid projects={projects} />
    </Suspense>
  );
}
