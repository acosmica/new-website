import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featured } from "@/lib/gatherings";
import HeroSlideshow from "@/components/gatherings/HeroSlideshow";

type MosaicItem = { src: string; aspect: string; span?: "wide" | "tall" };

/**
 * Bespoke layout for the IMMER detail page. Reads top to bottom as:
 *
 *   ┌──── paragraphs 1+2 ────┬─ immer02 ─┐
 *   ├────────── immer03 ─────┴─ immer04 ─┤
 *   │            paragraph 3             │
 *   ├──────────── immer05 ───────────────┤
 *   │            paragraph 4             │
 *   ├────── immer06 ───┬───── immer07 ───┤
 *   ├────── immer08 ───┴───── immer09 ───┤
 *
 * The image filenames are hardcoded to match the reorganized folder
 * the user laid out by hand, so order is part of the page contract.
 */
function ImmerBody({ body }: { body: string[] }) {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Section 1 — paragraphs 1+2 (left) alongside immer02 (right) */}
      <section className="grid items-stretch gap-6 md:grid-cols-[1.2fr_1fr] md:gap-10">
        <div className="flex flex-col gap-5 text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
          {body[0] && <p>{body[0]}</p>}
          {body[1] && <p>{body[1]}</p>}
        </div>
        <div className="plum-outset self-stretch overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer02.jpg"
            alt=""
            width={2400}
            height={1600}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="block h-auto w-full"
          />
        </div>
      </section>

      {/* Section 2 — immer03 + immer04 in a 2-col grid; the columns
          size to each image's natural aspect using `auto` tracks. */}
      <section
        className="grid items-start gap-3 md:gap-4"
        style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}
      >
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer03.jpg"
            alt=""
            width={2400}
            height={1600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block h-auto w-full"
          />
        </div>
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer04.jpg"
            alt=""
            width={1600}
            height={1600}
            sizes="(max-width: 768px) 100vw, 35vw"
            className="block h-auto w-full"
          />
        </div>
      </section>

      {/* Paragraph 3 alone */}
      {body[2] && (
        <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
          {body[2]}
        </p>
      )}

      {/* Section 3 — immer05 alone, full body width */}
      <div className="plum-outset overflow-hidden bg-plum-dark">
        <Image
          src="/gatherings/immer/immer05.jpg"
          alt=""
          width={2400}
          height={1600}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="block h-auto w-full"
        />
      </div>

      {/* Paragraph 4 alone */}
      {body[3] && (
        <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
          {body[3]}
        </p>
      )}

      {/* Section 4 — immer06 + immer07 in their own line (2-col) */}
      <section className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-4">
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer06.jpg"
            alt=""
            width={2400}
            height={1350}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block h-auto w-full"
          />
        </div>
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer07.jpg"
            alt=""
            width={2400}
            height={1350}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block h-auto w-full"
          />
        </div>
      </section>

      {/* Section 5 — immer08 + immer09 in a 2-col grid */}
      <section className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-4">
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer08.png"
            alt=""
            width={1600}
            height={2200}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block h-auto w-full"
          />
        </div>
        <div className="plum-outset overflow-hidden bg-plum-dark">
          <Image
            src="/gatherings/immer/immer09.jpg"
            alt=""
            width={1600}
            height={2100}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block h-auto w-full"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * ARTELLIGENT body layout. Reads top to bottom as:
 *
 *   ┌── paragraph 1 (drop-cap) ──┬──────────────────┐
 *   │                            │                  │
 *   │ ──────────────────────── ──┤ vertical image   │
 *   │  horizontal image (auto-   │  (cropped to     │
 *   │  fills remaining cell)     │   fill cell)     │
 *   └────────────────────────────┴──────────────────┘
 *   ├──────────── paragraph 2 (full width) ─────────┤
 *   ├──── horiz 1 ──┬── horiz 2 ──┬── horiz 3 ──────┤
 *   ├──────────── paragraph 3 (full width) ─────────┤
 *   ├─────────── horizontal image (full width) ─────┤
 *   ├──────────── paragraph 4 (full width) ─────────┤
 *   └─────────── horizontal image (full width) ─────┘
 *
 * The grid uses `items-stretch` so both cells share the same height;
 * the horizontal image uses `object-cover` to fill the bottom of the
 * left column, ending flush with the bottom of the vertical image on
 * the right. Either side may be cropped to make the fit work — that's
 * the explicit trade-off requested.
 */
function InterleavedBody({
  body,
  mosaic,
}: {
  body: string[];
  mosaic: MosaicItem[];
}) {
  const verticalPic = mosaic[0];
  const underTextPic = mosaic[1];
  const rowOfThree = mosaic.slice(2, 5);
  const remaining = mosaic.slice(5);
  const trailingParas = body.slice(2);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Section A — paragraph 1 (top of left column) + horizontal
          image (bottom of left column, fills remaining cell height) +
          vertical image (right column, fills full cell height). The
          right column drives the height via aspect-ratio; both
          columns stretch to the same total height so the horizontal
          image's bottom lands flush with the vertical's bottom. */}
      <section className="grid items-stretch gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
        <div className="flex flex-col">
          {body[0] && (
            <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
              {body[0]}
            </p>
          )}
          {underTextPic && (
            <div className="plum-outset relative mt-6 min-h-[14rem] flex-1 overflow-hidden bg-plum-dark">
              <Image
                src={underTextPic.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        {verticalPic && (
          <div
            className="plum-outset relative overflow-hidden bg-plum-dark"
            style={{ aspectRatio: "2/3" }}
          >
            <Image
              src={verticalPic.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Paragraph 2 — full width, on its own line below the grid. */}
      {body[1] && (
        <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
          {body[1]}
        </p>
      )}

      {/* Section C — row of three horizontals, evenly split. */}
      {rowOfThree.length > 0 && (
        <section className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3 md:gap-4">
          {rowOfThree.map((item, i) => (
            <div key={i} className="plum-outset overflow-hidden bg-plum-dark">
              <Image
                src={item.src}
                alt=""
                width={2400}
                height={1600}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="block h-auto w-full"
              />
            </div>
          ))}
        </section>
      )}

      {/* Sections D+ — remaining paragraphs and remaining images,
          each on its own row at full body width. */}
      {trailingParas.map((p, idx) => {
        const img = remaining[idx];
        return (
          <div key={idx} className="flex flex-col gap-10 md:gap-14">
            <p className="text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
              {p}
            </p>
            {img && (
              <div className="plum-outset overflow-hidden bg-plum-dark">
                <Image
                  src={img.src}
                  alt=""
                  width={2400}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="block h-auto w-full"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Any extra images that didn't pair with a paragraph go alone. */}
      {remaining.slice(trailingParas.length).map((img, i) => (
        <div
          key={`extra-${i}`}
          className="plum-outset overflow-hidden bg-plum-dark"
        >
          <Image
            src={img.src}
            alt=""
            width={2400}
            height={1600}
            sizes="(max-width: 768px) 100vw, 80vw"
            className="block h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return featured.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = featured.find((f) => f.slug === slug);
  return {
    title: data ? `${data.title} — Gatherings` : "Gatherings",
  };
}

/**
 * Detail page for a featured initiative — opens when "Read more →"
 * is clicked from the cluster. No outer window chrome (matches the
 * cluster page); a blurred backdrop made from the festival's own
 * hero image keeps the page feeling like one zoomed-in popup.
 */
export default async function FeaturedDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = featured.find((f) => f.slug === slug);
  if (!data) notFound();

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden">
      {/* Blurred backdrop — same hero, heavily blurred */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-plum-dark" />
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src={data.hero}
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

      <main className="mx-auto max-w-[78rem] px-4 py-16 md:px-10 md:py-24">
        <article className="plum-outset bg-plum text-code-text shadow-[8px_10px_0_rgba(0,0,0,0.45)]">
          {/* Hero — auto-scrolling slideshow of the festival's vertical
              assets when `heroSlides` is provided; falls back to the
              static hero image otherwise. The metadata strip is
              rendered beneath the hero so the photos stay entirely
              visible. */}
          {data.heroSlides && data.heroSlides.length > 0 ? (
            <HeroSlideshow images={data.heroSlides} />
          ) : (
            <section className="plum-inset relative w-full overflow-hidden bg-code-gutter">
              <Image
                src={data.hero}
                alt=""
                width={2800}
                height={1800}
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                className="block h-auto w-full"
              />
            </section>
          )}
          <section className="border-b border-plum-light/40 px-6 py-5 md:px-10 md:py-6">
            <div className="flex flex-col gap-3">
              <span className="font-pixel text-sm uppercase tracking-[0.22em] text-paper/60">
                {data.eyebrow}
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h1 className="font-pixel text-5xl leading-none text-paper md:text-7xl">
                  {data.title}
                </h1>
                <div className="flex flex-col items-end font-mono text-base leading-tight text-paper/85">
                  <span>{data.location}</span>
                  <span>{data.years}</span>
                </div>
              </div>
              <p className="max-w-3xl font-bodoni text-xl italic leading-snug text-mauve md:text-2xl">
                {data.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-sm uppercase leading-none tracking-[0.18em] text-paper/55">
                  Tags ▸
                </span>
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-mauve/50 bg-plum-light/20 px-3 py-0.5 font-pixel text-base leading-none text-code-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-sm uppercase leading-none tracking-[0.18em] text-paper/55">
                  Role ▸
                </span>
                <span className="rounded-full border border-paper/30 bg-plum-light/15 px-3 py-0.5 font-pixel text-base leading-none text-paper">
                  {data.role}
                </span>
              </div>
            </div>
          </section>

          {/* Body — each festival has its own bespoke layout. */}
          <div className="mx-auto max-w-[68rem] px-6 py-10 md:px-12 md:py-14">
            {data.slug === "immer" ? (
              <ImmerBody body={data.body} />
            ) : (
              <InterleavedBody body={data.body} mosaic={data.mosaic} />
            )}

            <div className="mt-12 border-t border-plum-light/40 pt-6">
              <Link
                href="/gatherings"
                className="plum-outset bg-plum px-3 py-1 font-pixel text-base leading-none text-mauve hover:bg-plum-light/50 hover:text-blush"
              >
                ← Back to Gatherings
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
