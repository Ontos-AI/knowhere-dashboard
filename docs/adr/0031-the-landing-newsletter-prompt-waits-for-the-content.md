# The Landing newsletter prompt waits for the content

ADR-0027 put the prompt back on Landing and fixed how it looks. It said nothing about when it arrives, so the
prompt mounted with the first paint and asked for an email while the Hero was still the only thing on screen.

The prompt is an Addition, so it yields to the content it sits over: it stays unmounted for
`NEWSLETTER_PROMPT_DELAY_MS` (ten seconds) after the Landing page has painted, then appears if
`NEWSLETTER_DISMISS_STORAGE_KEY` still permits it. The dismissal is read again when the wait ends, so a prompt
dismissed in another tab during those ten seconds does not arrive late on this one.

Nothing else about ADR-0027 changes: the same tokens, the same `aria-live="polite"` announce, and the same
seven-day dismissal. `lib/landing-figma-design.test.ts` now pins the delay as well as the surface, so the
prompt cannot return to the first paint.
