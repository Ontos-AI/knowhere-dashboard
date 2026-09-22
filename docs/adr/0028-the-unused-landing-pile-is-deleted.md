# The unused `_(landing)` pile is deleted

ADR-0020 left the pre-1:1 Landing sitting under `app/_(landing)/` and said to leave it. It is deleted.

Its `_` prefix made it a Next.js private folder: the router drops every path part that starts with `_`, so the
69 files were never a route and never reached `.next/server/app`. It was invisible, not merely unrouted —
`/comparison/<product>` answered 404 while the pile's footer offered a newsletter form whose submit handler was
a `setTimeout`. Keep the tree only if something reads it; nothing did except a path list in
`lib/knowhere-sdk-examples.test.ts`.

Deleting it changes no URL, so the rule that ADR-0020 actually protected still holds: the live
`/versus/[product]` stub stays a stub, is not Brand-restyled, and the old pages are not revived.

The files that named the pile follow it out: the path list in `lib/knowhere-sdk-examples.test.ts` (the three
SDK examples that do render carry its assertions on their own), and the **Versus** term in `CONTEXT.md`.
