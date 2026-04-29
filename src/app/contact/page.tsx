import Window from "@/components/windows/Window";
import Link from "next/link";

export const metadata = {
  title: "Contact — Micaelle Lages",
};

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/acosmica" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/micaelle-lages-838015193/" },
];

export default function ContactPage() {
  return (
    <div className="relative grid min-h-[100dvh] w-full place-items-center p-4 pb-16 md:p-8">
      {/* Desktop wallpaper, blurred — same image as the home /bg/acosmica.jpg */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#2a1f2e]" />
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/bg/acosmica.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(18px) saturate(1.1)",
          transform: "scale(1.1)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,10,31,0.55) 0%, rgba(18,10,31,0.25) 40%, rgba(18,10,31,0.6) 100%)",
        }}
      />
      <Window
        title="Contact"
        fileName="new-message.eml"
        layoutId="folder-contact"
        accent="plum"
        className="max-w-xl"
      >
        <div className="plum-inset flex h-9 items-center gap-3 bg-code-gutter px-3 font-pixel text-base text-code-text">
          <Link
            href="/"
            className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
          >
            ← Back
          </Link>
        </div>

        <div className="space-y-5 bg-plum p-6 text-code-text">
          <p className="font-pixel text-3xl leading-tight text-code-text">
            Say hi —
          </p>

          <Field label="Email">
            <a
              href="mailto:lagesmica@gmail.com"
              className="plum-outset inline-flex items-center gap-1.5 bg-plum px-2.5 py-1 font-mono text-base text-[#ead9a0] hover:bg-plum-light/50"
            >
              <span aria-hidden className="inline-block size-2 bg-sun pixelated" />
              lagesmica@gmail.com
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
                  className="plum-outset bg-plum px-2.5 py-1 font-pixel text-lg leading-none text-code-text hover:bg-plum-light/50"
                >
                  {s.label}
                  <span className="ml-1 opacity-70" aria-hidden>↗</span>
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
      <div className="font-pixel text-lg uppercase leading-none tracking-wider text-code-text/60">
        {label}
      </div>
      {children}
    </div>
  );
}
