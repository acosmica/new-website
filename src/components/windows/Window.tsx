"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Accent = "navy" | "paper" | "ink" | "plum";

type WindowProps = {
  title: string;
  fileName?: string;
  accent?: Accent;
  className?: string;
  children: ReactNode;
  /**
   * When provided, the open animation morphs from the source folder icon
   * using Framer Motion's shared layout.
   */
  layoutId?: string;
};

export default function Window({
  title,
  fileName,
  accent = "navy",
  className = "",
  children,
  layoutId,
}: WindowProps) {
  const router = useRouter();
  const isPlum = accent === "plum";

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`${
        isPlum ? "plum-outset bg-plum text-code-text" : "pixel-outset bg-chrome"
      } mx-auto flex w-full max-w-5xl flex-col overflow-hidden ${className}`}
    >
      <TitleBar
        title={title}
        fileName={fileName}
        accent={accent}
        onClose={() => router.push("/")}
      />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </motion.div>
  );
}

function TitleBar({
  title,
  fileName,
  accent,
  onClose,
}: {
  title: string;
  fileName?: string;
  accent: Accent;
  onClose: () => void;
}) {
  const isPlum = accent === "plum";

  const style: React.CSSProperties | undefined = isPlum
    ? {
        background:
          "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
      }
    : undefined;

  const bgClass = isPlum
    ? "text-code-text"
    : accent === "paper"
      ? "bg-paper text-ink"
      : accent === "ink"
        ? "bg-ink text-paper"
        : "title-bar text-paper";

  return (
    <div
      className={`flex h-9 items-center gap-2 px-1.5 ${bgClass} select-none`}
      style={style}
    >
      <span
        aria-hidden
        className={`inline-block size-4 pixelated ${
          isPlum ? "bg-mauve plum-outset" : "bg-sun pixel-outset"
        }`}
      />
      <div className="flex min-w-0 flex-1 items-baseline gap-2 font-pixel text-xl leading-none">
        <span className="truncate">{title}</span>
        {fileName && (
          <span className="truncate text-base opacity-80">— {fileName}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <TitleButton label="_" onClick={onClose} plum={isPlum} />
        <TitleButton label="▢" onClick={onClose} plum={isPlum} />
        <TitleButton label="✕" onClick={onClose} accent="hot" plum={isPlum} />
      </div>
    </div>
  );
}

function TitleButton({
  label,
  onClick,
  accent,
  plum,
}: {
  label: string;
  onClick: () => void;
  accent?: "hot";
  plum?: boolean;
}) {
  const bevel = plum ? "plum-outset" : "pixel-outset";
  const bg =
    accent === "hot"
      ? "bg-hot text-paper"
      : plum
        ? "bg-plum text-code-text"
        : "bg-chrome text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bevel} grid size-6 place-items-center font-pixel text-lg leading-none active:[box-shadow:inset_1px_1px_0_0_#000,inset_-1px_-1px_0_0_#fff] ${bg}`}
      aria-label={label === "✕" ? "close window" : label}
    >
      <span className="-mt-0.5">{label}</span>
    </button>
  );
}
