# Knowhere Site

Public marketing presence for Knowhere: Landing, Pricing, Blog, and Login. Distinct from the signed-in Dashboard.

## Language

**Site**:
The public Knowhere marketing presence. One site with four surfaces: Landing, Pricing, Blog, and Login.
_Avoid_: Four sites, four apps, marketing sites

**Design Prototype**:
The design team's delivery of the Site. UI and UX are copied 1:1 except Latin type, which is Poppins. Content is not.
_Avoid_: Production architecture, live system, source of all data

**Type**:
Poppins for English and Latin, Frex Sans GB for Chinese, on Site and Dashboard. Geist Mono only where the Design Prototype is mono: code, section labels, and the Header primary button. Not Geist Sans.
_Avoid_: Geist Sans, Inter, system UI font (for product UI)

**UI**:
Visual presentation — layout, type, color, spacing, states, motion.
_Avoid_: Look, skin, styling (when you mean this whole layer)

**UX**:
Interaction patterns — how chrome, menus, forms, and page flows behave.
_Avoid_: Usability, experience (as a vague catch-all)

**Content**:
The values that fill the UI: menu destinations, copy, prices, articles, and other live data. Owned by the live Site, not the Design Prototype. A different menu or dataset is not a 1:1 miss.
_Avoid_: Data (as a separate layer), CMS dump

**Dashboard**:
The signed-in product. Pages: usage, buy-credits, API keys, billing, webhooks, settings. Not Site Chrome. All of those pages are restyled with Knowhere Brand in this pass.
_Avoid_: App, account, console (when you mean this product), marketing nav (on this surface)

**Claw**:
A deprecated public page. Leave it. Do not restyle it in this pass.
_Avoid_: OpenClaw, claw landing

**Versus**:
The empty `/versus/[product]` stub and the unused `_(landing)/versus` pile. Out of this pass. Leave them.
_Avoid_: Comparison page (when you mean this stub), versus app

**Newsletter**:
Confirm and unsubscribe pages for existing subscriptions. Brand-restyle those pages. No subscribe prompt on Landing — the Design Prototype does not have one.
_Avoid_: Newsletter block (on Landing), subscribe CTA

**GitHub Hop**:
`/github` on this Site. Header GitHub goes here, then on to the public repo. Acquisition captures it. Brand the interstitial. Do not point Header at github.com.
_Avoid_: GitHub (as the Header href), repo URL (as the Site path)

**Landing**:
The Site homepage.
_Avoid_: Marketing page, index, home app

**Pricing**:
A dedicated Site page at `/pricing` for plans and comparison. Distinct from any pricing block on Landing.
_Avoid_: Pricing section (when you mean this page), pricing app

**Pricing Block**:
The pricing section on Landing. A teaser that stays 1:1 with the Design Prototype. Not the Pricing page. Not addressed as `/#pricing`.
_Avoid_: Pricing (when you mean the page), /#pricing

**Site Chrome**:
The shared Header and Footer of the Site. Blog goes to `/blog` (`ctaId: blog`). Playground stays (`notebook.knowhereto.ai`, `ctaId: playground_external`). GitHub goes to `/github`. Docs keep their current `ctaId`.
_Avoid_: Nav, layout shell, app chrome

**Site Language**:
`en` or `zh` for Site Chrome, Login chrome, and marketing copy. One preference across the Site, including Blog chrome. Not Article body.
_Avoid_: next-intl, knowhere-language cookie

**Site Theme**:
`system`, `light`, or `dark`. One preference across Landing, Pricing, Blog, Login, and Dashboard. The picker is a three-option menu like the language switcher. The prototype only toggles light/dark, so this picker is an Addition.
_Avoid_: Theme toggle (as the three-way control), resolved theme (when you mean the stored choice)

**Addition**:
Site or Dashboard UI the Design Prototype does not have. Follow Knowhere Brand. Do not invent a third visual language. Transactional email and OAuth consent HTML are not Additions in this pass.
_Avoid_: Extra, enhancement, polish

**Login**:
The Site sign-in surface. Chrome is the Design Prototype's standalone Login chrome (logo, language, theme, background, form) — not Site Chrome. Which sign-in methods appear is live Content. Register, forgot-password, reset-password, verify-email, and auth callbacks use this same chrome family and Knowhere Brand.
_Avoid_: Auth app, login worker, demo form

**Blog**:
The Site's article surface at `/blog` on `knowhereto.ai`. UI and UX from the Design Prototype. The catalog is WordPress. `blog.knowhereto.ai` is an advertising access point that redirects to `/blog`, not a place we publish Article URLs.
_Avoid_: Blog host (as the canonical home), Blog app

**Article**:
A published Blog post. Title, body, author, date, categories, and media come from WordPress.
_Avoid_: Card, snapshot entry, local HTML

**WordPress**:
The CMS that owns Blog Content. Not the public Blog UI.
_Avoid_: Headless CMS (as a different product)

**Freshness**:
How soon WordPress publish, edit, and unpublish show on the Site. Within minutes, not on deploy. Unpublish or delete yields a Permalink 404.
_Avoid_: ISR, revalidate, cache TTL

**Acquisition Path**:
A Site path that records a marketing landing. Includes `/`, `/pricing`, `/blog` (including Permalinks), `/github`, `/claw`, `/versus`, and `/comparison`. Not Login.
_Avoid_: whitelist, capture list

**Permalink**:
The public URL of an Article: `/blog/YYYY/MM/DD/slug/` on `knowhereto.ai`. Old `blog.knowhereto.ai/YYYY/MM/DD/slug/` URLs redirect here. We do not publish Article URLs on the advertising host.
_Avoid_: Blog-host permalink, slug-only public URL, /articles/$slug

**Cover**:
The Article image in list and detail. The frame (crop, ratio, hover) is UI from the Design Prototype. The image is WordPress featured media.
_Avoid_: Placeholder PNG, category cover asset

**Featured**:
Articles WordPress marks sticky, shown in the Blog hero/featured layout. If none, the latest Article.
_Avoid_: Snapshot lead, hardcoded slugs

**Category**:
A WordPress topic label on Articles. The filter-bar UX is 1:1 with the Design Prototype; the labels are live Categories, not the snapshot's four names.
_Avoid_: Tag, topic, hardcoded filter

**Pagination**:
Numbered Blog list pages, 9 Articles per page, prev/next. UX from the Design Prototype. Not Load more.
_Avoid_: Load more, infinite scroll

**Recommended Articles**:
The three-up related block on Article detail. Layout from the Design Prototype. Occupants are other WordPress Articles in the same Category; fewer than three is allowed.
_Avoid_: Snapshot neighbors, padded cards

**Share**:
The Article detail social row. Layout from the Design Prototype. Each destination is that network's share of the live Permalink, not WordPress `?share=`. No copy-link control.
_Avoid_: WordPress share query, copy link
