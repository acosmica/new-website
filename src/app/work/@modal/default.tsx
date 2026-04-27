// Default content for the @modal parallel slot — when no intercepting
// route matches (e.g. on /work), render nothing. Required by Next.js
// parallel routing so a direct navigation doesn't 404 the slot.
export default function Default() {
  return null;
}
