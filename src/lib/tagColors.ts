// Palette sampled from the wallpaper so every tag hashes to one of
// these pastels — used by both the filter toolbar and the tarot cards
// so a project's colour story is consistent across the /work page.
export const TAG_PALETTE = [
  "#f2c9a8", // peach
  "#efb3c3", // blush
  "#c9a5d4", // mauve
  "#a4d9c5", // mint
  "#bfe0d2", // seafoam
  "#ead9a0", // goldlite
  "#f5c542", // sun
  "#7ddc55", // lime
];

export function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[h % TAG_PALETTE.length];
}
