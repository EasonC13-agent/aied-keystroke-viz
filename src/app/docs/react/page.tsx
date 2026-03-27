import Link from "next/link";

export default function ReactPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/adapters/react/index.js" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/examples/react" style={{ color: "var(--accent)" }}>Live Example ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">React Integration</h1>
      <p className="mb-6">Use the <code>useKeystrokeTracker</code> hook in React components.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Installation</h2>
      <pre className="mb-6"><code>{`npm install keystroke-tracker-sdk`}</code></pre>

      <p className="mb-6">
        Or use the direct download from the{" "}
        <Link href="/docs/install" style={{ color: "var(--accent)" }}>Installation guide</Link>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Usage</h2>
      <pre className="mb-6"><code>{`// After loading keystroke-core.min.js via <script> tag,
// the global KeystrokeTracker class is available.
// Create a simple React hook wrapper:

function SurveyQuestion({ qid, label }) {
  const { ref, getData } = useKeystrokeTracker(qid);

  return (
    <div>
      <label>{label}</label>
      <textarea ref={ref} rows={4} />
    </div>
  );
}

function Survey() {
  const questions = [
    { qid: "q1", label: "Explain your reasoning:" },
    { qid: "q2", label: "Describe the pattern:" }
  ];

  const handleSubmit = () => {
    // getData() returns the keystroke data for each tracked element
    const allData = questions.map(q => {
      const el = document.querySelector(\`[data-qid="\${q.qid}"]\`);
      return el?.__keystrokeData;
    });
    console.log(JSON.stringify({ data: allData }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(q => (
        <SurveyQuestion key={q.qid} {...q} />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Hook API</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Property", "Type", "Description"].map((h) => (
                <th key={h} className="text-left p-2 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>ref</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>RefObject</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Attach to a <code>textarea</code> or <code>input</code> element</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>getData()</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>() =&gt; object</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Returns the keystroke data for this field</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Live Stats Example</h2>
      <p className="mb-3">Show real-time keystroke counts while the user types:</p>
      <pre className="mb-6"><code>{`// After loading keystroke-core.min.js via <script> tag,
// the global KeystrokeTracker class is available.
// Create a simple React hook wrapper:
import { useState, useEffect } from "react";

function TrackedTextarea({ qid }) {
  const { ref, getData } = useKeystrokeTracker(qid);
  const [stats, setStats] = useState({ keypresses: 0, pastes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const data = getData();
      if (data) setStats({
        keypresses: data.keypresses,
        pastes: data.pastes
      });
    }, 500);
    return () => clearInterval(interval);
  }, [getData]);

  return (
    <div>
      <textarea ref={ref} rows={4} />
      <p>Keypresses: {stats.keypresses} | Pastes: {stats.pastes}</p>
    </div>
  );
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">CSV Download</h2>
      <p className="mb-3">Export collected data as a CSV file:</p>
      <pre className="mb-6"><code>{`function downloadCSV(data) {
  const rows = [["qid", "keypresses", "pastes", "copies", "text"]];
  data.data.forEach(d => {
    rows.push([d.qid, d.keypresses, d.pastes, d.copies, d.text]);
  });
  const csv = rows.map(r => r.join(",")).join("\\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "keystroke_data.csv";
  a.click();
}`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The hook automatically handles component unmounting and event listener cleanup. You don&apos;t need to manually remove listeners.
        </p>
      </div>
    </>
  );
}
