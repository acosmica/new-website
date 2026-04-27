"use client";

import { motion, useDragControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { snippets, type Token } from "@/lib/codeSnippets";

// "Dreamy terminal" — every token hue drawn from the wallpaper palette so
// the code panel feels like part of the desktop's visual family.
const TOKEN_COLOR: Record<Token["color"], string> = {
  default: "text-[#ead9e8]",       // soft lavender
  keyword: "text-[#efb3c3]",       // blush
  string: "text-[#f2c9a8]",        // peach
  number: "text-[#a4d9c5]",        // mint
  comment: "text-[#a996b8] italic",// muted violet
  fn: "text-[#ead9a0]",            // goldlite
  prop: "text-[#bfe0d2]",          // seafoam
  punct: "text-[#c9a5d4]",         // mauve
};

const TYPE_SPEED_MS = 22;
const HOLD_ON_COMPLETE_MS = 1600;

/**
 * Draggable floating code panel. Types a snippet character-by-character,
 * holds briefly on completion, then cycles to the next snippet.
 */
export default function CodePanel() {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const snippet = snippets[snippetIdx];
  const fullLength = snippet.tokens.reduce((acc, tok) => acc + tok.text.length, 0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setCharIdx(fullLength);
      return;
    }

    if (charIdx < fullLength) {
      const id = setTimeout(() => setCharIdx((i) => i + 1), TYPE_SPEED_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setCharIdx(0);
      setSnippetIdx((i) => (i + 1) % snippets.length);
    }, HOLD_ON_COMPLETE_MS);
    return () => clearTimeout(id);
  }, [charIdx, fullLength, snippetIdx]);

  const rendered = renderTokens(snippet.tokens, charIdx);
  const isTyping = charIdx < fullLength;

  return (
    <>
      <div ref={constraintsRef} className="pointer-events-none fixed inset-0 z-[10]" />
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.05}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pixel-outset absolute left-8 top-16 z-30 w-[min(22rem,80vw)] bg-code-bg"
      >
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex h-8 cursor-grab items-center gap-2 px-2 font-pixel text-lg leading-none text-[#ead9e8] active:cursor-grabbing"
          style={{
            background:
              "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
          }}
        >
          <span
            aria-hidden
            className="inline-block size-3 bg-mint pixelated pixel-outset"
          />
          <span className="truncate">{snippet.title}</span>
          <span className="ml-auto font-mono text-[10px] uppercase opacity-70">
            {snippet.lang}
          </span>
        </div>
        <pre className="pixel-inset m-1 h-48 overflow-hidden bg-code-gutter p-3 font-mono text-[12px] leading-relaxed text-[#ead9e8]">
          <code className="whitespace-pre-wrap">
            {rendered}
            <span
              className={`inline-block w-[7px] h-[14px] -mb-[2px] align-middle bg-[#efb3c3] ${
                isTyping ? "animate-pulse" : ""
              }`}
              aria-hidden
            />
          </code>
        </pre>
      </motion.div>
    </>
  );
}

function renderTokens(tokens: Token[], limit: number) {
  const out: React.ReactNode[] = [];
  let remaining = limit;
  for (let i = 0; i < tokens.length; i++) {
    if (remaining <= 0) break;
    const tok = tokens[i];
    const slice = tok.text.slice(0, remaining);
    out.push(
      <span key={i} className={TOKEN_COLOR[tok.color]}>
        {slice}
      </span>,
    );
    remaining -= tok.text.length;
  }
  return out;
}
