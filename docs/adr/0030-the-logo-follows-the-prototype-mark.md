# The logo follows the prototype mark

ADR-0029 moved the logo off the Design Prototype's stepped mark onto the Knowhere starburst. That is reversed:
the prototype's mark is the logo again, and #130 is reverted asset for asset.

The 1:1 rule holds for the identity too. The prototype is the reference for layout, type, colour, and the mark,
so a drawing supplied from outside it does not displace what the Design Prototype draws.

## What came back

| Asset | Now |
| --- | --- |
| `public/images/site-chrome/knowhere-mark.svg` | the stepped mark, drawn in ink |
| `public/images/site-chrome/knowhere-footer-mark.svg` | the same drawing, `#F0F2E6` |
| `public/images/site-chrome/knowhere-back-to-top.svg` | the prototype's mark plus the wordmark |
| `public/assets/knowhere-favicon.svg` | the stepped mark in the `0 0 42 42` box |
| `public/favicon.ico` | back to the previous 16/32/48 entries |
| `public/images/knowhere/app-icon.png` | the previous drawing on white |

`components/brand/knowhere-brand.tsx`, the Dashboard's mobile sidebar brand, and the site footer return to the
37x42 mark box. All ten files are byte-identical to their pre-#130 content.

The mark's aspect goes back from 1.071 to 0.881, which is the aspect of the boxes it was drawn for: the footer's
`37x42` pin and the lockup's mark slot fit the drawing again instead of letterboxing a wider one inside it.

Nothing else about #130 survives. The wordmark was never in scope, and it still is not.
