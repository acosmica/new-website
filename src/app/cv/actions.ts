"use server";

import fs from "node:fs/promises";
import path from "node:path";

/**
 * Persists incoming "request full CV" emails as JSON-lines so the
 * site owner can review them later. Each line: `{ email, ts, ua }`.
 *
 * In dev / single-server prod this writes to `data/cv-requests.jsonl`
 * at the project root. On read-only/serverless environments swap this
 * out for a database, KV store, or an email forwarder (Resend, etc.).
 */
export async function requestFullCv(formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email." };
  }
  if (email.length > 254) {
    return { ok: false, message: "That email looks too long." };
  }

  const entry = {
    email,
    ts: new Date().toISOString(),
    ua: typeof formData.get("ua") === "string" ? (formData.get("ua") as string).slice(0, 200) : "",
  };

  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, "cv-requests.jsonl");
    await fs.appendFile(file, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.error("[cv-request] failed to persist", err);
    return {
      ok: false,
      message: "Couldn't save right now — try again in a moment.",
    };
  }

  return {
    ok: true,
    message: "Got it — I'll send the full CV to that address shortly.",
  };
}
