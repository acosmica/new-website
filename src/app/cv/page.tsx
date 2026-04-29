import Window from "@/components/windows/Window";
import Link from "next/link";
import { cv, type Role as RoleData } from "@/lib/cv";
import CvBackdrop from "@/components/cv/CvBackdrop";
import CvRequestButton from "@/components/cv/CvRequestButton";

export const metadata = {
  title: "CV — Micaelle Lages",
};

/**
 * The CV page renders entirely from `content/cv.md` — see that file
 * (and `src/lib/cv.ts`) to edit the text. No content lives in this
 * file; it's pure presentation.
 */
export default function CVPage() {
  return (
    <div className="relative min-h-[100dvh] w-full p-4 pb-16 md:p-8 md:pb-16">
      <div aria-hidden className="fixed inset-0 -z-20 bg-plum" />
      <CvBackdrop zIndex={-10} opacity={0.7} />
      <Window
        title="CV"
        fileName="micaelle-lages-cv.rtf"
        layoutId="folder-cv"
        accent="plum"
        className="relative z-10 max-w-3xl"
      >
        <div className="plum-inset flex h-9 items-center justify-between bg-code-gutter px-3 font-pixel text-base text-code-text">
          <Link
            href="/"
            className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
          >
            ← Back
          </Link>
          <CvRequestButton />
        </div>

        <div
          className="overflow-y-auto p-8 font-serif text-code-text"
          style={{
            maxHeight: "calc(100dvh - 10rem)",
            background:
              "linear-gradient(180deg, #2d1845 0%, #251a38 45%, #1a0f2c 100%)",
          }}
        >
          <header className="mb-8 border-b-2 border-code-text/30 pb-4">
            <h1 className="font-pixel text-5xl leading-none text-code-text">
              {cv.name}
            </h1>
            <p className="mt-2 text-xl">{cv.title}</p>
            <p className="mt-1 text-base text-code-text/70">
              <a className="underline hover:text-mauve" href={`mailto:${cv.email}`}>
                {cv.email}
              </a>
              {cv.location && (
                <span className="ml-3 text-code-text/55">· {cv.location}</span>
              )}
            </p>
          </header>

          {cv.summary.length > 0 && (
            <Section title="Summary">
              {cv.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Section>
          )}

          {cv.experience.length > 0 && (
            <Section title="Experience">
              {cv.experience.map((r, i) => (
                <Role key={i} role={r} />
              ))}
            </Section>
          )}

          {cv.education.length > 0 && (
            <Section title="Education">
              {cv.education.map((r, i) => (
                <Role key={i} role={r} />
              ))}
            </Section>
          )}

          {cv.skills.length > 0 && (
            <Section title="Skills">
              <p className="flex flex-wrap gap-1.5">
                {cv.skills.map((s) => (
                  <span
                    key={s}
                    className="plum-outset bg-plum px-2 py-0.5 font-pixel text-base leading-none text-code-text"
                  >
                    {s}
                  </span>
                ))}
              </p>
            </Section>
          )}
        </div>
      </Window>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 font-pixel text-3xl leading-none text-code-text">
        {title}
      </h2>
      <div className="space-y-3 text-lg leading-relaxed text-code-text/90">
        {children}
      </div>
    </section>
  );
}

function Role({ role }: { role: RoleData }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-code-text">
          {role.role}
          {role.org && (
            <span className="font-normal text-code-text/70"> — {role.org}</span>
          )}
        </h3>
        {role.period && (
          <span className="font-mono text-base text-code-text/60">{role.period}</span>
        )}
      </div>
      {role.bullets && role.bullets.length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-code-text/85">
          {role.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
