import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { production } from "@/lib/gatherings";

export function generateStaticParams() {
  return production.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = production.find((p) => p.slug === slug);
  return {
    title: data ? `${data.title} — Gatherings` : "Gatherings",
  };
}

/**
 * Detail page for a "More events" production credit. Lighter than the
 * featured-festival detail (no mosaic system) — the goal is just to
 * show the full description with the available imagery enlarged.
 */
export default async function ProductionDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = production.find((p) => p.slug === slug);
  if (!data) notFound();

  const images = [data.image, ...(data.gallery ?? [])];

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden">
      <div aria-hidden className="fixed inset-0 -z-20 bg-plum-dark" />
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src={data.image}
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          style={{ filter: "blur(34px) saturate(1.1)" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, rgba(18,10,31,0.85) 0%, rgba(37,26,56,0.7) 60%, rgba(90,62,122,0.55) 100%)",
          }}
        />
      </div>

      <Link
        href="/gatherings"
        className="plum-outset fixed left-4 top-4 z-50 inline-flex items-center gap-2 bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50 md:left-6 md:top-6"
      >
        <span aria-hidden>←</span> Back
      </Link>

      <main className="mx-auto max-w-[96rem] px-4 py-16 md:px-10 md:py-20">
        <article className="plum-outset bg-plum text-code-text shadow-[8px_10px_0_rgba(0,0,0,0.45)]">
          {/* Header strip */}
          <header className="border-b border-plum-light/40 px-6 py-6 md:px-12 md:py-8">
            <span className="font-pixel text-sm uppercase tracking-[0.22em] text-paper/55">
              More events ▸ {data.year}
            </span>
            <h1 className="mt-2 font-pixel text-4xl leading-none text-paper md:text-6xl">
              {data.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-pixel text-sm uppercase leading-none tracking-[0.18em] text-paper/55">
                Role ▸
              </span>
              <span className="plum-outset bg-plum-light/30 px-2 py-0.5 font-pixel text-base leading-none text-paper">
                {data.role}
              </span>
            </div>
          </header>

          {/* Body — 2 columns: full description on the left, image(s)
              on the right. Sized so most pages fit in a single
              viewport without scrolling. */}
          <div className="grid items-start gap-8 px-6 py-8 md:grid-cols-[1fr_1.1fr] md:gap-12 md:px-12 md:py-10">
            <div>
              <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
                {data.body}
              </p>

              <div className="mt-8 border-t border-plum-light/40 pt-6">
                <Link
                  href="/gatherings"
                  className="plum-outset bg-plum px-3 py-1 font-pixel text-base leading-none text-mauve hover:bg-plum-light/50 hover:text-blush"
                >
                  ← Back to Gatherings
                </Link>
              </div>
            </div>

            {/* Image column — single image stacks vertically; gallery
                of two stacks the second beneath the first within this
                column so the text column stays a comfortable width. */}
            <div className="flex flex-col gap-3 md:gap-4">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="plum-outset overflow-hidden bg-plum-dark"
                >
                  <Image
                    src={src}
                    alt=""
                    width={2400}
                    height={1600}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="block h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
