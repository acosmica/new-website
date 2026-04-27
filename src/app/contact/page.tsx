import Window from "@/components/windows/Window";
import Link from "next/link";

export const metadata = {
  title: "Contact — Micaelle Lages",
};

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Behance", href: "https://behance.net/" },
];

export default function ContactPage() {
  return (
    <div className="relative grid min-h-[100dvh] w-full place-items-center p-4 pb-16 md:p-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 desktop-dither opacity-70"
      />
      <Window
        title="Contact"
        fileName="new-message.eml"
        layoutId="folder-contact"
        className="max-w-lg"
      >
        <div className="plum-inset flex h-9 items-center gap-3 bg-code-gutter px-3 font-pixel text-base text-code-text">
          <Link
            href="/"
            className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
          >
            ← Back
          </Link>
        </div>

        <div className="space-y-5 bg-chrome p-6">
          <p className="font-pixel text-2xl leading-tight text-ink">
            Say hi —
          </p>
          <p className="text-base text-ink/85">
            Open to freelance briefs, collaborations, and friendly chats about
            motion, type, or color.
          </p>

          <Field label="Email">
            <a
              href="mailto:b4rretto@gmail.com"
              className="pixel-outset bg-chrome-light px-2 py-1 font-mono text-sm text-accent hover:bg-paper"
            >
              b4rretto@gmail.com
            </a>
          </Field>

          <Field label="Elsewhere">
            <div className="flex flex-wrap gap-1.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-outset bg-chrome-light px-2 py-0.5 font-pixel text-base text-ink hover:bg-paper"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </Field>
        </div>
      </Window>
    </div>
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
      <div className="font-pixel text-base leading-none text-ink/60">
        {label}
      </div>
      {children}
    </div>
  );
}
