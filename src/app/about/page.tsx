import Window from "@/components/windows/Window";
import Corkboard from "@/components/about/Corkboard";
import AsciiBackdrop from "@/components/about/AsciiBackdrop";
import StampStudio from "@/components/about/StampStudio";
import Link from "next/link";

export const metadata = {
  title: "About — Micaelle Lages",
};

export default function AboutPage() {
  return (
    <div className="relative w-full p-0 pb-11 md:p-4 md:pb-12">
      {/* Deep-plum fullscreen backdrop with the animated ASCII field on top.
          The Window sits centered with max-w-6xl, so on desktop widths the
          ASCII shimmer shows in the side gutters — framing the "paper"
          rather than competing with it. */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-plum">
        <AsciiBackdrop />
      </div>

      <Window
        title="About"
        fileName="moodboard.scrap"
        layoutId="folder-about"
        accent="plum"
        className="max-w-[92rem]"
      >
        <div className="plum-inset flex h-9 items-center gap-3 bg-code-gutter px-3 font-pixel text-base text-code-text">
          <Link
            href="/"
            className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
          >
            ← Back
          </Link>
        </div>

        <Corkboard />
      </Window>

      <StampStudio />
    </div>
  );
}
