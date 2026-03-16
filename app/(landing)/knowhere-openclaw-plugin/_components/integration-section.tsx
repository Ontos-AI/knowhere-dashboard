import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import { CodeBlock } from "@app/(landing)/knowhere-openclaw-plugin/_components/code-block";
import {
  browseWorkflow,
  configSnippet,
  installCards,
  pluginResponsibilities,
  runtimeSurfaces,
  scopeModes,
  storageTree,
} from "@app/(landing)/knowhere-openclaw-plugin/_components/plugin-content";
import { SectionIntro } from "@app/(landing)/knowhere-openclaw-plugin/_components/section-intro";

export function IntegrationSection() {
  return (
    <section id="integration" className="bg-pixel-bg py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Integration Guide"
          title={
            <>
              Install it in OpenClaw.
              <br />
              Keep the workflow obvious.
            </>
          }
          description="The plugin page should teach operators exactly how Knowhere fits into the OpenClaw runtime. These are the commands, config, storage boundaries, and browse-first habits to make that integration reliable."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {installCards.map((card) => (
            <PixelCard key={card.title} className="h-full p-0">
              <div className="p-6">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                  {card.step}
                </p>
                <h3 className="mb-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg font-sans">
                  {card.title}
                </h3>
                <p className="mb-5 text-sm leading-7 text-pixel-muted font-sans">
                  {card.description}
                </p>
                <CodeBlock label="bash">{card.code}</CodeBlock>
              </div>
            </PixelCard>
          ))}
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <PixelCard className="h-full p-0">
            <div className="p-6">
              <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                Minimal config
              </p>
              <h3 className="mb-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg font-sans">
                Tell OpenClaw where the plugin lives and how it should scope storage.
              </h3>
              <p className="mb-5 text-sm leading-7 text-pixel-muted font-sans">
                The plugin can run in manual tool mode or auto-grounding mode. The core toggle is
                whether you want attachment ingest and prompt-time status injection turned on.
              </p>
              <CodeBlock label="json5">{configSnippet}</CodeBlock>
              <div className="mt-5 rounded-[12px] border-2 border-pixel-border bg-[#f3eee5] p-4">
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                  Skill filters
                </p>
                <p className="mt-2 text-sm leading-7 text-pixel-muted font-sans">
                  If you use skill filters in OpenClaw, allow the bundled <code>knowhere</code>{" "}
                  skill. Otherwise the tools will load without the intended usage guidance.
                </p>
              </div>
            </div>
          </PixelCard>

          <div className="grid gap-4">
            <PixelCard className="p-0">
              <div className="p-6">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                  What the plugin does
                </p>
                <ul className="space-y-3">
                  {pluginResponsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 border border-pixel-fg bg-pixel-green" />
                      <span className="text-sm leading-7 text-pixel-muted font-sans">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PixelCard>

            <PixelCard className="p-0">
              <div className="p-6">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                  Browse-first workflow
                </p>
                <ol className="space-y-4">
                  {browseWorkflow.map((item, index) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-pixel-fg bg-pixel-bg font-pixel text-[10px] text-pixel-fg shadow-[3px_3px_0_var(--pixel-shadow)]">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-7 text-pixel-muted font-sans">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </PixelCard>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <PixelCard className="h-full p-0">
            <div className="p-6">
              <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                Storage model
              </p>
              <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg font-sans">
                Each scope keeps a full result package, not a flattened summary.
              </h3>
              <CodeBlock label="tree">{storageTree}</CodeBlock>
              <p className="mt-4 text-sm leading-7 text-pixel-muted font-sans">
                <code>index.json</code> is only an optimization. If its schema changes, the plugin
                rebuilds it from the per-document directories and keeps the result package as the
                source of truth.
              </p>
            </div>
          </PixelCard>

          <PixelCard className="h-full p-0">
            <div className="p-6">
              <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                Runtime surface
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {runtimeSurfaces.map((surface) => (
                  <div
                    key={surface.title}
                    className="rounded-[12px] border-2 border-pixel-border bg-[#f5f0e7] p-4 shadow-[4px_4px_0_var(--pixel-shadow)]"
                  >
                    <h3 className="mb-2 font-mono text-base font-semibold text-pixel-fg">
                      {surface.title}
                    </h3>
                    <p className="text-sm leading-7 text-pixel-muted font-sans">
                      {surface.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[12px] border-2 border-pixel-border bg-pixel-bg p-4">
                  <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                    Scope modes
                  </p>
                  <div className="space-y-3">
                    {scopeModes.map((mode) => (
                      <div key={mode.title}>
                        <p className="font-mono text-sm font-semibold uppercase text-pixel-fg">
                          {mode.title}
                        </p>
                        <p className="text-sm leading-7 text-pixel-muted font-sans">
                          {mode.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[12px] border-2 border-pixel-border bg-pixel-bg p-4">
                  <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                    Common tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "knowhere_preview_document",
                      "knowhere_grep",
                      "knowhere_read_result_file",
                      "knowhere_cleanup_scope",
                    ].map((tool) => (
                      <span
                        key={tool}
                        className="border-2 border-pixel-border bg-[#f3eee5] px-3 py-2 font-mono text-xs text-pixel-fg"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  );
}
