"use client";

import { useEffect, useState } from "react";

export function useScale(): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--scale")
        .trim();
      const parsed = parseFloat(raw);
      setScale(Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
    };

    read();

    let timer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(read, 100);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return scale;
}
