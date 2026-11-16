---
status: amended by ADR-0031
---

# Landing carries the newsletter prompt again, on Landing's own tokens

ADR-0021 removed the subscribe prompt because the Design Prototype has none. The prompt is back, so that
removal is reversed: it is still an Addition, and it still must not impersonate prototype chrome.

The rule that replaces 0021's prohibition is how the prompt is styled, not whether it exists:

- `app/(landing)/_components/newsletter-subscribe-prompt.css` declares no literal colour of any kind. It
  reads the tokens `.landing-page` already declares — `--control-surface`, `--control-border`,
  `--control-border-hover`, `--control-black-surface`, `--control-focus`, `--control-motion-duration`,
  `--radius-card`, `--radius-control`, `--radius-compact`, `--ink`, `--muted`, `--page-primary` — so the
  Landing dark ramp in `landing.css` and the brand ramp in `kh-site.css` both reach it without a second
  palette to maintain.
- `/newsletter/confirm` and `/newsletter/unsubscribe` keep working for links already in inboxes.
- The prompt still dismisses itself for seven days through `NEWSLETTER_DISMISS_STORAGE_KEY`, so restoring it
  does not restore the nagging.

`lib/landing-figma-design.test.ts` asserts the mount, the token set, and the absence of any literal colour, so
the prompt cannot drift off the Landing surface or lose its dismissal.
