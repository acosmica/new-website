import Link from "next/link";
import MediaPlayer from "@/components/experiments/MediaPlayer";
import AsciiBackdrop from "@/components/experiments/AsciiBackdrop";
import { intro, experiments } from "@/lib/experiments";

export const metadata = {
  title: "Experiments — Micaelle Lages",
};

export default function ExperimentsPage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black">
      {/* Holographic Y2K backdrop — radial cyan→magenta wash with a faint
          scanline veil so the chrome player floats over a CRT desktop. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #2d1838 0%, #150924 45%, #0a0511 80%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 75% 80%, rgba(255,126,182,0.18) 0%, transparent 45%)",
        }}
      />
      <AsciiBackdrop />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Link
        href="/"
        className="pixel-outset fixed left-4 top-4 z-50 inline-flex items-center gap-2 bg-paper px-3 py-1.5 font-pixel text-base leading-none text-ink shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-peach md:left-6 md:top-6"
      >
        <span aria-hidden>←</span> Desktop
      </Link>

      <main className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center px-3 py-6 md:px-5 md:py-8">
        <MediaPlayer experiments={experiments} intro={intro} />
      </main>
    </div>
  );
}
