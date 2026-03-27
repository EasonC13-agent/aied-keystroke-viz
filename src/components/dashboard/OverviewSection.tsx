"use client";

import type { ParsedState } from "./types";

interface Props {
  parsed: ParsedState;
  getDisplayId: (id: string) => string;
}

function Tag({ type }: { type: string }) {
  const style = type === "pasted"
    ? { background: "rgba(59,130,246,0.13)", color: "var(--accent)" }
    : type === "too_short"
    ? { background: "rgba(239,68,68,0.13)", color: "var(--red)" }
    : { background: "rgba(34,197,94,0.13)", color: "var(--green)" };
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-xl text-xs font-semibold" style={style}>
      {type === "too_short" ? "too short" : type}
    </span>
  );
}

export function OverviewSection({ parsed, getDisplayId }: Props) {
  const { DATA, qidList, qLabels } = parsed;
  const n = DATA.length;
  const flagged = DATA.filter((d) => d.isFlagged);
  const bothCount = DATA.filter((d) => d.flags.includes("pasted") && d.flags.includes("too_short")).length;
  const pasteOnlyCount = DATA.filter((d) => d.flags.includes("pasted") && !d.flags.includes("too_short")).length;
  const shortOnlyCount = DATA.filter((d) => !d.flags.includes("pasted") && d.flags.includes("too_short")).length;
  const cleanCount = DATA.filter((d) => !d.isFlagged).length;
  const pasteTotal = pasteOnlyCount + bothCount;
  const shortTotal = shortOnlyCount + bothCount;
  const pct = (v: number) => ((v / n) * 100).toFixed(1) + "%";

  function MatCell({ v, color, bg, bd }: { v: number; color: string; bg: string; bd: string }) {
    return (
      <td className="text-center p-4 rounded-lg" style={{ background: bg, border: `1px solid ${bd}` }}>
        <div className="text-3xl font-bold" style={{ color }}>{v}</div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{pct(v)}</div>
      </td>
    );
  }

  function MargCell({ v }: { v: number }) {
    return (
      <td className="text-center p-2">
        <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>{v}</div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{pct(v)}</div>
      </td>
    );
  }

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {[
          { label: "Responses Tracked", value: DATA.reduce((s, d) => s + d.ks.length, 0) },
          { label: "Total Participants", value: n },
          { label: "Flagged Participants", value: flagged.length },
        ].map((s) => (
          <div key={s.label} className="p-6 rounded-xl transition-transform hover:-translate-y-0.5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>{s.label}</h3>
            <div className="text-4xl font-bold" style={{ color: "var(--accent)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Contingency matrix */}
      <div className="p-6 rounded-xl mb-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>Cheating Indicator Overlap</h3>
        <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "8px" }}>
          <thead>
            <tr>
              <th className="w-32"></th>
              <th className="text-center text-xs uppercase tracking-wide p-1" style={{ color: "var(--yellow)" }}>Short Response<br /><span className="font-normal text-[0.7rem] normal-case" style={{ color: "var(--muted)" }}>chars &gt; keypresses</span></th>
              <th className="text-center text-xs uppercase tracking-wide p-1" style={{ color: "var(--muted)" }}>Not Short</th>
              <th className="text-center text-xs uppercase tracking-wide p-1" style={{ color: "var(--muted)" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-left text-xs uppercase tracking-wide p-1" style={{ color: "var(--accent)" }}>Pasted<br /><span className="font-normal text-[0.7rem] normal-case" style={{ color: "var(--muted)" }}>pastes &gt; 0</span></th>
              <MatCell v={bothCount} color="var(--red)" bg="rgba(239,68,68,0.12)" bd="rgba(239,68,68,0.35)" />
              <MatCell v={pasteOnlyCount} color="var(--accent)" bg="rgba(59,130,246,0.1)" bd="rgba(59,130,246,0.3)" />
              <MargCell v={pasteTotal} />
            </tr>
            <tr>
              <th className="text-left text-xs uppercase tracking-wide p-1" style={{ color: "var(--muted)" }}>Not Pasted</th>
              <MatCell v={shortOnlyCount} color="var(--yellow)" bg="rgba(234,179,8,0.1)" bd="rgba(234,179,8,0.3)" />
              <MatCell v={cleanCount} color="var(--green)" bg="rgba(34,197,94,0.1)" bd="rgba(34,197,94,0.25)" />
              <MargCell v={n - pasteTotal} />
            </tr>
            <tr>
              <th className="text-left text-xs uppercase tracking-wide p-1" style={{ color: "var(--muted)" }}>Total</th>
              <MargCell v={shortTotal} />
              <MargCell v={n - shortTotal} />
              <td className="text-center p-2">
                <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>{n}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>100%</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Response table */}
      <div className="p-6 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>All Responses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className="text-left p-2.5 text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>ID</th>
                {qidList.map((qid) => (
                  <th key={qid} className="text-left p-2.5 text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{qLabels[qid]}</th>
                ))}
                <th className="text-left p-2.5 text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>Flags</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((d) => (
                <tr key={d.id}>
                  <td className="p-2.5 font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{getDisplayId(d.id)}</td>
                  {qidList.map((qid) => {
                    const k = d.ks.find((k) => k.qid === qid);
                    return (
                      <td key={qid} className="p-2.5 max-w-[400px] break-words" style={{ borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                        {k ? k.text : "-"}
                      </td>
                    );
                  })}
                  <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    {d.flags.length > 0
                      ? d.flags.map((f) => <Tag key={f} type={f} />)
                      : <Tag type="clean" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
