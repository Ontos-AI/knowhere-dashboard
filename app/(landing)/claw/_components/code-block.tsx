export function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-[12px] border-2 border-[#272727] bg-[#111111] shadow-[4px_4px_0_rgba(58,58,58,0.65)]">
      <div className="border-b border-white/10 bg-[#171717] px-4 py-3">
        <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f2a93b]">
          {label}
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-7 text-[#f6efe3]">
        <code>{children}</code>
      </pre>
    </div>
  );
}
