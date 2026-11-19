import { sanitizeWpHtml, stripHtml } from "@lib/blog-email/html";
import { BLOG_EMAIL_BODY_BYTE_LIMIT, type BlogEmailPost } from "@lib/blog-email/types";

const URL_ATTRIBUTE = /(\s(?:src|href)\s*=\s*)(['"])([^'"]+)\2/gi;
const SRCSET_ATTRIBUTE = /(\ssrcset\s*=\s*)(['"])([^'"]+)\2/gi;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function originBase(origin: string): string {
  return origin.endsWith("/") ? origin : `${origin}/`;
}

export function rewriteWordpressUrl(value: string, origin: string): string {
  const trimmed = value.trim();
  if (
    trimmed.startsWith("#") ||
    /^mailto:/i.test(trimmed) ||
    /^data:/i.test(trimmed) ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return value;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  try {
    return new URL(trimmed, originBase(origin)).toString();
  } catch {
    return value;
  }
}

function rewriteSrcset(value: string, origin: string): string {
  return value
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) {
        return part;
      }

      const [url, ...descriptors] = trimmed.split(/\s+/);
      if (!url) {
        return part;
      }

      return [rewriteWordpressUrl(url, origin), ...descriptors].join(" ");
    })
    .join(", ");
}

export function rewriteWordpressHtml(html: string, origin: string): string {
  const withSrcset = html.replace(
    SRCSET_ATTRIBUTE,
    (_match, prefix: string, quote: string, value: string) => {
      return `${prefix}${quote}${rewriteSrcset(value, origin)}${quote}`;
    }
  );

  return withSrcset.replace(
    URL_ATTRIBUTE,
    (_match, prefix: string, quote: string, value: string) => {
      return `${prefix}${quote}${rewriteWordpressUrl(value, origin)}${quote}`;
    }
  );
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function preheaderFromExcerpt(excerpt: string, title: string): string {
  const text = collapseWhitespace(excerpt) || title;
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

export function renderBlogEmail(input: {
  readonly post: BlogEmailPost;
  readonly unsubscribeUrl: string;
  readonly wordpressOrigin: string;
}): {
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly truncated: boolean;
} {
  const subject = collapseWhitespace(input.post.title);
  const sanitized = sanitizeWpHtml(input.post.contentHtml);
  const rewritten = rewriteWordpressHtml(sanitized, input.wordpressOrigin);
  const truncated = Buffer.byteLength(rewritten, "utf8") > BLOG_EMAIL_BODY_BYTE_LIMIT;
  const permalink = escapeHtml(input.post.permalinkUrl);
  const unsubscribe = escapeHtml(input.unsubscribeUrl);
  const preheader = escapeHtml(preheaderFromExcerpt(input.post.excerpt, subject));
  const coverUrl = input.post.coverUrl
    ? escapeHtml(rewriteWordpressUrl(input.post.coverUrl, input.wordpressOrigin))
    : null;
  const articleHtml = truncated
    ? `<p style="margin:0 0 16px;color:#09090b;font-size:16px;line-height:1.6;">${escapeHtml(input.post.excerpt)}</p>
       <p style="margin:0 0 24px;"><a href="${permalink}" style="color:#0a6351;">Continue reading on Knowhere</a></p>`
    : `<div style="color:#09090b;font-size:16px;line-height:1.6;">${rewritten}</div>
       <p style="margin:24px 0 0;"><a href="${permalink}" style="color:#0a6351;">Read on Knowhere</a></p>`;
  const coverHtml = coverUrl
    ? `<img src="${coverUrl}" alt="${escapeHtml(input.post.coverAlt)}" style="display:block;max-width:100%;height:auto;margin:0 0 24px;border:0;" />`
    : "";
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <p style="margin:0 0 24px;font-size:14px;letter-spacing:0.04em;color:#0a6351;">Knowhere</p>
    <h1 style="margin:0 0 24px;font-size:28px;line-height:1.3;color:#09090b;">${escapeHtml(subject)}</h1>
    ${coverHtml}
    ${articleHtml}
    <p style="margin:32px 0 0;padding-top:24px;border-top:1px solid #e5e5e5;font-size:12px;line-height:1.5;color:#666666;">
      <a href="${unsubscribe}" style="color:#666666;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
  const bodyText = truncated
    ? `${collapseWhitespace(input.post.excerpt)}\n\nContinue reading on Knowhere: ${input.post.permalinkUrl}`
    : `${stripHtml(rewritten) || collapseWhitespace(input.post.excerpt)}\n\nRead on Knowhere: ${input.post.permalinkUrl}`;
  const text = `${subject}\n\n${bodyText}\n\nUnsubscribe: ${input.unsubscribeUrl}`;

  return { html, subject, text, truncated };
}
