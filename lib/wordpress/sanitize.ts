const SCRIPT_LIKE_TAGS =
  /<(script|style|noscript|iframe|object|embed|link|meta)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const SCRIPT_LIKE_EMPTY_TAGS =
  /<(script|style|noscript|iframe|object|embed|link|meta)\b[^>]*\/?>/gi;
const EVENT_HANDLER_ATTR = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_ATTR = /\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi;

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    })
    .replace(/&#(\d+);/g, (_, digits: string) => {
      const codePoint = Number.parseInt(digits, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    });
}

export function decodeWpText(value: string): string {
  return decodeHtmlEntities(stripHtml(value)).replace(/\s+/g, " ").trim();
}

export function sanitizeWpHtml(html: string): string {
  return html
    .replace(SCRIPT_LIKE_TAGS, "")
    .replace(SCRIPT_LIKE_EMPTY_TAGS, "")
    .replace(EVENT_HANDLER_ATTR, "")
    .replace(JAVASCRIPT_URL_ATTR, "");
}
