import Link from "next/link";

export default function VanillaJsPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/adapters/vanilla/index.html" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/examples/vanilla" style={{ color: "var(--accent)" }}>Live Example ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Vanilla JavaScript</h1>
      <p className="mb-6">Use the core <code>KeystrokeTracker</code> class in any web application without a framework.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Installation</h2>
      <pre className="mb-6"><code>{`// Option 1: Script tag
<script src="keystroke-tracker.min.js"></script>

// Option 2: ES module
import { KeystrokeTracker } from "./keystroke-tracker.js";`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Basic Usage</h2>
      <pre className="mb-6"><code>{`const tracker = new KeystrokeTracker();

// Attach to any textarea or input element
const q1 = document.querySelector("#question-1");
tracker.attach("q1", q1);

const q2 = document.querySelector("#question-2");
tracker.attach("q2", q2);

// On form submit
document.querySelector("form").addEventListener("submit", () => {
  const data = tracker.serialize();
  // Send to your backend or store in a hidden field
  fetch("/api/keystroke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
});`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Tracking Focus/Blur Events</h2>
      <p className="mb-3">The tracker automatically records window blur/focus events to detect tab-switching behavior:</p>
      <pre className="mb-6"><code>{`const data = tracker.serialize();
// data.data[0].blurs - number of blur events
// data.data[0].focus_events - array of {type, timestamp}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Custom Event Handling</h2>
      <pre className="mb-6"><code>{`// Listen for paste events with custom logic
tracker.on("paste", (qid, pastedText) => {
  console.log("Paste detected in", qid, ":", pastedText);
});

tracker.on("copy", (qid, copiedText) => {
  console.log("Copy detected in", qid);
});`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">CSV Download</h2>
      <p className="mb-3">Generate a CSV file from the tracked data for use with the dashboard:</p>
      <pre className="mb-6"><code>{`function downloadCSV() {
  const data = tracker.serialize();
  const rows = [["qid", "keypresses", "pastes", "copies", "text"]];
  data.data.forEach(d => {
    rows.push([d.qid, d.keypresses, d.pastes, d.copies,
      '"' + d.text.replace(/"/g, '""') + '"']);
  });
  const csv = rows.map(r => r.join(",")).join("\\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "keystroke_data.csv";
  a.click();
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Full Example</h2>
      <pre className="mb-6"><code>{`<!DOCTYPE html>
<html>
<head>
  <script src="keystroke-tracker.min.js"></script>
</head>
<body>
  <form id="survey">
    <label>Question 1:</label>
    <textarea id="q1" rows="4"></textarea>

    <label>Question 2:</label>
    <textarea id="q2" rows="4"></textarea>

    <button type="submit">Submit</button>
  </form>

  <script>
    const tracker = new KeystrokeTracker();
    tracker.attach("q1", document.getElementById("q1"));
    tracker.attach("q2", document.getElementById("q2"));

    document.getElementById("survey")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const json = JSON.stringify(tracker.serialize());
        console.log(json);
        // POST to your server or download as CSV
      });
  </script>
</body>
</html>`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          For the simplest integration, see the{" "}
          <Link href="/examples/vanilla" style={{ color: "var(--accent)" }}>live vanilla example</Link>{" "}
          which includes a working textarea tracker with CSV download.
        </p>
      </div>
    </>
  );
}
