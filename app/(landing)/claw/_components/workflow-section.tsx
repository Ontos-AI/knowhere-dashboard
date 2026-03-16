import type { ChatMessage } from "@/app/(landing)/claw/_components/plugin-content";
import { chatMessages, financialRows } from "@/app/(landing)/claw/_components/plugin-content";
import { SectionIntro } from "@/app/(landing)/claw/_components/section-intro";

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-y-2 border-pixel-border bg-pixel-bg py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Grounded Answer Flow"
          title={
            <>
              One dense report in.
              <br />
              One grounded OpenClaw answer out.
            </>
          }
          description="This is the interaction model the plugin is built for: Knowhere extracts structure, OpenClaw stores the package, and the agent answers only after it has previewed or reopened the right evidence."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <DocumentPanel />
          <ChatPanel />
        </div>
      </div>
    </section>
  );
}

function DocumentPanel() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[20px] border-4 border-pixel-border bg-[#f8f5ee] shadow-[10px_10px_0_var(--pixel-shadow)]">
        <div className="flex items-center gap-2 border-b-2 border-pixel-border bg-[#f1ece2] px-4 py-3">
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#28c840]" />
          <span className="ml-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-muted">
            TSLA-Q4-2025-Update.pdf
          </span>
        </div>

        <div className="relative min-h-[460px] overflow-hidden bg-[linear-gradient(180deg,#f7f3eb_0%,#efe7d6_100%)] px-4 py-4 sm:min-h-[520px] sm:py-5 md:min-h-[560px] md:px-6">
          <div className="absolute left-4 top-14 hidden h-[74%] w-[64%] rotate-[-6deg] rounded-[18px] border-2 border-[#d8c8ae] bg-white/70 shadow-[0_12px_0_rgba(115,115,115,0.08)] sm:block" />
          <div className="absolute right-4 top-24 hidden h-[62%] w-[54%] rotate-[5deg] rounded-[18px] border-2 border-[#d8c8ae] bg-white/70 shadow-[0_12px_0_rgba(115,115,115,0.08)] sm:block" />

          <div className="absolute left-4 right-4 top-4 w-auto rounded-[18px] border-2 border-[#d6c4a7] bg-[#fcf7ec] p-4 shadow-[0_14px_0_rgba(115,115,115,0.16)] sm:left-8 sm:right-auto sm:top-8 sm:w-[min(74%,520px)] sm:rounded-[20px] sm:shadow-[0_18px_0_rgba(115,115,115,0.16)] md:left-12 md:p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                  Raw source
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.015em] text-pixel-fg font-sans md:text-2xl">
                  One dense report.
                  <br />
                  Many hidden retrieval targets.
                </h3>
              </div>
              <span className="hidden border-2 border-[#d6c4a7] bg-white px-3 py-1 font-mono text-xs text-pixel-muted sm:inline-flex">
                page-33
              </span>
            </div>

            <div className="space-y-2 text-sm leading-6 text-[#5c5142] font-sans">
              <div className="h-2 rounded-full bg-[#d6c9b2]" />
              <div className="h-2 w-[88%] rounded-full bg-[#dfd3be]" />
              <div className="h-2 w-[80%] rounded-full bg-[#dfd3be]" />
            </div>

            <div className="mt-5 overflow-x-auto rounded-[14px] border-2 border-[#d6c4a7] bg-white">
              <table className="w-full border-collapse text-left font-mono text-xs text-pixel-fg md:text-sm">
                <thead className="bg-[#f4ecdd]">
                  <tr>
                    <th className="border-b border-[#d6c4a7] px-3 py-2 font-semibold">Metric</th>
                    <th className="border-b border-[#d6c4a7] px-3 py-2 font-semibold">Q1-2024</th>
                    <th className="border-b border-[#d6c4a7] px-3 py-2 font-semibold">Q4-2025</th>
                  </tr>
                </thead>
                <tbody>
                  {financialRows.map((row) => (
                    <tr key={row.metric}>
                      <td className="border-b border-[#e6dccb] px-3 py-2">{row.metric}</td>
                      <td className="border-b border-[#e6dccb] px-3 py-2">{row.q12024}</td>
                      <td className="border-b border-[#e6dccb] px-3 py-2">{row.q42025}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 space-y-2 text-sm leading-6 text-[#5c5142] font-sans">
              <div className="h-2 w-[92%] rounded-full bg-[#dfd3be]" />
              <div className="h-2 w-[84%] rounded-full bg-[#dfd3be]" />
              <div className="h-2 w-[70%] rounded-full bg-[#dfd3be]" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 sm:bottom-7 sm:left-7 sm:right-7 sm:grid-cols-4">
            {[
              { label: "total", value: "46" },
              { label: "text", value: "28" },
              { label: "tables", value: "12" },
              { label: "images", value: "6" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[10px] border-2 border-pixel-border bg-[#fff9f0] px-3 py-2 shadow-[3px_3px_0_var(--pixel-shadow)]"
              >
                <p className="font-pixel text-[10px] uppercase tracking-[0.12em] text-pixel-red">
                  {stat.label}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-pixel-fg sm:text-lg">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute right-4 top-8 hidden w-[320px] rounded-[18px] border-[3px] border-pixel-red bg-[#fff7ef] p-4 shadow-[0_16px_0_rgba(239,68,68,0.12),8px_8px_0_rgba(115,115,115,0.28)] lg:block">
            <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
              Loupe / page-33 / table-14
            </p>
            <div className="mt-3 overflow-hidden rounded-[12px] border-2 border-[#ef4444]/35 bg-white">
              <table className="w-full border-collapse text-left font-mono text-sm text-pixel-fg">
                <thead className="bg-[#fbe8df]">
                  <tr>
                    <th className="border-b border-[#efc3b5] px-3 py-2 font-semibold">Quarter</th>
                    <th className="border-b border-[#efc3b5] px-3 py-2 font-semibold">FCF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-[#f5d8cf] px-3 py-2">Q1-2024</td>
                    <td className="border-b border-[#f5d8cf] px-3 py-2 text-pixel-red">−$2,535M</td>
                  </tr>
                  <tr>
                    <td className="border-b border-[#f5d8cf] px-3 py-2">Q3-2025</td>
                    <td className="border-b border-[#f5d8cf] px-3 py-2">$3,990M</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Q4-2025</td>
                    <td className="px-3 py-2">$1,420M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6c5a49] font-sans">
              The plugin keeps this structured evidence reopenable instead of flattening it into one
              temporary answer.
            </p>
          </div>
        </div>

        <div className="border-t-2 border-pixel-border bg-[#f1ece2] px-4 py-3">
          <span className="font-pixel text-[12px] text-pixel-fg md:text-[16px]">UNSTRUCTURED.</span>
        </div>
      </div>
    </div>
  );
}

function ChatPanel() {
  return (
    <div className="overflow-hidden rounded-[20px] border-4 border-pixel-border bg-[#111111] shadow-[10px_10px_0_rgba(58,58,58,0.65)]">
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-pixel-border bg-[#161616] px-4 py-3">
        <span className="text-sm">🦞</span>
        <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
          OpenClaw
        </span>
        <span className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-[#b8b1a3]">
          knowhere skill loaded
        </span>
      </div>

      <div className="flex min-h-[440px] flex-col bg-[radial-gradient(circle_at_top,rgba(124,216,162,0.11),transparent_34%),linear-gradient(180deg,#121212_0%,#0e0e0e_100%)] px-4 py-5 sm:min-h-[500px] md:min-h-[560px] md:px-6">
        <div className="flex flex-1 flex-col gap-4">
          {chatMessages.map((message, index) =>
            message.from === "user" ? (
              <UserBubble key={`${message.from}-${index}`} message={message} />
            ) : (
              <AgentBubble key={`${message.from}-${index}`} message={message} />
            )
          )}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <span className="font-pixel text-[12px] text-[#f6efe3] md:text-[16px]">STRUCTURED.</span>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] sm:max-w-[82%]">
        <div className="rounded-[18px] rounded-tr-[8px] border-2 border-[#7ba8d9]/45 bg-[#1a2f44] px-4 py-3 shadow-[6px_6px_0_rgba(0,0,0,0.24)]">
          <p className="text-[14px] leading-6 text-[#edf5ff] font-sans sm:text-[15px] sm:leading-7">
            {message.text}
          </p>
        </div>
        {message.reaction && (
          <div className="mt-2 flex justify-end">
            <span className="rounded-full border border-[#7ba8d9]/35 bg-[#152636] px-2 py-1 font-mono text-xs text-[#a8d3ff]">
              {message.reaction} 1
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7cd8a2]/35 bg-[#162117] text-sm">
        🦞
      </div>
      <div className="max-w-[88%] sm:max-w-[84%]">
        <div className="rounded-[18px] rounded-tl-[8px] border-2 border-[#7cd8a2]/35 bg-[#152016] px-4 py-3 shadow-[6px_6px_0_rgba(0,0,0,0.24)]">
          <p className="text-[14px] leading-6 text-[#eef5e8] font-sans sm:text-[15px] sm:leading-7">
            {message.text}
          </p>
          {message.highlight && (
            <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#f2a93b] font-mono sm:text-2xl">
              {message.highlight}
            </p>
          )}
          {message.citations && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.citations.map((citation) => (
                <span
                  key={citation}
                  className="rounded-[8px] border border-[#7cd8a2]/25 bg-black/20 px-2 py-1 font-mono text-[10px] text-[#b7e9cb] sm:text-[11px]"
                >
                  {citation}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
