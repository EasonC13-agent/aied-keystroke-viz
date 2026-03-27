import Link from "next/link";

export default function QualtricsPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://github.com/EasonC13-agent/aied-keystroke-viz/tree/main/sdk/adapters/qualtrics" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <a href="https://github.com/EasonC13-agent/aied-keystroke-viz/tree/main/examples/qualtrics" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>Setup Guide ↗</a>
      </div>

      <h1 className="text-3xl font-bold mb-4">Qualtrics Integration</h1>
      <p className="mb-6">Add keystroke tracking to any Qualtrics survey in three steps.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 1: Add the Header Script</h2>
      <p className="mb-3">Go to <strong>Survey → Look & Feel → General → Header</strong> and paste the following script:</p>
      <pre className="mb-6"><code>{`<script>
var keystrokeData = {data: []};

function trackQuestion(qEngine) {
  var qid = qEngine.getQuestionInfo().QuestionID;
  var fields = qEngine.getQuestionContainer()
    .querySelectorAll("textarea, input[type=\\"text\\"]");

  fields.forEach(function(el) {
    var t = {
      qid: qid, keypresses: 0, pastes: 0,
      copies: 0, keystroke_order: [], text: ""
    };

    el.addEventListener("keyup", function(e) {
      t.keypresses++;
      t.keystroke_order.push(e.key);
      t.text = el.value;
    });
    el.addEventListener("paste", function() {
      t.pastes++;
      t.keystroke_order.push("paste");
    });
    el.addEventListener("copy", function() {
      t.copies++;
      t.keystroke_order.push("copy");
    });

    keystrokeData.data.push(t);
  });
}

Qualtrics.SurveyEngine.addOnPageSubmit(function() {
  Qualtrics.SurveyEngine.setEmbeddedData(
    "keystroke_log", JSON.stringify(keystrokeData)
  );
});
</script>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 2: Activate Per Question</h2>
      <p className="mb-3">For each text-entry question you want to track, click the question → <strong>Add JavaScript</strong> and add:</p>
      <pre className="mb-6"><code>{`Qualtrics.SurveyEngine.addOnload(function() {
  trackQuestion(this);
});`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 3: Create Embedded Data</h2>
      <p className="mb-6">
        In the <strong>Survey Flow</strong>, add an <strong>Embedded Data</strong> element at the top with a field
        named <code>keystroke_log</code>. Leave the value blank; it will be populated automatically on submit.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Exporting Data</h2>
      <p className="mb-6">
        After collecting responses, export as CSV from Qualtrics (<strong>Data & Analysis → Export</strong>).
        The CSV will contain a <code>keystroke_log</code> column with JSON data. Upload this directly to the{" "}
        <Link href="/" style={{ color: "var(--accent)" }}>dashboard</Link>.
      </p>

      <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The dashboard auto-detects Qualtrics 3-row headers (column names, labels, import IDs) and maps QIDs to human-readable question labels.
        </p>
      </div>
    </>
  );
}
