"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const FORMSPREE_FORM_ID = "mpqbzojp";

export default function CvRequestButton() {
  const [open, setOpen] = useState(false);
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && !state.succeeded) inputRef.current?.focus();
  }, [open, state.succeeded]);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (e.target instanceof Node && !popRef.current.contains(e.target)) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (state.succeeded) {
      const t = window.setTimeout(() => close(), 2200);
      return () => window.clearTimeout(t);
    }
  }, [state.succeeded]);

  return (
    <div ref={popRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="plum-outset bg-peach px-2 py-0.5 font-pixel text-base leading-none text-ink hover:bg-blush"
      >
        Request Full CV
      </button>

      {open && (
        <div
          className="plum-outset absolute right-0 top-[calc(100%+6px)] z-30 w-[320px] bg-paper p-3 font-pixel text-base text-ink shadow-[4px_4px_0_rgba(0,0,0,0.45)]"
        >
          {state.succeeded ? (
            <p
              role="status"
              aria-live="polite"
              className="leading-snug"
              style={{ color: "#4a7a3e" }}
            >
              Got it — I&apos;ll send the full CV to that address shortly.
            </p>
          ) : (
            <>
              <p className="mb-2 leading-snug">
                Drop your email and I&apos;ll send the full CV.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={inputRef}
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@somewhere.com"
                  disabled={state.submitting}
                  className="plum-inset w-full bg-white px-2 py-1 font-mono text-sm text-ink outline-none placeholder:text-ink/40 disabled:opacity-60"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-sm leading-snug"
                  style={{ color: "#9d2a1f" }}
                />
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="plum-outset bg-peach px-2 py-1 text-ink hover:bg-blush disabled:cursor-wait disabled:opacity-70"
                >
                  {state.submitting ? "Sending…" : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
