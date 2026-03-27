import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>GitHub ↗</a>
      </div>

      <h1 className="text-3xl font-bold mb-4">Using the Dashboard</h1>
      <p className="mb-6">The visualization dashboard provides a complete workflow from CSV upload to cleaned data export.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Upload</h2>
      <p className="mb-3">Drag and drop your CSV file onto the{" "}
        <Link href="/" style={{ color: "var(--accent)" }}>dashboard</Link> or click to browse. The dashboard accepts:
      </p>
      <ul className="list-disc ml-5 space-y-1 mb-6">
        <li>Qualtrics exports (with 3-row headers: column names, labels, import IDs)</li>
        <li>Simple CSVs with a <code>keystroke_log</code> column</li>
        <li>PHP export CSVs from the <Link href="/docs/php" style={{ color: "var(--accent)" }}>PHP backend</Link></li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Overview Tab</h2>
      <p className="mb-6">
        Shows aggregate statistics: total participants, paste users, and a scatter plot of keypresses vs. text length.
        Points above the diagonal represent typed responses; triangles below indicate paste behavior.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Review Keystrokes Tab</h2>
      <p className="mb-3">Select any participant to see their full keystroke timeline per question. Each key event is rendered as a color-coded token:</p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Color", "Event Type"].map((h) => (
                <th key={h} className="text-left p-2 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Gray</td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Normal keypress</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Red</td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Backspace / Delete</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Blue (📋)</td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Paste event</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Green (📄)</td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Copy event</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Purple</td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Modifier keys (Shift, Meta, etc.)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Finalize &amp; Export Tab</h2>
      <p className="mb-3">Confirm or override flags, add notes, then export the results:</p>
      <ul className="list-disc ml-5 space-y-1 mb-6">
        <li><strong>Flagged participants CSV</strong>: only flagged responses with verdicts</li>
        <li><strong>Cleaned dataset</strong>: original data with confirmed cheaters removed</li>
        <li><strong>Full keystroke report</strong>: all participant x question data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Theme &amp; Anonymization</h2>
      <p className="mb-6">
        Use the toolbar buttons to switch between light/dark themes and anonymize participant IDs
        (replaced with P1, P2, etc.) for screenshots and presentations.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Privacy</h2>
      <p className="mb-6">
        All processing happens entirely in your browser. No data is sent to any server.
        The dashboard is a static client-side application, making it safe for sensitive research data.
      </p>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The dashboard auto-detects Qualtrics 3-row headers (column names, labels, import IDs) and maps QIDs
          to human-readable question labels automatically.
        </p>
      </div>
    </>
  );
}
