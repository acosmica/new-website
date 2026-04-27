import Image from "next/image";
import Link from "next/link";
import MiniWindow from "./MiniWindow";
import type { EducationalEntry } from "@/lib/gatherings";

/**
 * Educational mini-window — header in a 2-col grid (title left, intro
 * right), then a 3-col grid of preview cards. Each card links to its
 * own detail page at /gatherings/educational/[slug].
 */
export default function EducationalSection({
  educational,
  intro,
}: {
  educational: EducationalEntry[];
  intro: string;
}) {
  return (
    <MiniWindow title="educational.bat" fileName="ledger" variant="plum">
      <div className="px-5 py-6 md:px-7 md:py-8">
        {/* Header — 2-col: oversized title left, intro right (which
            splits into a 2-col paragraph itself if there's room). */}
        <header className="grid items-start gap-6 border-b border-plum-light/30 pb-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
          <div>
            <span className="font-pixel text-sm uppercase tracking-[0.22em] text-paper/55">
              C:\users\micaelle\edu\ &gt; dir
            </span>
            <h2
              className="mt-1 font-pixel text-6xl leading-[0.85] text-paper md:text-7xl lg:text-8xl"
              style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.45)" }}
            >
              Educational
            </h2>
          </div>
          <p className="font-sans text-base leading-relaxed text-code-text/90 md:columns-2 md:gap-8 md:text-[1.05rem]">
            {intro}
          </p>
        </header>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 md:grid-cols-3 md:gap-5">
          {educational.map((e) => (
            <li key={e.slug} className="h-full">
              <Link
                href={`/gatherings/educational/${e.slug}`}
                prefetch
                className="plum-inset group flex h-full w-full flex-col bg-plum-dark px-3 py-3 text-left transition-colors hover:bg-plum-light/20"
              >
                <div className="plum-inset relative mb-3 w-full overflow-hidden bg-plum-dark">
                  <Image
                    src={e.previewImage ?? e.images[0]}
                    alt=""
                    width={1600}
                    height={1200}
                    sizes="(max-width: 768px) 100vw, 28vw"
                    className="block h-auto w-full"
                  />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="plum-outset bg-hot px-1.5 py-0.5 font-pixel text-sm leading-none text-paper">
                    {e.year}
                  </span>
                  <span className="font-pixel text-sm uppercase tracking-[0.16em] text-paper/55">
                    {e.kind}
                  </span>
                </div>
                <h3 className="mt-2 font-pixel text-xl leading-tight text-paper">
                  {e.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-code-text/85">
                  {e.teaser}
                </p>
                <span className="mt-auto inline-block self-start pt-3 font-pixel text-base leading-none text-mauve transition-colors group-hover:text-blush">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MiniWindow>
  );
}
