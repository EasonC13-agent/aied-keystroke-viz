import Link from "next/link";

export default function PhpPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://github.com/EasonC13-agent/aied-keystroke-viz/tree/main/sdk/adapters/php" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/examples/php" style={{ color: "var(--accent)" }}>Example Code ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">PHP Backend</h1>
      <p className="mb-6">Collect keystroke data server-side with PHP and export it for analysis.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Frontend</h2>
      <p className="mb-3">Use any frontend adapter (vanilla JS, React, Vue, etc.) to collect data, then POST to your PHP endpoint:</p>
      <pre className="mb-6"><code>{`const data = tracker.serialize();
fetch("/api/keystroke.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    participant_id: participantId,
    keystroke_data: data
  })
});`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Backend (receive.php)</h2>
      <pre className="mb-6"><code>{`<?php
header("Content-Type: application/json");
$input = json_decode(file_get_contents("php://input"), true);

$participantId = $input["participant_id"] ?? null;
$keystrokeData = $input["keystroke_data"] ?? null;

if (!$participantId || !$keystrokeData) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

// Store in database
$pdo = new PDO("mysql:host=localhost;dbname=survey", "user", "pass");
$stmt = $pdo->prepare(
    "INSERT INTO keystroke_logs (participant_id, data, created_at)
     VALUES (?, ?, NOW())"
);
$stmt->execute([$participantId, json_encode($keystrokeData)]);

echo json_encode(["status" => "ok"]);
?>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Database Schema</h2>
      <pre className="mb-6"><code>{`CREATE TABLE keystroke_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id VARCHAR(255) NOT NULL,
    data JSON NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_participant (participant_id)
);`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Export CSV Endpoint</h2>
      <p className="mb-3">Create an endpoint that exports data in a format compatible with the{" "}
        <Link href="/docs/dashboard" style={{ color: "var(--accent)" }}>analysis dashboard</Link>:
      </p>
      <pre className="mb-6"><code>{`<?php
// export.php - Export as CSV compatible with the dashboard
$pdo = new PDO("mysql:host=localhost;dbname=survey", "user", "pass");
$stmt = $pdo->query(
    "SELECT participant_id, data FROM keystroke_logs"
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=keystroke_export.csv");

$out = fopen("php://output", "w");
fputcsv($out, ["participant_id", "keystroke_log"]);
foreach ($rows as $row) {
    fputcsv($out, [$row["participant_id"], $row["data"]]);
}
fclose($out);
?>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">SQLite Alternative</h2>
      <p className="mb-3">For simpler setups without MySQL, use SQLite:</p>
      <pre className="mb-6"><code>{`<?php
$pdo = new PDO("sqlite:keystroke_data.db");
$pdo->exec("CREATE TABLE IF NOT EXISTS keystroke_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL
)");
// ... same INSERT/SELECT logic as above
?>`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The exported CSV uses the same format as Qualtrics exports. Upload it directly to the{" "}
          <Link href="/" style={{ color: "var(--accent)" }}>dashboard</Link> for analysis.
        </p>
      </div>
    </>
  );
}
