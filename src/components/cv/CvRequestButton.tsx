"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { requestFullCv } from "@/app/cv/actions";

/**
 * Tiny "Request Full CV" affordance for the CV page toolbar. Click
 * the button → a popover slides down with an email input + submit.
 * Submission posts to a Server Action that appends the email to
 * `data/cv-requests.jsonl` for later follow-up.
 */
export default function CvRequestButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Focus the input when the popover opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    setFeedback(null);
  };

  // Click outside / Escape to close.
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (typeof navigator !== "undefined") {
      data.set("ua", navigator.userAgent ?? "");
    }
    startTransition(async () => {
      const res = await requestFullCv(data);
      if (res.ok) {
        setFeedback({ type: "ok", text: res.message });
        // Auto-close shortly after a successful submit.
        window.setTimeout(() => close(), 1800);
      } else {
        setFeedback({ type: "err", text: res.message });
      }
    });
  };

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
          <p className="mb-2 leading-snug">
            Drop your email and I&apos;ll send the full CV.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@somewhere.com"
              disabled={pending}
              className="plum-inset w-full bg-white px-2 py-1 font-mono text-sm text-ink outline-none placeholder:text-ink/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={pending}
              className="plum-outset bg-peach px-2 py-1 text-ink hover:bg-blush disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </form>
          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className="mt-2 text-sm leading-snug"
              style={{
                color: feedback.type === "ok" ? "#4a7a3e" : "#9d2a1f",
              }}
            >
              {feedback.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
