import { notFound } from "next/navigation";
import { experiments } from "@/lib/experiments";
import ExperimentDetail from "@/components/experiments/ExperimentDetail";

export function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = experiments.find((x) => x.slug === slug);
  return {
    title: e ? `${e.title} — Experiments` : "Experiments",
  };
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = experiments.find((e) => e.slug === slug);
  if (!track) notFound();
  return <ExperimentDetail track={track} />;
}
