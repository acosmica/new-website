import { notFound } from "next/navigation";
import { educational } from "@/lib/gatherings";
import EducationalDetail from "@/components/gatherings/EducationalDetail";

export function generateStaticParams() {
  return educational.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = educational.find((x) => x.slug === slug);
  return {
    title: e ? `${e.title} — Gatherings` : "Gatherings",
  };
}

export default async function EducationalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = educational.find((e) => e.slug === slug);
  if (!entry) notFound();
  return <EducationalDetail entry={entry} />;
}
