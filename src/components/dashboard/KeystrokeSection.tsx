"use client";

import { useState } from "react";
import type { ParsedState, ParticipantData } from "./types";

interface Props {
  parsed: ParsedState;
  getDisplayId: (id: string) => string;
  rerender: () => void;
}

function KeyToken({ k }: { k: string }) {
  if (k === "Backspace") return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "rgba(239,68,68,0.2)", color: "var(--red)" }}>⌫</span>;
  if (k === "paste") return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "rgba(59,130,246,0.2)", color: "var(--accent)" }}>📋 PASTE</span>;
  if (k === "copy") return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "rgba(34,197,94,0.2)", color: "var(--green)" }}>📄 COPY</span>;
  if (k === "Delete") return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "rgba(239,68,68,0.2)", color: "var(--red)" }}>DEL</span>;
  if (["Shift", "Meta", "Tab", "Alt", "Control"].includes(k)) return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "rgba(168,85,247,0.2)", color: "var(--purple)" }}>{k}</span>;
  if (k === " ") return <span className="inline-flex items-center justify-center min-w-[12px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "var(--bg)", color: "var(--muted)" }}>␣</span>;
  return <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded text-[0.65rem] font-mono" style={{ background: "var(--border)", color: "var(--text)" }}>{k}</span>;
}

function Tag({ type }: { type: string }) {
  const style = type === "pasted"
    ? { background: "rgba(59,130,246,0.13)", color: "var(--accent)" }
    : { background: "rgba(239,68,68,0.13)", color: "var(--red)" };
  return <span className="inline-block px-2.5 py-0.5 rounded-xl text-xs font-semibold ml-1" style={style}>{type === "too_short" ? "too short" : type}</span>;
}

function KeystrokeDetail({ d, qLabels, rerender }: { d: ParticipantData; qLabels: Record<string, string>; rerender: () => void }) {
  return (
    <div>
      {d.isFlagged && (
        <div className="p-4 rounded-lg mb-4 flex flex-col gap-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="px-4 py-1.5 border rounded-md text-sm font-semibold cursor-pointer transition-all"
              style={{
                borderColor: "var(--red)",
                background: d.verdict === "cheater" ? "var(--red)" : "transparent",
                color: d.verdict === "cheater" ? "#fff" : "var(--red)",
              }}
              onClick={() => { d.verdict = d.verdict === "cheater" ? null : "cheater"; rerender(); }}
            >
              {d.verdict === "cheater" ? "✓ Confirmed Cheater" : "Confirm Cheater"}
            </button>
            <button
              className="px-4 py-1.5 border rounded-md text-sm font-semibold cursor-pointer transition-all"
              style={{
                borderColor: "var(--green)",
                background: d.verdict === "clean" ? "var(--green)" : "transparent",
                color: d.verdict === "clean" ? "#fff" : "var(--green)",
              }}
              onClick={() => { d.verdict = d.verdict === "clean" ? null : "clean"; rerender(); }}
            >
              {d.verdict === "clean" ? "✓ Confirmed Clean" : "Confirm Not Cheating"}
            </button>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {d.verdict === "cheater" ? "Will be excluded from cleaned export" : d.verdict === "clean" ? "Marked as reviewed and clean" : "Unreviewed"}
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Notes (optional)</label>
            <textarea
              rows={2}
              className="w-full p-2 rounded-md text-sm resize-y"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              placeholder="e.g. Pasted full code answer..."
              value={d.note}
              onChange={(e) => { d.note = e.target.value; rerender(); }}
            />
          </div>
        </div>
      )}

      {d.ks.map((k) => {
        const textLen = (k.text || "").length;
        const flags: string[] = [];
        if (k.pastes > 0) flags.push("pasted");
        if (textLen > k.keypresses && textLen > 0) flags.push("too_short");
        return (
          <div key={k.qid} className="p-6 rounded-xl mb-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--cyan)" }}>{qLabels[k.qid] || k.qid}</div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>
              {k.keypresses} keypresses | {k.pastes} pastes | {k.copies} copies | {textLen} chars{" "}
              {flags.map((f) => <Tag key={f} type={f} />)}
            </h3>
            <div className="flex flex-wrap gap-0.5 py-2">
              {k.order.map((key, i) => <KeyToken key={i} k={key} />)}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Submitted Response</div>
              <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                {k.text || <em style={{ color: "var(--muted)" }}>No response</em>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KeystrokeSection({ parsed, getDisplayId, rerender }: Props) {
  const { DATA, qLabels } = parsed;
  const [pFilter, setPFilter] = useState<"flagged" | "unreviewed" | "all">("flagged");
  const [selectedId, setSelectedId] = useState<string>(() => {
    const first = DATA.find((d) => d.isFlagged);
    return first?.id || DATA[0]?.id || "";
  });

  const filtered = DATA
    .filter((d) => {
      if (pFilter === "flagged") return d.isFlagged;
      if (pFilter === "unreviewed") return d.isFlagged && d.verdict === null;
      return true;
    })
    .sort((a, b) => {
      const order = (v: string | null) => (v === "cheater" ? 0 : v === null ? 1 : 2);
      return order(a.verdict) - order(b.verdict) || Number(b.isFlagged) - Number(a.isFlagged);
    });

  const selected = DATA.find((d) => d.id === selectedId);

  function btnStyle(d: ParticipantData, active: boolean): React.CSSProperties {
    if (d.verdict === "cheater") return { background: "var(--red)", color: "#fff", borderColor: "var(--red)" };
    if (d.verdict === "clean") return { background: "var(--green)", color: "#fff", borderColor: "var(--green)" };
    if (d.isFlagged) return active ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : { borderColor: "var(--red)", color: "var(--red)" };
    return {};
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Show:</span>
        {(["flagged", "unreviewed", "all"] as const).map((f) => (
          <button
            key={f}
            className="px-3 py-1 border rounded-full text-xs font-semibold cursor-pointer transition-all"
            style={{
              borderColor: pFilter === f ? "var(--accent)" : "var(--border)",
              background: pFilter === f ? "var(--accent)" : "transparent",
              color: pFilter === f ? "#fff" : "var(--muted)",
            }}
            onClick={() => setPFilter(f)}
          >
            {f === "flagged" ? "Flagged Only" : f === "unreviewed" ? "Unreviewed" : "All Participants"}
          </button>
        ))}
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {filtered.length === DATA.length ? `${DATA.length} participants` : `${filtered.length} of ${DATA.length} participants`}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {filtered.map((d) => (
          <button
            key={d.id}
            className="px-3.5 py-1.5 border rounded-md text-xs cursor-pointer transition-all"
            style={{
              borderColor: "var(--border)",
              ...btnStyle(d, d.id === selectedId),
              ...(d.id === selectedId && !d.verdict && !d.isFlagged ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : {}),
            }}
            onClick={() => setSelectedId(d.id)}
          >
            {getDisplayId(d.id)}
          </button>
        ))}
      </div>

      {selected && <KeystrokeDetail d={selected} qLabels={qLabels} rerender={rerender} />}
    </div>
  );
}
