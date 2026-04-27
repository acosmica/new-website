import type { ReactNode } from "react";

/**
 * Tiny 90s-style window used to compose the gatherings cluster. Two
 * variants — the dreamy-terminal plum used for festival features and
 * directory listings, and a paper sticky-note used for the intro card.
 *
 * The `tilt` prop wraps the whole window in a CSS rotation so the
 * cluster feels hand-pinned rather than aligned.
 */
type Variant = "plum" | "paper";

const titleBarStyle: Record<Variant, string> = {
  plum: "text-code-text",
  paper: "bg-paper text-ink",
};

const titleBarGradient: Record<Variant, React.CSSProperties | undefined> = {
  plum: {
    background:
      "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
  },
  paper: undefined,
};

const chromeClass: Record<Variant, string> = {
  plum: "plum-outset bg-plum text-code-text",
  paper: "pixel-outset bg-paper text-ink",
};

const bevel: Record<Variant, string> = {
  plum: "plum-outset",
  paper: "pixel-outset",
};

export default function MiniWindow({
  title,
  fileName,
  variant = "plum",
  tilt = 0,
  className = "",
  children,
  footer,
}: {
  title: string;
  fileName?: string;
  variant?: Variant;
  /** Degrees of rotation applied to the window. Defaults to 0. */
  tilt?: number;
  className?: string;
  children: ReactNode;
  /** Optional footer strip — used for "Read more →" buttons or
   *  metadata. Sits beneath the body inside the bevel. */
  footer?: ReactNode;
}) {
  return (
    <div
      className={`${chromeClass[variant]} relative flex flex-col ${className}`}
      style={{
        transform: `rotate(${tilt}deg)`,
        boxShadow:
          variant === "paper"
            ? "1px 2px 0 rgba(0,0,0,0.08), 4px 8px 16px rgba(0,0,0,0.25)"
            : "6px 8px 0 rgba(0,0,0,0.35)",
      }}
    >
      <div
        className={`flex h-7 select-none items-center gap-1.5 px-1 ${titleBarStyle[variant]}`}
        style={titleBarGradient[variant]}
      >
        <span
          aria-hidden
          className={`inline-block size-3 ${
            variant === "plum"
              ? "bg-mauve plum-outset"
              : "bg-blush pixel-outset"
          }`}
        />
        <span className="flex min-w-0 flex-1 items-baseline gap-1.5 truncate font-pixel text-base leading-none">
          <span className="truncate">{title}</span>
          {fileName && (
            <span className="truncate text-xs opacity-75">— {fileName}</span>
          )}
        </span>
        <div className="flex items-center gap-0.5">
          <Btn label="_" v={variant} />
          <Btn label="▢" v={variant} />
          <Btn label="✕" v={variant} hot />
        </div>
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
      {footer && (
        <div
          className={`${bevel[variant] === "plum-outset" ? "plum-inset" : "pixel-inset"} ${
            variant === "plum" ? "bg-code-gutter" : "bg-paper"
          } px-2 py-1.5`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function Btn({ label, v, hot = false }: { label: string; v: Variant; hot?: boolean }) {
  const base =
    v === "plum" ? "plum-outset" : "pixel-outset";
  const bg = hot
    ? "bg-hot text-paper"
    : v === "plum"
      ? "bg-plum text-code-text"
      : "bg-paper text-ink";
  return (
    <span
      aria-hidden
      className={`${base} grid size-4 place-items-center font-pixel text-xs leading-none ${bg}`}
    >
      <span className="-mt-0.5">{label}</span>
    </span>
  );
}
