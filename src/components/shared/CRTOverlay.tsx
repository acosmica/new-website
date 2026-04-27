"use client";

export default function CRTOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] crt-scanlines mix-blend-multiply opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[91] crt-vignette"
      />
    </>
  );
}
