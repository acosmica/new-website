import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";
import ProjectView from "@/components/work/ProjectView";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectView project={project} />;
}
