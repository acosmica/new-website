"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Behance", href: "https://behance.net/" },
];

type Props = { open: boolean; onClose: () => void };

/**
 * Floating contact window — opens on top of the desktop, click outside
 * (anywhere on the transparent backdrop) or press Escape to close. Uses
 * the plum / mint / peach palette to stay inside the desktop visual family.
 */
export default function ContactWindow({ open, onClose }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            // Close only if the mousedown started on the backdrop itself,
            // not on the window bubbling up.
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[90] grid place-items-center p-4"
          style={{ backgroundColor: "rgba(18,10,31,0.25)" }}
          role="presentation"
        >
          <motion.div
            ref={windowRef}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="plum-outset relative w-full max-w-md bg-plum text-code-text shadow-[6px_6px_0_rgba(0,0,0,0.5)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
          >
            <div
              className="flex h-9 items-center gap-2 px-2 font-pixel text-lg leading-none text-code-text"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
              }}
            >
              <span
                aria-hidden
                className="inline-block size-4 bg-blush pixel-outset pixelated"
              />
              <div
                id="contact-title"
                className="flex min-w-0 flex-1 items-baseline gap-2"
              >
                <span className="truncate">Contact</span>
                <span className="truncate text-sm opacity-70">
                  — new-message.eml
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TitleBtn label="_" onClick={onClose} />
                <TitleBtn label="▢" onClick={onClose} />
                <TitleBtn label="✕" onClick={onClose} hot />
              </div>
            </div>

            <div className="plum-inset mx-2 mt-2 flex h-8 items-center bg-code-gutter px-2 font-pixel text-sm leading-none text-code-text/80">
              <span className="truncate">To: lagesmica@gmail.com</span>
            </div>

            <div className="space-y-5 p-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <p className="font-pixel text-3xl leading-tight text-code-text">
                    Say hi —
                  </p>
                  <p className="text-sm leading-relaxed text-code-text/80">
                    I am open for jobs opportunities, freelance, creative
                    projects, all things magical — or if you just want to talk
                    about your favorite tv show.
                  </p>
                </div>

                {/* Small 3:4 portrait pinned to the window with a paper clip
                    drawn in SVG. Figure has a negative top margin so the
                    clip visibly overlaps the "To:" email bar above. */}
                <figure className="relative -mt-8 w-[108px] shrink-0 translate-x-10 -rotate-3">
                  <div className="plum-outset relative aspect-[3/4] overflow-hidden bg-paper shadow-[3px_4px_0_rgba(0,0,0,0.45)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/contact/micaelle-photo.jpg"
                      alt="Micaelle Lages"
                      className="block h-full w-full object-cover"
                    />
                  </div>
                  <svg
                    aria-hidden
                    viewBox="0 0 40 64"
                    className="pointer-events-none absolute -top-7 left-1/2 h-12 w-7 -translate-x-1/2 rotate-6 text-code-text drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]"
                  >
                    <path
                      d="M 14 8
                         C 14 3, 26 3, 26 8
                         L 26 50
                         C 26 58, 14 58, 14 50
                         L 14 18
                         C 14 14, 22 14, 22 18
                         L 22 42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </figure>
              </div>

              <Field label="email">
                <a
                  href="mailto:lagesmica@gmail.com"
                  className="plum-outset inline-flex items-center gap-1.5 bg-plum px-2.5 py-1 font-mono text-sm text-[#ead9a0] hover:bg-plum-light/50"
                >
                  <span aria-hidden className="inline-block size-2 bg-sun pixelated" />
                  lagesmica@gmail.com
                </a>
              </Field>

              <Field label="find me at:">
                <div className="flex flex-wrap gap-1.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="plum-outset bg-plum px-2.5 py-1 font-pixel text-base leading-none text-code-text hover:bg-plum-light/50"
                    >
                      {s.label}
                      <span className="ml-1 opacity-70" aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              </Field>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TitleBtn({
  label,
  onClick,
  hot,
}: {
  label: string;
  onClick: () => void;
  hot?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`plum-outset grid size-6 place-items-center font-pixel text-base leading-none ${
        hot ? "bg-hot text-paper" : "bg-plum text-code-text"
      } active:[box-shadow:inset_1px_1px_0_0_#000,inset_-1px_-1px_0_0_rgba(234,217,232,0.6)]`}
      aria-label={label === "✕" ? "close window" : label}
    >
      <span className="-mt-0.5">{label}</span>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="font-pixel text-sm uppercase leading-none tracking-wider text-code-text/60">
        {label}
      </div>
      {children}
    </div>
  );
}
