import Link from "next/link";

export default function VanillaExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/src/app/examples/vanilla/page.tsx" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/vanilla-js" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Vanilla JavaScript Example</h1>
      <p className="mb-6">A complete, standalone HTML page that tracks keystrokes on two text areas and lets you download the results as CSV.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Complete Code</h2>
      <p className="mb-3">Save this as an HTML file and open it in your browser. No build tools or server needed.</p>
      <pre className="mb-6"><code>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keystroke Tracker Demo</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 640px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    textarea {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    .stats {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <h1>Keystroke Tracker Demo</h1>

  <label><strong>Question 1:</strong> Describe your approach.</label>
  <textarea id="q1" rows="4"
    placeholder="Start typing here..."></textarea>
  <div class="stats" id="stats-q1">
    Keypresses: 0 | Pastes: 0 | Copies: 0
  </div>

  <label><strong>Question 2:</strong> Explain the results.</label>
  <textarea id="q2" rows="4"
    placeholder="Start typing here..."></textarea>
  <div class="stats" id="stats-q2">
    Keypresses: 0 | Pastes: 0 | Copies: 0
  </div>

  <button onclick="downloadCSV()">Download CSV</button>
  <button onclick="showJSON()">Show JSON</button>
  <pre id="output" style="margin-top:1rem;font-size:0.8rem;
    max-height:200px;overflow:auto;background:#f5f5f5;
    padding:1rem;border-radius:4px;display:none"></pre>

  <script src="keystroke-tracker.min.js"></script>
  <script>
    const tracker = new KeystrokeTracker();
    tracker.attach("q1", document.getElementById("q1"));
    tracker.attach("q2", document.getElementById("q2"));

    // Live stats update
    setInterval(() => {
      const data = tracker.serialize();
      data.data.forEach(d => {
        const el = document.getElementById("stats-" + d.qid);
        if (el) {
          el.textContent =
            "Keypresses: " + d.keypresses +
            " | Pastes: " + d.pastes +
            " | Copies: " + d.copies;
        }
      });
    }, 300);

    function downloadCSV() {
      const data = tracker.serialize();
      const rows = [["qid","keypresses","pastes","copies","text"]];
      data.data.forEach(d => {
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
    }

    function showJSON() {
      const out = document.getElementById("output");
      out.style.display = "block";
      out.textContent = JSON.stringify(
        tracker.serialize(), null, 2
      );
    }
  </script>
</body>
</html>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">How It Works</h2>
      <ol className="list-decimal ml-5 space-y-2 mb-6">
        <li>Create a <code>KeystrokeTracker</code> instance</li>
        <li>Call <code>tracker.attach(qid, element)</code> for each textarea</li>
        <li>The tracker records keypresses, pastes, copies, and the full keystroke order</li>
        <li>Call <code>tracker.serialize()</code> to get all data as JSON</li>
        <li>Download as CSV or POST to your server</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Format</h2>
      <pre className="mb-6"><code>{`{
  "data": [
    {
      "qid": "q1",
      "keypresses": 42,
      "pastes": 0,
      "copies": 0,
      "keystroke_order": ["H","e","l","l","o",...],
      "text": "Hello world..."
    }
  ]
}`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Next Steps</h3>
        <p style={{ color: "var(--muted)" }}>
          Upload the downloaded CSV to the{" "}
          <Link href="/" style={{ color: "var(--accent)" }}>dashboard</Link>{" "}
          to visualize keystroke patterns and detect anomalous responses.
        </p>
      </div>
    </>
  );
}
