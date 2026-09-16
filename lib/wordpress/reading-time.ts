import { sanitizeWpHtml, stripHtml } from "@lib/wordpress/sanitize";

const WORDS_PER_MINUTE = 200;

export function readingTimeMinutesFromHtml(html: string): number {
  const text = stripHtml(sanitizeWpHtml(html));
  if (!text) {
    return 1;
  }

  const cjkCharacters = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords =
    text
      .replace(/[\u4e00-\u9fff]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length ?? 0;
  const wordCount = latinWords + cjkCharacters;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
