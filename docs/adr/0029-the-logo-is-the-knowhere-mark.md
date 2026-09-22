---
status: superseded by ADR-0030
---

# The logo is the Knowhere mark, not the prototype's

The site and the Dashboard carried the Design Prototype's stepped mark as the Knowhere logo. They carry the
Knowhere mark again: the starburst supplied as `knowhere-logo-nowords.svg`, drawn in ink and inverted by
CSS where the surface is dark.

This is the one place where the 1:1 rule yields to brand ownership. The prototype is the reference for layout,
type, and colour; it is not the owner of the identity. The mark it shipped is a stand-in, and the mark the
brand ships wins.

The wordmark does not change. The supplied asset has no words, the lockups already carry the site's own
"Knowhere", and the two read as one lockup.

## What moved

| Asset | Before | Now |
| --- | --- | --- |
| `public/images/site-chrome/knowhere-mark.svg` | 37x42 stepped mark | 45x42 starburst, `#171717` |
| `public/images/site-chrome/knowhere-footer-mark.svg` | same drawing, `#F0F2E6` | same starburst, `#F0F2E6` |
| `public/images/site-chrome/knowhere-back-to-top.svg` | mark plus wordmark | the mark path becomes the starburst, the eight wordmark paths are untouched |
| `public/assets/knowhere-favicon.svg` | stepped mark in a 42 box | starburst, same 42 box and same dark-mode `prefers-color-scheme` rule |
| `public/favicon.ico` | 16/32/48 stepped mark | 16/32/48 starburst, same three PNG-embedded entries |
| `public/images/knowhere/app-icon.png` | 680x778 ink on white | 778x731 ink on white |

`components/brand/knowhere-brand.tsx`, the Dashboard's mobile sidebar brand, and the site footer keep their
existing boxes; the mark's aspect moves from 0.881 to 1.071, so the boxes that pin both width and height
(`.kh-footer-brand img` stays 37x42 with `object-fit: contain`) letterbox instead of stretching.

The lockup is the constraint that shaped the rest: `knowhere-back-to-top.svg` keeps its `0 0 132 52` viewBox
and its wordmark, so the header, the login chrome, and the sidebar brand keep their 112px width and their
vertical rhythm. The starburst is laid into the mark's old slot (16.01 wide by 18.45 tall) with a contain fit,
which lands its ink height on the wordmark's cap height.
