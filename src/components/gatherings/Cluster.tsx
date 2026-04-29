import Image from "next/image";
import Link from "next/link";
import MiniWindow from "./MiniWindow";
import EducationalSection from "./EducationalSection";
import {
  intro,
  featured,
  production,
  educational,
  educationalIntro,
} from "@/lib/gatherings";

/**
 * Five-window cluster on /gatherings. No outer window chrome — the
 * cluster floats directly on a blurred desktop backdrop.
 *
 * Image policy across every popup: `object-contain` on every fixed
 * aspect-ratio frame so nothing is cropped or zoomed; body text
 * defaults to text-base (16px+) for legibility.
 */
export default function Cluster() {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-12 md:gap-x-10 md:gap-y-12">
      <div className="md:col-span-5 md:[&>*]:rotate-[-1.4deg]">
        <IntroPopup />
      </div>

      <div className="md:col-span-7 md:[&>*]:rotate-[0.9deg]">
        <FeaturedPopup slug="artelligent" />
      </div>

      <div className="md:col-span-7 md:[&>*]:rotate-[-0.6deg]">
        <FeaturedPopup slug="immer" />
      </div>

      <div className="md:col-span-5 md:[&>*]:rotate-[1.6deg]">
        <EventsPopup />
      </div>

      <div className="md:col-span-12 md:[&>*]:rotate-[-0.3deg]">
        <EducationalSection
          educational={educational}
          intro={educationalIntro}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*                              POPUPS                                 */
/* ─────────────────────────────────────────────────────────────────── */

function IntroPopup() {
  return (
    <MiniWindow title="welcome.txt" fileName="readme" variant="paper">
      <div className="px-5 py-5">
        <h1
          className="font-pixel text-5xl leading-[0.9] text-ink md:text-6xl"
          style={{ textShadow: "1px 1px 0 rgba(208, 65, 44, 0.25)" }}
        >
          {intro.title}
          <span className="ml-2 align-top text-2xl text-hot md:text-3xl">
            ✦
          </span>
        </h1>
        <p className="mt-3 font-bodoni text-2xl italic leading-snug text-plum-light">
          {intro.tagline}
        </p>
        <div className="mt-4 flex flex-col gap-3 font-sans text-base leading-relaxed text-ink/85">
          {intro.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-4 border-t border-ink/15 pt-3 font-mono text-sm text-ink/55">
          archive · 2018 — present
        </div>
      </div>
    </MiniWindow>
  );
}

/**
 * Big festival popup — image sits in a fixed 4:3 frame at full popup
 * width with object-contain so nothing crops; text column underneath
 * shares the same width edge so the layout reads flush.
 */
function FeaturedPopup({ slug }: { slug: "artelligent" | "immer" }) {
  const data = featured.find((f) => f.slug === slug)!;
  const ext = slug === "artelligent" ? "exe" : "app";

  return (
    <Link
      href={`/gatherings/${data.slug}`}
      prefetch
      className="block transition-transform hover:-translate-y-1"
    >
    <MiniWindow
      title={data.title}
      fileName={`${data.slug}.${ext}`}
      variant="plum"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-sm opacity-80">
            {data.years} · {data.location}
          </span>
          <span className="plum-outset bg-plum-light/30 px-2 py-0.5 font-pixel text-base leading-none text-mauve">
            Read more →
          </span>
        </div>
      }
    >
      {/* Hero — frame adapts to the image's natural aspect, no letterbox. */}
      <div className="plum-inset mx-3 mt-2 overflow-hidden bg-plum-dark">
        <Image
          src={data.hero}
          alt=""
          width={2400}
          height={1600}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="block h-auto w-full"
        />
      </div>

      <div className="flex flex-col gap-3 px-3 pb-3 pt-3">
        <h2
          className="font-pixel text-5xl leading-[0.9] text-paper md:text-6xl"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.45)" }}
        >
          {data.title}
        </h2>
        <span className="font-pixel text-sm uppercase tracking-[0.18em] text-paper/55">
          {data.eyebrow}
        </span>
        <p className="font-bodoni text-xl italic leading-snug text-mauve">
          {data.tagline}
        </p>
        <p className="text-base leading-relaxed text-code-text/90">
          {data.teaser}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {data.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-mauve/50 bg-plum-light/20 px-2.5 py-0.5 font-pixel text-base leading-none text-paper"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </MiniWindow>
    </Link>
  );
}

/**
 * "More events" popup — file-explorer style index list. Each
 * production credit gets a small contained-fit thumbnail (no crop)
 * and a one-line teaser, with a "More →" button leading to its
 * detail page where images are shown enlarged.
 */
function EventsPopup() {
  return (
    <MiniWindow title="events.dir" fileName="productions" variant="plum">
      <div className="px-3 py-3">
        <div className="mb-2 flex items-baseline justify-between">
          <h2
            className="font-pixel text-3xl leading-none text-paper md:text-4xl"
            style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.45)" }}
          >
            More Events
          </h2>
          <span className="font-mono text-sm text-paper/55">
            {production.length} files
          </span>
        </div>
        <p className="mb-3 font-bodoni text-lg italic leading-snug text-mauve">
          Other production credits — cinema festivals, exhibitions and
          grassroots initiatives.
        </p>
        <ul className="flex flex-col">
          {production.map((e) => (
            <li
              key={e.title}
              className="border-b border-plum-light/30 last:border-b-0"
            >
              <Link
                href={`/gatherings/events/${e.slug}`}
                prefetch
                className="flex items-start gap-3 py-3 transition-colors hover:bg-plum-light/20"
              >
                <div
                  className="plum-inset shrink-0 self-start overflow-hidden bg-plum-dark"
                  style={{ width: "5rem" }}
                >
                  <Image
                    src={e.image}
                    alt=""
                    width={400}
                    height={300}
                    sizes="80px"
                    className="block h-auto w-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="rounded-full border border-paper/30 bg-plum-light/15 px-3 py-0.5 font-pixel text-sm leading-none text-paper">
                      {e.role}
                    </span>
                    <span className="font-mono text-sm text-paper/65">
                      {e.year}
                    </span>
                  </div>
                  <h3 className="mt-1 font-pixel text-xl leading-tight text-paper">
                    {e.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-code-text/85">
                    {e.teaser}
                  </p>
                  <span className="plum-outset mt-2 inline-block bg-plum-light/30 px-2 py-0.5 font-pixel text-base leading-none text-mauve">
                    More →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MiniWindow>
  );
}

