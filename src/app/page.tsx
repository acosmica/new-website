import Wallpaper from "@/components/desktop/Wallpaper";
import DesktopFolders from "@/components/desktop/DesktopFolders";
import CodePanel from "@/components/desktop/CodePanel";
import HeroText from "@/components/desktop/HeroText";
import AsciiFlowerField from "@/components/desktop/AsciiFlowerField";
import MobileHome from "@/components/desktop/MobileHome";

export default function Home() {
  return (
    <>
      <MobileHome />
      <main className="relative hidden h-[100dvh] w-full overflow-hidden md:block">
        <Wallpaper />

      {/* Glitchy ASCII flowers spawning across the desktop */}
      <AsciiFlowerField />

      {/* Hero text — Bodoni typewriter with red halftone glitch overlay */}
      <HeroText />

      {/* Folders — right-hand desktop column. Contact opens as a floating
          window on top of the desktop instead of routing to its own page. */}
      <DesktopFolders />

        {/* Live-typing code panel — draggable, floats over wallpaper */}
        <CodePanel />
      </main>
    </>
  );
}
