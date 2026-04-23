import { GenericComponentsShowcase } from "@app/design-system/_components/generic-components-showcase";
import { TokenSection } from "@app/design-system/_components/token-section";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { FormPreview } from "@components/ui/form-preview";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  BACKDROP_BLUR_TOKENS,
  BLUR_TOKENS,
  BREAKPOINT_TOKENS,
  COLOR_FAMILIES,
  CURSOR_TOKENS,
  FONT_WEIGHT_TOKENS,
  INSET_SHADOW_TOKENS,
  MAX_WIDTH_TOKENS,
  OPACITY_TOKENS,
  RADIUS_TOKENS,
  type ScaleToken,
  SHADOW_TOKENS,
  SPACING_TOKENS,
  TYPOGRAPHY_TOKENS,
} from "@lib/design-system/tokens";
import { cn } from "@lib/utils";

const getPxValue = (value: string) => {
  const pxPart = value.includes("/") ? value.split("/").at(-1)?.trim() : value.trim();

  const numericValue = Number.parseFloat(pxPart?.replace("px", "") ?? "0");
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const utilityPill = (token: ScaleToken) => (
  <div className="flex items-center gap-2">
    <code className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
      {token.utility}
    </code>
    <span className="text-sm text-muted-foreground">{token.value}</span>
  </div>
);

export default function DesignSystemPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-16 px-6 py-12 sm:px-10 lg:px-12">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Internal route</Badge>
              <Badge variant="secondary">Figma aligned</Badge>
              <Badge variant="outline">Tailwind-first</Badge>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Shared system design tokens for the next round of page redesigns.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                The imported Figma system has been normalized into Tailwind utilities and shared UI
                primitives. Native Tailwind scales are reused where they already match the design,
                and only the missing parts are extended in the theme layer.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Custom theme extensions</CardDescription>
                  <CardTitle>Radius, shadows, blur, opacity</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  Added the Figma-specific utilities that Tailwind v3 does not ship by default.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Native Tailwind reuse</CardDescription>
                  <CardTitle>Spacing, type, breakpoints, max widths</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  Kept the default scales where the Figma file already follows Tailwind exactly.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Shared primitives</CardDescription>
                  <CardTitle>Button, card, field controls</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  Updated the baseline shadcn primitives so future pages inherit the new system by
                  default.
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b border-border/70 bg-secondary/40 px-6 py-4">
              <p className="text-sm font-medium text-foreground">Color foundation</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                The Figma color palettes map cleanly to Tailwind&apos;s built-in color families, so
                the repo does not duplicate those hex values in `tailwind.config.ts`.
              </p>
            </div>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {COLOR_FAMILIES.map((family) => (
                  <Badge key={family} variant="outline">
                    {family}
                  </Badge>
                ))}
              </div>
              <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
                <code className="block text-sm leading-7 text-muted-foreground">
                  slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green,
                  emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        <TokenSection
          eyebrow="Typography"
          title="Font scale and weights"
          description="The typography sheet in Figma matches Tailwind's default text scale. The shared app font stack now uses Inter for sans text, JetBrains Mono for technical surfaces, Azeret Mono for expressive system labels, and Atkinson Hyperlegible Mono for code-style copy buttons."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <CardHeader>
                <CardTitle>Type scale</CardTitle>
                <CardDescription>Tailwind native utilities reused directly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TYPOGRAPHY_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="flex flex-col gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {utilityPill(token)}
                      <Badge variant="secondary">Tailwind native</Badge>
                    </div>
                    <p className={cn(token.utility, "break-words text-foreground")}>
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight scale</CardTitle>
                <CardDescription>Figma uses the standard font weight ladder.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {FONT_WEIGHT_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        {token.utility}
                      </code>
                      <span className="text-sm text-muted-foreground">{token.value}</span>
                    </div>
                    <p className={cn(token.utility, "mt-3 text-lg text-foreground")}>
                      Inter weight preview
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Layout"
          title="Spacing, breakpoints, and maximum widths"
          description="Spacing, responsive breakpoints, and content width constraints already match Tailwind defaults, so the implementation keeps those utilities native and documents them here for design handoff."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Spacing scale</CardTitle>
                <CardDescription>
                  Use these values through spacing utilities like `p-*`, `gap-*`, and `space-y-*`.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {SPACING_TOKENS.map((token) => {
                  const pxValue = Math.max(getPxValue(token.value), 1);

                  return (
                    <div
                      key={token.utility}
                      className="flex items-center gap-4 rounded-xl border border-border/70 bg-secondary/30 p-3"
                    >
                      <div className="w-28 shrink-0">
                        <code className="text-xs font-medium text-foreground">{`gap-${token.utility}`}</code>
                        <p className="mt-1 text-xs text-muted-foreground">{token.value}</p>
                      </div>
                      <div className="flex-1">
                        <div className="rounded-full bg-primary/15 p-2">
                          <div
                            className="h-3 rounded-full bg-primary"
                            style={{ width: `${Math.min(pxValue, 192)}px` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Breakpoints</CardTitle>
                  <CardDescription>Responsive prefixes stay Tailwind native.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {BREAKPOINT_TOKENS.map((token) => (
                    <div
                      key={token.utility}
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 px-4 py-3"
                    >
                      <code className="text-sm font-medium text-foreground">{token.utility}</code>
                      <span className="text-sm text-muted-foreground">{token.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Max widths</CardTitle>
                  <CardDescription>
                    Container and content rails from the Figma grid sheet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MAX_WIDTH_TOKENS.map((token) => {
                    const width = Math.max(getPxValue(token.value) / 4, 48);

                    return (
                      <div
                        key={token.utility}
                        className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <code className="text-xs font-medium text-foreground">
                            {token.utility}
                          </code>
                          <span className="text-xs text-muted-foreground">{token.value}</span>
                        </div>
                        <div className="mt-3 rounded-full bg-background p-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${Math.min(width, 280)}px` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Shape"
          title="Radius and elevation"
          description="Radius and shadow scales are imported from the Figma system as explicit theme extensions, including the smaller `xs` values and inset shadows that Tailwind v3 does not expose."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Radius scale</CardTitle>
                <CardDescription>Applied through `rounded-*` utilities.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {RADIUS_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs font-medium text-foreground">{token.utility}</code>
                      <span className="text-xs text-muted-foreground">{token.value}</span>
                    </div>
                    <div className="mt-4 rounded-xl bg-background p-4">
                      <div className={cn(token.utility, "h-16 bg-primary/15")} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Drop shadows</CardTitle>
                  <CardDescription>
                    Includes `shadow-2xs` and `shadow-xs` from the Figma sheet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {SHADOW_TOKENS.map((token) => (
                    <div
                      key={token.utility}
                      className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-xs font-medium text-foreground">{token.utility}</code>
                        <span className="text-xs text-muted-foreground">{token.label}</span>
                      </div>
                      <div className="mt-4 rounded-xl bg-background p-5">
                        <div
                          className={cn(
                            token.utility,
                            "rounded-xl border border-border/70 bg-card p-5"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inset shadows</CardTitle>
                  <CardDescription>
                    Custom utilities added in `globals.css` for Figma parity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-3">
                  {INSET_SHADOW_TOKENS.map((token) => (
                    <div
                      key={token.utility}
                      className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                    >
                      <code className="text-xs font-medium text-foreground">{token.utility}</code>
                      <p className="mt-1 text-xs text-muted-foreground">{token.value}</p>
                      <div className="mt-4 rounded-xl bg-background p-5">
                        <div className={cn(token.utility, "h-20 rounded-xl bg-card")} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Effects"
          title="Blur, backdrop blur, and opacity"
          description="Figma uses a tighter blur scale than Tailwind v3 defaults. Those values are now theme-backed utilities so glass surfaces, overlays, and depth effects use the same language everywhere."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,0.7fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Foreground blur</CardTitle>
                <CardDescription>Applied through `blur-*` utilities.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {BLUR_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs font-medium text-foreground">{token.utility}</code>
                      <span className="text-xs text-muted-foreground">{token.value}</span>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl bg-slate-950 p-4">
                      <div className="relative h-24 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.95),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.9),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.92),transparent_48%)]" />
                        <div
                          className={cn(
                            token.utility,
                            "absolute inset-5 rounded-xl border border-white/20 bg-white/15"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backdrop blur</CardTitle>
                <CardDescription>Applied to glass cards and layered surfaces.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {BACKDROP_BLUR_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs font-medium text-foreground">{token.utility}</code>
                      <span className="text-xs text-muted-foreground">{token.value}</span>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl bg-slate-950 p-4">
                      <div className="relative h-24 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.9),transparent_36%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.82),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(244,63,94,0.88),transparent_42%)]">
                        <div
                          className={cn(
                            token.utility,
                            "absolute inset-4 rounded-xl border border-white/20 bg-white/10"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opacity</CardTitle>
                <CardDescription>
                  The extended alpha ladder matches the Figma sheet exactly.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {OPACITY_TOKENS.map((token) => (
                  <div
                    key={token.utility}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs font-medium text-foreground">{token.utility}</code>
                      <span className="text-xs text-muted-foreground">{token.value}</span>
                    </div>
                    <div className="mt-3 rounded-xl bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(37,99,235,0.92),rgba(168,85,247,0.92))] p-3">
                      <div className="rounded-lg bg-white p-4">
                        <div className={cn(token.utility, "h-6 rounded-md bg-primary")} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Primitives"
          title="Updated shared UI primitives"
          description="These shared primitives now consume the imported design tokens so new dashboard and app pages inherit the system by default instead of layering ad hoc values on top."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Action and feedback primitives</CardTitle>
                <CardDescription>
                  Buttons and badges now use the new radius and elevation scale.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button>Primary action</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Danger</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="API key name" />
                  <Input placeholder="Search projects" />
                </div>
                <Textarea defaultValue="Shared controls now inherit the new border radius, shadow, and focus treatment from the imported Figma system." />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Card baseline</CardTitle>
                <CardDescription>
                  The shared card primitive now uses the imported corner and shadow scale.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="bg-background">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle>Project metrics</CardTitle>
                        <CardDescription>Surface example for dashboard content.</CardDescription>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
                      <p className="text-sm text-muted-foreground">Successful runs</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                        12,480
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
                      <p className="text-sm text-muted-foreground">Latency</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                        182ms
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Open analytics</Button>
                    <Button size="sm" variant="outline">
                      Export CSV
                    </Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Forms"
          title="Form controls and grouped field patterns"
          description="The Figma forms plugin should be implemented through shared `components/ui` primitives, not per-page copies. Inputs, selects, textareas, checkboxes, radios, labels, and field composition now have a single baseline."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Shared composition</CardTitle>
                <CardDescription>
                  This example follows the Figma forms sheet and is safe to reuse across pages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormPreview />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use these primitives</CardTitle>
                <CardDescription>
                  Pages should import components from `components/ui`, not from this documentation
                  route.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  ["@components/ui/input", "Single-line text fields"],
                  ["@components/ui/select", "Option selection controls"],
                  ["@components/ui/textarea", "Long-form text input"],
                  ["@components/ui/checkbox", "Binary and multi-select choices"],
                  ["@components/ui/radio-group", "Exclusive choice groups"],
                  ["@components/ui/label", "Input labels"],
                  ["@components/ui/field", "Grouped field layout and descriptions"],
                ].map(([path, description]) => (
                  <div
                    key={path}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-4"
                  >
                    <code className="text-sm font-medium text-foreground">{path}</code>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TokenSection>

        <TokenSection
          eyebrow="Cursor"
          title="Cursor utilities stay Tailwind-native"
          description="The cursor sheet in Figma maps directly to Tailwind cursor utilities. This is a utility-level convention, not a React component set, so pages should use the class directly."
        >
          <Card>
            <CardHeader>
              <CardTitle>Cursor utility map</CardTitle>
              <CardDescription>
                Figma spells one item as `conext-menu`; the correct utility in code is
                `cursor-context-menu`.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {CURSOR_TOKENS.map((token) => (
                <div
                  key={token.utility}
                  className="rounded-xl border border-border/70 bg-secondary/30 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-xs font-medium text-foreground">{token.utility}</code>
                    <span className="text-xs text-muted-foreground">{token.value}</span>
                  </div>
                  <div
                    className={cn(
                      token.utility,
                      "mt-4 rounded-xl border border-dashed border-border bg-background p-4"
                    )}
                  >
                    <div className="rounded-lg bg-secondary/60 px-3 py-4 text-sm text-foreground">
                      {token.label}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TokenSection>

        <GenericComponentsShowcase />
      </div>
    </main>
  );
}
