import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";
import ProjectModal from "@/components/work/ProjectModal";
import ProjectView from "@/components/work/ProjectView";

// Intercepting route: when a <Link href="/work/[slug]"> is clicked from
// /work, Next.js renders THIS page into the @modal slot instead of
// navigating away. Direct navigation / hard refresh resolves to the
// full-page [slug]/page.tsx route.
export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ProjectModal title={project.title}>
      <ProjectView project={project} />
    </ProjectModal>
  );
}
