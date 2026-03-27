import Link from "next/link";

export default function PhpExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/src/app/examples/php/page.tsx" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/php" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">PHP Backend Example</h1>
      <p className="mb-6">A complete PHP setup with data collection, MySQL storage, and CSV export for the analysis dashboard.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Project Structure</h2>
      <pre className="mb-6"><code>{`php-keystroke-demo/
├── index.html          # Frontend form
├── receive.php         # Data collection endpoint
├── export.php          # CSV export endpoint
├── setup.sql           # Database schema
└── keystroke-tracker.min.js`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">setup.sql</h2>
      <pre className="mb-6"><code>{`CREATE DATABASE IF NOT EXISTS survey;
USE survey;

CREATE TABLE keystroke_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id VARCHAR(255) NOT NULL,
    data JSON NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_participant (participant_id)
);`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">index.html</h2>
      <pre className="mb-6"><code>{`<!DOCTYPE html>
<html>
<head>
  <title>Keystroke Survey</title>
  <script src="keystroke-tracker.min.js"></script>
</head>
<body>
  <h1>Survey</h1>
  <form id="survey">
    <label>Question 1:</label>
    <textarea id="q1" rows="4"></textarea>
    <label>Question 2:</label>
    <textarea id="q2" rows="4"></textarea>
    <input type="hidden" id="pid"
      value="participant_001" />
    <button type="submit">Submit</button>
  </form>

  <script>
    const tracker = new KeystrokeTracker();
    tracker.attach("q1", document.getElementById("q1"));
    tracker.attach("q2", document.getElementById("q2"));

    document.getElementById("survey")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const resp = await fetch("receive.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            participant_id:
              document.getElementById("pid").value,
            keystroke_data: tracker.serialize()
          })
        });
        const result = await resp.json();
        alert(result.status === "ok"
          ? "Submitted!"
          : "Error: " + result.error);
      });
  </script>
</body>
</html>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">receive.php</h2>
      <pre className="mb-6"><code>{`<?php
header("Content-Type: application/json");
$input = json_decode(
  file_get_contents("php://input"), true
);

$pid = $input["participant_id"] ?? null;
$data = $input["keystroke_data"] ?? null;

if (!$pid || !$data) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$pdo = new PDO(
  "mysql:host=localhost;dbname=survey",
  "root", ""
);
$stmt = $pdo->prepare(
  "INSERT INTO keystroke_logs
    (participant_id, data, created_at)
   VALUES (?, ?, NOW())"
);
$stmt->execute([$pid, json_encode($data)]);

echo json_encode(["status" => "ok"]);
?>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">export.php</h2>
      <pre className="mb-6"><code>{`<?php
$pdo = new PDO(
  "mysql:host=localhost;dbname=survey",
  "root", ""
);
$stmt = $pdo->query(
  "SELECT participant_id, data FROM keystroke_logs"
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: text/csv");
header("Content-Disposition: attachment; "
     . "filename=keystroke_export.csv");

$out = fopen("php://output", "w");
fputcsv($out, ["participant_id", "keystroke_log"]);
foreach ($rows as $row) {
    fputcsv($out, [
      $row["participant_id"],
      $row["data"]
    ]);
}
fclose($out);
?>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Running Locally</h2>
      <pre className="mb-6"><code>{`# Start PHP built-in server
php -S localhost:8000

# Visit http://localhost:8000
# Submit some responses, then export:
# http://localhost:8000/export.php`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          For quick testing without MySQL, swap the PDO connection to SQLite:{" "}
          <code>new PDO(&quot;sqlite:data.db&quot;)</code>. See the{" "}
          <Link href="/docs/php" style={{ color: "var(--accent)" }}>PHP docs</Link>{" "}
          for the full SQLite schema.
        </p>
      </div>
    </>
  );
}
