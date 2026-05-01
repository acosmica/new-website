import Image from "next/image";
import Link from "next/link";
import Cluster from "@/components/gatherings/Cluster";

export const metadata = {
  title: "Gatherings — Micaelle Lages",
};

/**
 * /gatherings — no outer window chrome. The cluster of mini-windows
 * floats directly above a blurred desktop backdrop made from one of
 * the festival photos, evoking a 90s OS desktop after several apps
 * have popped open at once.
 */
export default function GatheringsPage() {
  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden">
      {/* Blurred desktop backdrop ─────────────────────────────────── */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-plum-dark" />
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/gatherings/artelligent/artelligent01.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          style={{ filter: "blur(28px) saturate(1.1)" }}
          sizes="100vw"
        />
        {/* Plum tint over the blur so the page reads in-family */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, rgba(18,10,31,0.8) 0%, rgba(37,26,56,0.65) 50%, rgba(90,62,122,0.55) 100%)",
          }}
        />
        {/* Faint dot pattern over everything for the OS-desktop feel */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(245,241,230,1) 1px, transparent 1.4px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      {/* Floating "back to desktop" pill, top-left */}
      <Link
        href="/"
        className="plum-outset fixed left-4 top-4 z-50 inline-flex items-center gap-2 bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50 md:left-6 md:top-6"
      >
        <span aria-hidden>←</span> Back
      </Link>

      {/* Cluster — full bleed, scrollable */}
      <main className="mx-auto max-w-[110rem] px-4 py-16 md:px-12 md:py-24">
        <Cluster />

        <footer className="mt-20 border-t border-paper/15 pt-6 font-mono text-xs text-paper/55">
          End of session · all windows saved ✦
        </footer>
      </main>
    </div>
  );
}
