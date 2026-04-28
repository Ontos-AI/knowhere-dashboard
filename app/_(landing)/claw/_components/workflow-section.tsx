import Image from "next/image";
import type { ChatMessage } from "@/app/_(landing)/claw/_components/plugin-content";
import { chatMessages } from "@/app/_(landing)/claw/_components/plugin-content";
import { SectionIntro } from "@/app/_(landing)/claw/_components/section-intro";

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
  const pdfSrc = "/images/openclaw/page-33.png";
  const loupeX = 63;
  const loupeY = 34;
  const loupeZoom = 280;
  const toolbarHeight = 53;
  const footerHeight = 52;
  const pageAlt = "Tesla Q4 2025 report preview showing a dense PDF page with complex tables";

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[24px] border-4 border-pixel-border bg-[#f8f5ee] shadow-[10px_10px_0_var(--pixel-shadow)]">
        <div className="flex items-center gap-2 border-b-2 border-pixel-border bg-[#f1ece2] px-4 py-3">
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#28c840]" />
          <span className="ml-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-muted">
            Tesla-Q4-2025-Update.pdf
          </span>
        </div>

        <div className="relative min-h-[460px] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.84),transparent_34%),linear-gradient(180deg,#f8f3ea_0%,#ebdfcb_100%)] p-4 sm:min-h-[520px] md:min-h-[560px] md:p-6">
          <div className="absolute inset-x-5 top-10 hidden h-[78%] rounded-[22px] border-2 border-[#d8c8ae] bg-white/45 shadow-[0_18px_0_rgba(115,115,115,0.08)] sm:block md:left-8 md:right-20 md:rotate-[-5deg]" />
          <div className="absolute inset-x-8 top-16 hidden h-[76%] rounded-[22px] border-2 border-[#d8c8ae] bg-white/55 shadow-[0_18px_0_rgba(115,115,115,0.1)] sm:block md:left-20 md:right-8 md:rotate-[4deg]" />

          <div className="relative z-10 flex h-full flex-col rounded-[22px] border-2 border-[#d6c4a7] bg-[#fcf7ec] p-3 shadow-[0_18px_0_rgba(115,115,115,0.16)] sm:rounded-[24px] sm:p-4 md:mx-6 md:p-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#e2d4bd] pb-3">
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                  Raw source
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.015em] text-pixel-fg font-sans md:text-2xl">
                  Full PDF page preview.
                  <br />
                  Zoom only where the evidence lives.
                </h3>
              </div>
            </div>

            <div className="relative mt-4 min-h-[320px] flex-1 overflow-hidden rounded-[18px] border-2 border-[#d6c4a7] bg-white shadow-[0_10px_0_rgba(115,115,115,0.1)]">
              <div className="absolute inset-0 flex flex-col opacity-[0.94]">
                {[0, 1, 2].map((pageIndex) => (
                  <div
                    key={pageIndex}
                    className="shrink-0"
                    style={{ marginTop: pageIndex === 0 ? "-18%" : "-2%" }}
                  >
                    <Image
                      src={pdfSrc}
                      alt={pageIndex === 1 ? pageAlt : ""}
                      width={4398}
                      height={2474}
                      sizes="(max-width: 1280px) 100vw, 46vw"
                      priority={pageIndex === 1}
                      className="block h-auto w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-[#fcf7ec]/75 via-[#fcf7ec]/18 to-transparent sm:h-20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[#fcf7ec]/82 via-[#fcf7ec]/24 to-transparent sm:h-24" />
              <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(250,245,238,0.04)_0%,rgba(54,39,22,0.12)_100%)]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["full-page context", "table-heavy", "reopenable evidence"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#d6c4a7] bg-white px-3 py-1 font-mono text-[11px] text-[#6c5a49]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-pixel-border bg-[#f1ece2] px-4 py-3">
          <span className="font-pixel text-[12px] text-pixel-fg md:text-[16px]">UNSTRUCTURED.</span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-20 hidden rounded-[18px] border-[3px] border-pixel-red bg-[#fff7ef] shadow-[0_0_0_1px_rgba(10,10,10,0.08),0_0_0_6px_rgba(239,68,68,0.12),8px_8px_0_rgba(115,115,115,0.28),0_18px_42px_rgba(10,10,10,0.18)] md:block"
        style={{
          left: `${loupeX}%`,
          top: `calc(${toolbarHeight}px + (100% - ${toolbarHeight + footerHeight}px) * ${loupeY / 100})`,
          transform: "translate(-50%, -50%)",
          width: "clamp(240px, 28vw, 360px)",
          height: "clamp(140px, 15vw, 220px)",
          backgroundImage: `url(${pdfSrc})`,
          backgroundPosition: `${loupeX}% ${loupeY}%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${loupeZoom}% auto`,
        }}
      >
        <div className="absolute left-3 top-3 rounded-full border border-pixel-red/30 bg-[#fffaf3] px-2 py-1 font-pixel text-[9px] uppercase tracking-[0.14em] text-pixel-red">
          Loupe / page-33
        </div>
        <div className="absolute inset-0 rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%)]" />
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
