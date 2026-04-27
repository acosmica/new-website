import { Suspense } from "react";
import Window from "@/components/windows/Window";
import WorkToolbar from "@/components/work/WorkToolbar";
import ScreensaverBackdrop from "@/components/work/ScreensaverBackdrop";
import { getAllProjects } from "@/lib/projects";

export default function WorkLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const projects = getAllProjects();
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="relative h-[100dvh] w-full p-3 pb-16 md:p-5 md:pb-16">
      <ScreensaverBackdrop />

      <Window
        title="Projects"
        fileName="~/work/"
        layoutId="folder-work"
        accent="plum"
        className="h-full max-w-[96rem]"
      >
        <Suspense
          fallback={
            <div aria-hidden className="plum-inset h-20 bg-code-gutter" />
          }
        >
          <WorkToolbar allTags={allTags} />
        </Suspense>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        )}
      </Window>

      {/* Parallel-slot modal — renders on top of the Window via the
          /work/@modal/(.)[slug] intercepting route when a card is clicked */}
      {modal}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid flex-1 place-items-center bg-plum p-8 text-center text-code-text">
      <div>
        <div className="font-pixel text-2xl text-code-text">
          No projects yet.
        </div>
        <p className="mt-2 max-w-sm text-sm text-code-text/70">
          Add .mdx files under <code>/content/projects</code> to populate this
          folder.
        </p>
      </div>
    </div>
  );
}
