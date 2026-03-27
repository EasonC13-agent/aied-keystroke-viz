import Link from "next/link";

export default function ReactExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/examples/react" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/react" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">React Example</h1>
      <p className="mb-6">A complete React survey form with keystroke tracking, live statistics, and CSV export.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">App.jsx</h2>
      <pre className="mb-6"><code>{`import { useState, useCallback } from "react";
import { useKeystrokeTracker } from "keystroke-tracker-sdk/react";

function TrackedQuestion({ qid, label }) {
  const { ref, getData } = useKeystrokeTracker(qid);
  const [stats, setStats] = useState({
    keypresses: 0, pastes: 0, copies: 0
  });

  const handleKeyUp = useCallback(() => {
    const data = getData();
    if (data) {
      setStats({
        keypresses: data.keypresses,
        pastes: data.pastes,
        copies: data.copies
      });
    }
  }, [getData]);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={{ fontWeight: "bold" }}>{label}</label>
      <textarea
        ref={ref}
        rows={4}
        onKeyUp={handleKeyUp}
        onPaste={handleKeyUp}
        style={{
          width: "100%", padding: "0.5rem",
          marginTop: "0.5rem", borderRadius: "4px",
          border: "1px solid #ccc", fontSize: "1rem"
        }}
      />
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Keypresses: {stats.keypresses} |
        Pastes: {stats.pastes} |
        Copies: {stats.copies}
      </p>
    </div>
  );
}

export default function App() {
  const questions = [
    { qid: "q1", label: "Describe your approach:" },
    { qid: "q2", label: "Explain the results:" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const allData = questions.map(q => {
      const el = document.querySelector(
        \`[data-qid="\${q.qid}"]\`
      );
      return el?.__keystrokeData;
    });
    const json = JSON.stringify({ data: allData }, null, 2);
    alert("Collected data:\\n" + json);
  };

  const downloadCSV = () => {
    const allData = questions.map(q => {
      const el = document.querySelector(
        \`[data-qid="\${q.qid}"]\`
      );
      return el?.__keystrokeData;
    }).filter(Boolean);

    const rows = [
      ["qid","keypresses","pastes","copies","text"]
    ];
    allData.forEach(d => {
      rows.push([
        d.qid, d.keypresses, d.pastes, d.copies,
        '"' + (d.text || "").replace(/"/g, '""') + '"'
      ]);
    });

    const csv = rows.map(r => r.join(",")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "keystroke_data.csv";
    a.click();
  };

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto",
      padding: "0 1rem" }}>
      <h1>React Keystroke Tracker</h1>
      <form onSubmit={handleSubmit}>
        {questions.map(q => (
          <TrackedQuestion key={q.qid} {...q} />
        ))}
        <button type="submit" style={{
          padding: "0.5rem 1rem", border: "none",
          borderRadius: "4px", background: "#3b82f6",
          color: "white", cursor: "pointer",
          marginRight: "0.5rem"
        }}>
          Submit
        </button>
        <button type="button" onClick={downloadCSV} style={{
          padding: "0.5rem 1rem", border: "1px solid #ccc",
          borderRadius: "4px", background: "white",
          cursor: "pointer"
        }}>
          Download CSV
        </button>
      </form>
    </div>
  );
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Setup</h2>
      <pre className="mb-6"><code>{`npx create-react-app my-survey
cd my-survey
npm install keystroke-tracker-sdk
# Replace src/App.jsx with the code above
npm start`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Key Features</h2>
      <ul className="list-disc ml-5 space-y-1 mb-6">
        <li>Real-time keystroke stats per question</li>
        <li>Paste and copy detection</li>
        <li>Full keystroke order recording</li>
        <li>CSV download for dashboard analysis</li>
        <li>Automatic cleanup on component unmount</li>
      </ul>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          For production use, consider sending the data to a{" "}
          <Link href="/docs/php" style={{ color: "var(--accent)" }}>PHP backend</Link>{" "}
          instead of downloading CSV files directly.
        </p>
      </div>
    </>
  );
}
