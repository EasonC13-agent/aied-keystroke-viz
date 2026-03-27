"use client";

import { useState } from "react";
import type { ParsedState, ParticipantData } from "./types";

interface Props {
  parsed: ParsedState;
  getDisplayId: (id: string) => string;
  rerender: () => void;
}

function Tag({ type }: { type: string }) {
  const style = type === "pasted"
    ? { background: "rgba(59,130,246,0.13)", color: "var(--accent)" }
    : type === "too_short"
    ? { background: "rgba(239,68,68,0.13)", color: "var(--red)" }
    : { background: "rgba(34,197,94,0.13)", color: "var(--green)" };
  return <span className="inline-block px-2.5 py-0.5 rounded-xl text-xs font-semibold" style={style}>{type === "too_short" ? "too short" : type}</span>;
}

function downloadCSV(rows: (string | number | boolean)[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function ExportSection({ parsed, getDisplayId, rerender }: Props) {
  const { DATA, headers, labelRow, importRow, dataRows, qLabels, idCol } = parsed;
  const [showModal, setShowModal] = useState(false);
  const [exportType, setExportType] = useState<"flagged" | "full">("full");
  const [extraIdCol, setExtraIdCol] = useState("");
  const flagged = DATA.filter((d) => d.isFlagged);
  const pastedCount = DATA.filter((d) => d.flags.includes("pasted")).length;
  const tooShortCount = DATA.filter((d) => d.flags.includes("too_short")).length;
  const n = DATA.length;

  function buildRows(flaggedOnly: boolean) {
    const responseIdIdx = headers.indexOf("ResponseId");
    const extraIdx = extraIdCol ? headers.indexOf(extraIdCol) : -1;
    const headerRow: string[] = ["ResponseId"];
    if (extraIdCol) headerRow.push(extraIdCol);
    headerRow.push("qid", "export_id", "keypresses", "pastes", "copies", "keystroke_order", "text", "actual_char_count", "pasted", "too_short", "n_with_pastes", "n_too_short");
    const rows: (string | number | boolean)[][] = [headerRow];
    DATA.forEach((d) => {
      if (flaggedOnly && !d.isFlagged) return;
      const responseIdVal = responseIdIdx >= 0 ? dataRows[d.rowIdx][responseIdIdx] : "";
      const extraVal = extraIdx >= 0 ? dataRows[d.rowIdx][extraIdx] : "";
      const nPastes = d.ks.filter((k) => k.pastes > 0).length;
      const nTooShort = d.ks.filter((k) => (k.text || "").length > k.keypresses && (k.text || "").length > 0).length;
      d.ks.forEach((k) => {
        const textLen = (k.text || "").length;
        const pasted = k.pastes > 0;
        const tooShort = textLen > k.keypresses && textLen > 0;
        if (flaggedOnly && !pasted && !tooShort) return;
        const row: (string | number | boolean)[] = [responseIdVal];
        if (extraIdCol) row.push(extraVal);
        row.push(k.qid, qLabels[k.qid] || k.qid, k.keypresses, k.pastes, k.copies, (k.order || []).join("-"), k.text || "", textLen, pasted, tooShort, nPastes, nTooShort);
        rows.push(row);
      });
    });
    return rows;
  }

  function exportCleaned() {
    const confirmed = DATA.filter((d) => d.verdict === "cheater");
    if (!confirmed.length) { alert("No confirmed cheaters to exclude."); return; }
    const excludedRows = new Set(confirmed.map((d) => d.rowIdx));
    const rows: string[][] = [headers, labelRow, importRow];
    dataRows.forEach((r, i) => { if (!excludedRows.has(i)) rows.push(r); });
    downloadCSV(rows, "cleaned_dataset.csv");
  }

  function exportFlaggedNotes() {
    if (!flagged.length) { alert("No flagged participants."); return; }
    const ridx = headers.indexOf("ResponseId");
    const hasSecondary = idCol && idCol !== "ResponseId";
    const hdr: string[] = ["ResponseId"];
    if (hasSecondary) hdr.push(idCol);
    hdr.push("Flags", "Details", "Status", "Notes");
    const rows: (string | number | boolean)[][] = [hdr];
    flagged.forEach((d) => {
      const details: string[] = [];
      if (d.flagDetails.pasted) details.push("Pasted in: " + d.flagDetails.pasted.join(", "));
      if (d.flagDetails.too_short) details.push("Too short in: " + d.flagDetails.too_short.join(", "));
      const status = d.verdict === "cheater" ? "Cheater" : d.verdict === "clean" ? "Clean" : "Unreviewed";
      const row: string[] = [ridx >= 0 ? d.row[ridx] : d.id];
      if (hasSecondary) row.push(d.id);
      row.push(d.flags.join(", "), details.join("; "), status, d.note || "");
      rows.push(row);
    });
    downloadCSV(rows, "flagged_participant_notes.csv");
  }

  function confirmExport() {
    setShowModal(false);
    const rows = buildRows(exportType === "flagged");
    if (rows.length <= 1) { alert("No data to export."); return; }
    downloadCSV(rows, exportType === "flagged" ? "possible_cheaters.csv" : "keystroke_full_report.csv");
  }

  return (
    <div>
      {/* Flag summary */}
      <div className="flex gap-4 flex-wrap mb-4">
        {[
          { num: flagged.length, label: "Total Flagged", color: "var(--red)" },
          { num: pastedCount, label: "Pasted (pastes > 0)", color: "var(--accent)" },
          { num: tooShortCount, label: "Too Short (chars > keypresses)", color: "var(--yellow)" },
          { num: n - flagged.length, label: "Clean", color: "var(--green)" },
        ].map((s) => (
          <div key={s.label} className="p-4 px-6 rounded-lg text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Flagged table */}
      <div className="p-6 rounded-xl mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Flagged Participants</h3>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-1.5 border rounded-md text-xs font-semibold cursor-pointer" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={exportFlaggedNotes}>📋 Export Flagged Notes</button>
            <button className="px-4 py-1.5 border rounded-md text-xs font-semibold cursor-pointer" style={{ borderColor: "var(--green)", color: "var(--green)" }} onClick={exportCleaned}>📥 Export Cleaned Dataset</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Flags", "Details", "Status", "Notes"].map((h) => (
                  <th key={h} className="text-left p-2.5 text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flagged.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4" style={{ color: "var(--green)" }}>No flagged participants 🎉</td></tr>
              ) : flagged.map((d) => {
                const details: string[] = [];
                if (d.flagDetails.pasted) details.push("Pasted in: " + d.flagDetails.pasted.join(", "));
                if (d.flagDetails.too_short) details.push("Too short in: " + d.flagDetails.too_short.join(", "));
                return (
                  <tr key={d.id} style={{ background: d.verdict === "cheater" ? "rgba(239,68,68,0.08)" : d.verdict === "clean" ? "rgba(34,197,94,0.08)" : undefined }}>
                    <td className="p-2.5 font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{getDisplayId(d.id)}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{d.flags.map((f) => <Tag key={f} type={f} />)}</td>
                    <td className="p-2.5 text-xs" style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{details.join("; ")}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                      <select
                        className="px-2 py-1 rounded-md text-xs font-semibold cursor-pointer"
                        style={{
                          background: "var(--bg)", border: "1px solid var(--border)",
                          color: d.verdict === "cheater" ? "var(--red)" : d.verdict === "clean" ? "var(--green)" : "var(--muted)",
                        }}
                        value={d.verdict || ""}
                        onChange={(e) => { d.verdict = (e.target.value as "cheater" | "clean") || null; rerender(); }}
                      >
                        <option value="">Unreviewed</option>
                        <option value="cheater">Cheater</option>
                        <option value="clean">Clean</option>
                      </select>
                    </td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                      <input
                        type="text"
                        className="bg-transparent border-b text-xs w-full p-1 outline-none"
                        style={{ borderColor: "transparent", color: "var(--text)" }}
                        placeholder="Add note..."
                        value={d.note || ""}
                        onChange={(e) => { d.note = e.target.value; rerender(); }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "transparent")}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full report */}
      <div className="p-6 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Full Keystroke Report (All Participants x All Questions)</h3>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer text-white" style={{ background: "var(--accent)" }} onClick={() => { setExportType("flagged"); setExtraIdCol(""); setShowModal(true); }}>📊 Export (Flagged Only)</button>
            <button className="px-4 py-1.5 border rounded-md text-xs font-semibold cursor-pointer" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={() => { setExportType("full"); setExtraIdCol(""); setShowModal(true); }}>📊 Export (All)</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "QID", "Question", "Keypresses", "Chars", "Pastes", "Copies", "Pasted", "Too Short"].map((h) => (
                  <th key={h} className="text-left p-2.5 text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA.map((d) => d.ks.map((k) => {
                const textLen = (k.text || "").length;
                const pasted = k.pastes > 0;
                const tooShort = textLen > k.keypresses && textLen > 0;
                return (
                  <tr key={d.id + k.qid} style={{ background: pasted || tooShort ? "rgba(239,68,68,0.08)" : undefined }}>
                    <td className="p-2.5 font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{getDisplayId(d.id)}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{k.qid}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{qLabels[k.qid] || k.qid}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{k.keypresses}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{textLen}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{k.pastes}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{k.copies}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{pasted ? <Tag type="pasted" /> : "-"}</td>
                    <td className="p-2.5" style={{ borderBottom: "1px solid var(--border)" }}>{tooShort ? <Tag type="too_short" /> : "-"}</td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setShowModal(false)}>
          <div className="p-8 rounded-xl min-w-[340px] max-w-[480px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Export Options</h3>
            <label className="text-sm block mb-2" style={{ color: "var(--muted)" }}>Optionally add a second ID column:</label>
            <select
              className="w-full px-3 py-2 rounded-md text-sm mb-5"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
              value={extraIdCol}
              onChange={(e) => setExtraIdCol(e.target.value)}
            >
              <option value="">None</option>
              {headers.filter((h) => h !== "ResponseId" && h !== "keystroke_log").map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <div className="flex gap-2.5 justify-end">
              <button className="px-5 py-2 border rounded-md text-sm cursor-pointer" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-5 py-2 rounded-md text-sm font-semibold cursor-pointer text-white" style={{ background: "var(--accent)" }} onClick={confirmExport}>Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
