"use client";

import { useState } from "react";
import Folder from "./Folder";
import ContactWindow from "./ContactWindow";

const FOLDERS = [
  { href: "/work", label: "Work", accent: "peach" as const, id: "folder-work" },
  { href: "/experiments", label: "Experiments", accent: "seafoam" as const, id: "folder-experiments" },
  { href: "/gatherings", label: "Gatherings", accent: "goldlite" as const, id: "folder-gatherings" },
  { href: "/cv", label: "CV", accent: "mint" as const, id: "folder-cv" },
  { label: "Contact", accent: "blush" as const, id: "folder-contact" },
  { href: "/about", label: "About", accent: "mauve" as const, id: "folder-about" },
];

export default function DesktopFolders() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <div className="absolute right-10 top-10 bottom-16 z-30 flex flex-col items-end gap-8">
        {FOLDERS.map((f) =>
          f.label === "Contact" ? (
            <Folder
              key={f.id}
              label={f.label}
              accent={f.accent}
              layoutId={f.id}
              onClick={() => setContactOpen(true)}
            />
          ) : (
            <Folder
              key={f.id}
              href={f.href}
              label={f.label}
              accent={f.accent}
              layoutId={f.id}
            />
          ),
        )}
      </div>
      <ContactWindow open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
