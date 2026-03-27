"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Papa from "papaparse";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { OverviewSection } from "./dashboard/OverviewSection";
import { KeystrokeSection } from "./dashboard/KeystrokeSection";
import { ExportSection } from "./dashboard/ExportSection";
import type { ParsedState, ParticipantData } from "./dashboard/types";

export default function Dashboard() {
  const [parsed, setParsed] = useState<ParsedState | null>(null);
  const [error, setError] = useState("");
  const [section, setSection] = useState<"overview" | "keystrokes" | "cheaters">("overview");
  const [isAnon, setIsAnon] = useState(false);
  const [anonMap, setAnonMap] = useState<Record<string, string>>({});
  const [, forceUpdate] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const rerender = useCallback(() => forceUpdate((n) => n + 1), []);
  const getDisplayId = useCallback(
    (id: string) => (isAnon ? anonMap[id] || id : id),
    [isAnon, anonMap]
  );

  function parseCSV(text: string) {
    try {
      const result = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true });
      const rows = result.data;
      if (rows.length < 2) { setError("CSV needs at least 2 rows"); return; }
      const headers = rows[0];
      let labelRow: string[], importRow: string[], dataRows: string[][];
      const isQualtrics = rows.length >= 4 && rows[2].some((cell) => {
        try { const j = JSON.parse(cell); return j && j.ImportId; } catch { return false; }
      });
      if (isQualtrics) { labelRow = rows[1]; importRow = rows[2]; dataRows = rows.slice(3); }
      else { labelRow = headers.slice(); importRow = headers.map(() => ""); dataRows = rows.slice(1); }

      let ksIdx = headers.indexOf("keystroke_log");
      if (ksIdx === -1) ksIdx = headers.indexOf("keystroke_data");
      if (ksIdx === -1) { setError("Missing required column: keystroke_log or keystroke_data"); return; }

      const qidToCol: Record<string, string> = {};
      headers.forEach((h, i) => {
        try { const imp = JSON.parse(importRow[i]); if (imp?.ImportId) { const m = imp.ImportId.match(/QID\d+/); if (m) qidToCol[m[0]] = h; } } catch { /* skip */ }
      });

      const ID_CANDIDATES = ["ResponseId", "prolific_id", "PROLIFIC_PID", "participant_id", "ParticipantId", "SubjectID"];
      let defaultIdCol = headers[0];
      for (const c of ID_CANDIDATES) { if (headers.includes(c)) { defaultIdCol = c; break; } }

      const durIdx = headers.indexOf("Duration (in seconds)");
      const state = buildDataState({ headers, labelRow, importRow, dataRows, ksIdx, qidToCol, defaultIdCol, durIdx });
      if (state) { setParsed(state); setError(""); }
    } catch (e: unknown) {
      setError("Error parsing CSV: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  function buildDataState(params: {
    headers: string[]; labelRow: string[]; importRow: string[]; dataRows: string[][];
    ksIdx: number; qidToCol: Record<string, string>; defaultIdCol: string; durIdx: number;
  }): ParsedState | null {
    const { headers, labelRow, importRow, dataRows, ksIdx, qidToCol, defaultIdCol, durIdx } = params;
    const idIdx = headers.indexOf(defaultIdCol);
    const allQids = new Set<string>();
    const DATA: ParticipantData[] = dataRows.map((r, ri) => {
      let ks: ParticipantData["ks"] = [];
      try {
        const raw = JSON.parse(r[ksIdx]);
        let items: Record<string, unknown>[];
        if (raw.data && Array.isArray(raw.data)) items = raw.data;
        else if (Array.isArray(raw)) items = raw;
        else if (raw.keypresses !== undefined) items = [raw];
        else items = [];
        ks = items.map((k, ki) => {
          const qid = (k.qid as string) || "Q" + (ki + 1);
          allQids.add(qid);
          return { qid, keypresses: (k.keypresses as number) || 0, pastes: (k.pastes as number) || 0, copies: (k.copies as number) || 0, order: (k.keystroke_order as string[]) || [], text: (k.text as string) || "" };
        });
      } catch { /* skip */ }
      return { id: r[idIdx] || "?", rowIdx: ri, duration: durIdx >= 0 ? parseFloat(r[durIdx]) || 0 : 0, row: r, ks, flags: [], flagDetails: {}, isFlagged: false, verdict: null, note: "" };
    }).filter((d) => d.id && d.id !== "?" && d.ks.length > 0);

    if (!DATA.length) { setError("No valid data rows found."); return null; }

    const qidList = [...allQids];
    const qLabels: Record<string, string> = {};
    qidList.forEach((qid) => { qLabels[qid] = qidToCol[qid] || qid; });

    DATA.forEach((d) => {
      d.flags = []; d.flagDetails = {};
      d.ks.forEach((k) => {
        const textLen = (k.text || "").length;
        if (k.pastes > 0) { d.flags.push("pasted"); if (!d.flagDetails.pasted) d.flagDetails.pasted = []; d.flagDetails.pasted.push(qLabels[k.qid]); }
        if (textLen > k.keypresses && textLen > 0) { d.flags.push("too_short"); if (!d.flagDetails.too_short) d.flagDetails.too_short = []; d.flagDetails.too_short.push(qLabels[k.qid]); }
      });
      d.flags = [...new Set(d.flags)];
      d.isFlagged = d.flags.length > 0;
    });

    return { headers, labelRow, importRow, dataRows, ksIdx, qidToCol, defaultIdCol, durIdx, idCol: defaultIdCol, DATA, qidList, qLabels };
  }

  function changeIdCol(col: string) {
    if (!parsed) return;
    const newState = buildDataState({ ...parsed, defaultIdCol: col });
    if (newState) setParsed(newState);
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) { setError("Please upload a .csv file"); return; }
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string);
    reader.readAsText(file);
  }

  async function loadSample() {
    try { const r = await fetch("/sample.csv"); if (!r.ok) throw new Error("Failed"); parseCSV(await r.text()); } catch (e: unknown) { setError("Failed: " + (e instanceof Error ? e.message : "")); }
  }
  async function downloadSampleFile() {
    try { const r = await fetch("/sample.csv"); if (!r.ok) throw new Error("Failed"); const t = await r.text(); const b = new Blob([t], { type: "text/csv" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "sample_keystroke_data.csv"; a.click(); URL.revokeObjectURL(u); } catch { /* skip */ }
  }

  function toggleAnon() {
    if (!isAnon && parsed?.DATA) { const m: Record<string, string> = {}; parsed.DATA.forEach((d, i) => { m[d.id] = "P" + (i + 1); }); setAnonMap(m); }
    setIsAnon(!isAnon);
  }

  useEffect(() => {
    const dz = dropZoneRef.current;
    if (!dz) return;
    const over = (e: DragEvent) => { e.preventDefault(); dz.classList.add("ring-2", "ring-blue-500"); };
    const leave = () => dz.classList.remove("ring-2", "ring-blue-500");
    const drop = (e: DragEvent) => { e.preventDefault(); leave(); if (e.dataTransfer?.files[0]) handleFile(e.dataTransfer.files[0]); };
    dz.addEventListener("dragover", over); dz.addEventListener("dragleave", leave); dz.addEventListener("drop", drop);
    return () => { dz.removeEventListener("dragover", over); dz.removeEventListener("dragleave", leave); dz.removeEventListener("drop", drop); };
  });

  /* ─── UPLOAD SCREEN ─── */
  if (!parsed) {
    return (
      <>
        <header className="text-center py-10 px-5 relative" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href="/docs" className="px-3 py-1.5 border rounded-md text-sm no-underline inline-flex items-center" style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--accent)" }}>📖 SDK Docs</Link>
            <a href="https://anonymous.4open.science/r/aied-keystroke-viz/README.md" target="_blank" rel="noopener" className="px-3 py-1.5 border rounded-md text-sm no-underline inline-flex items-center" style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted)" }}>GitHub</a>
            <button onClick={toggleAnon} className="px-3 py-1.5 border rounded-md text-sm cursor-pointer" style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted)" }}>🔒 Hide Identifiable Info</button>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold" style={{ background: "linear-gradient(135deg, var(--accent), var(--cyan))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Keystroke Log Analyzer</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>A companion dashboard for keystroke-based outsourced responding detection</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>After collecting data and tracking keystrokes, use this web application to upload your data, review flagged participants, and export a cleaned dataset.</p>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
          <div ref={dropZoneRef} className="border-2 border-dashed rounded-2xl p-14 text-center max-w-xl w-full cursor-pointer transition-all" style={{ borderColor: "var(--border)" }} onClick={() => fileInputRef.current?.click()}>
            <h2 className="text-xl font-semibold mb-3">📁 Upload Your CSV File</h2>
            <p style={{ color: "var(--muted)" }}>Drag and drop your Qualtrics export CSV here, or click to browse.</p>
            <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>🔒 <strong>Your data never leaves your browser</strong> - all processing happens locally.</p>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button className="mt-4 px-6 py-2.5 rounded-lg font-semibold text-white cursor-pointer" style={{ background: "var(--accent)" }} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Choose File</button>
            {error && <p className="mt-3 text-sm" style={{ color: "var(--red)" }}>{error}</p>}
          </div>
          <div className="flex gap-3 mt-1">
            <button className="mt-3 px-5 py-2.5 border rounded-lg text-sm cursor-pointer" style={{ borderColor: "var(--border)", background: "transparent", color: "var(--muted)" }} onClick={loadSample}>🔍 Load Sample Data</button>
            <button className="mt-3 px-5 py-2.5 border rounded-lg text-sm cursor-pointer" style={{ borderColor: "var(--border)", background: "transparent", color: "var(--muted)" }} onClick={downloadSampleFile}>📥 Download Sample CSV</button>
          </div>
          <div className="mt-6 p-4 rounded-lg max-w-xl w-full text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <h4 style={{ color: "var(--text)" }} className="font-semibold mb-2">Expected CSV Format</h4>
            <p>Only two columns are <strong>required</strong>:</p>
            <ul className="mt-2 ml-5 list-disc leading-relaxed">
              <li><code>keystroke_log</code> (or <code>keystroke_data</code>) - JSON keystroke data</li>
              <li>A participant ID column (default: <code>ResponseId</code>)</li>
            </ul>
            <p className="mt-2">Supports both Qualtrics CSVs (3 header rows) and simple CSVs. JSON can use <code>{`{"data":[...]}`}</code> or flat format.</p>
          </div>
        </div>
      </>
    );
  }

  /* ─── DASHBOARD ─── */
  return (
    <>
      <nav className="flex gap-2 justify-center p-4 sticky top-0 z-50" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex gap-2">
          {(["overview", "keystrokes", "cheaters"] as const).map((s) => (
            <button key={s} onClick={() => setSection(s)} className="px-5 py-2 border rounded-lg text-sm cursor-pointer transition-all" style={{ borderColor: section === s ? "var(--accent)" : "var(--border)", background: section === s ? "var(--accent)" : "transparent", color: section === s ? "#fff" : "var(--muted)" }}>
              {s === "overview" ? "Overview" : s === "keystrokes" ? "Review Keystrokes" : "Finalize & Export"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Link href="/docs" className="px-3 py-1.5 border rounded-md text-sm no-underline inline-flex items-center" style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--accent)" }}>📖 Docs</Link>
          <a href="https://anonymous.4open.science/r/aied-keystroke-viz/README.md" target="_blank" rel="noopener" className="px-3 py-1.5 border rounded-md text-sm no-underline inline-flex items-center" style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted)" }}>GitHub</a>
          <button onClick={toggleAnon} className="px-3 py-1.5 border rounded-md text-sm cursor-pointer" style={{ borderColor: isAnon ? "var(--accent)" : "var(--border)", background: isAnon ? "var(--accent)" : "var(--card)", color: isAnon ? "#fff" : "var(--muted)" }}>
            {isAnon ? "🔓 Show Original IDs" : "🔒 Hide Identifiable Info"}
          </button>
          <ThemeToggle />
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-5 pt-4">
        <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <label className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Participant ID Column:</label>
          <select value={parsed.idCol} onChange={(e) => changeIdCol(e.target.value)} className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}>
            {parsed.headers.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 pb-6">
        {section === "overview" && <OverviewSection parsed={parsed} getDisplayId={getDisplayId} />}
        {section === "keystrokes" && <KeystrokeSection parsed={parsed} getDisplayId={getDisplayId} rerender={rerender} />}
        {section === "cheaters" && <ExportSection parsed={parsed} getDisplayId={getDisplayId} rerender={rerender} />}
      </div>
    </>
  );
}
