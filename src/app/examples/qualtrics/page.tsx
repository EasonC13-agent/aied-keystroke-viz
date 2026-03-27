import Link from "next/link";

export default function QualtricsExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/src/app/examples/qualtrics/page.tsx" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/qualtrics" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Qualtrics Setup Guide</h1>
      <p className="mb-6">
        Step-by-step walkthrough for adding keystroke tracking to a Qualtrics survey.
        No coding experience required.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Overview</h2>
      <p className="mb-6">
        The integration works by injecting a small JavaScript snippet into your Qualtrics survey that records
        keystroke events as participants type. The data is stored in a Qualtrics embedded data field and exported
        alongside your regular survey responses.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 1: Create Embedded Data</h2>
      <ol className="list-decimal ml-5 space-y-2 mb-6">
        <li>Open your survey in Qualtrics</li>
        <li>Go to <strong>Survey Flow</strong></li>
        <li>Click <strong>Add a New Element Here</strong> at the top</li>
        <li>Select <strong>Embedded Data</strong></li>
        <li>Add a field named <code>keystroke_log</code></li>
        <li>Leave the value blank</li>
        <li>Click <strong>Apply</strong></li>
      </ol>

      <div className="p-4 rounded-lg mb-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="font-semibold mb-1">⚠️ Important</p>
        <p style={{ color: "var(--muted)" }}>
          The embedded data element must be at the <strong>top</strong> of your survey flow,
          before any blocks or branch logic.
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 2: Add the Header Script</h2>
      <ol className="list-decimal ml-5 space-y-2 mb-3">
        <li>Go to <strong>Look &amp; Feel</strong></li>
        <li>Select the <strong>General</strong> tab</li>
        <li>Click <strong>Header</strong> (edit)</li>
        <li>Switch to <strong>Source</strong> view (the <code>&lt;/&gt;</code> button)</li>
        <li>Paste the following script:</li>
      </ol>
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

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 3: Activate Per Question</h2>
      <p className="mb-3">
        For each text-entry question you want to track:
      </p>
      <ol className="list-decimal ml-5 space-y-2 mb-3">
        <li>Click the question in the survey editor</li>
        <li>Click the gear icon (⚙️) or right-click the question</li>
        <li>Select <strong>Add JavaScript</strong></li>
        <li>Add this code inside the <code>addOnload</code> function:</li>
      </ol>
      <pre className="mb-6"><code>{`Qualtrics.SurveyEngine.addOnload(function() {
  trackQuestion(this);
});`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Step 4: Export &amp; Analyze</h2>
      <ol className="list-decimal ml-5 space-y-2 mb-6">
        <li>Collect survey responses as usual</li>
        <li>Go to <strong>Data &amp; Analysis</strong></li>
        <li>Click <strong>Export &amp; Import</strong> → <strong>Export Data</strong></li>
        <li>Choose <strong>CSV</strong> format and download</li>
        <li>Upload the CSV to the{" "}
          <Link href="/" style={{ color: "var(--accent)" }}>analysis dashboard</Link>
        </li>
      </ol>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The dashboard auto-detects Qualtrics 3-row headers and maps QIDs to human-readable question labels.
          You don&apos;t need to preprocess the CSV.
        </p>
      </div>
    </>
  );
}
