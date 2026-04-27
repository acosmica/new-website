"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Auto-scrolling slideshow used at the top of festival detail pages.
 * Cycles through the provided image sources every `interval` ms with
 * a soft cross-fade. Slides use `object-cover` so each image fills
 * the hero frame completely (zoomed in if needed) — the assumption
 * is that hero slides are curated horizontals where minor edge crop
 * is acceptable in exchange for an even, edge-to-edge presentation.
 */
export default function HeroSlideshow({
  images,
  interval = 4000,
}: {
  images: string[];
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % images.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div
      className="plum-inset relative w-full overflow-hidden bg-code-gutter"
      style={{ height: "min(80vh, 720px)" }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Slide indicator dots — pixel-styled, centered along the bottom. */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`plum-outset size-3 transition-colors ${
                i === idx ? "bg-mauve" : "bg-plum-light/40 hover:bg-plum-light/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
