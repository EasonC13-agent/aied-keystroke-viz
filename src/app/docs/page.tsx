import Link from "next/link";

export default function DocsIndex() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Keystroke Tracker SDK</h1>
      <p className="mb-4" style={{ color: "var(--text)" }}>
        A lightweight, open-source JavaScript library for tracking keystroke behavior in
        web-based surveys and assessments. Detect outsourced and AI-assisted responding by
        capturing keypress, paste, copy, and focus/blur events per question.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { label: "<3KB minified", color: "var(--accent)" },
          { label: "No dependencies", color: "var(--green)" },
          { label: "Client-side only", color: "var(--accent)" },
          { label: "Privacy-first", color: "var(--purple)" },
        ].map((b) => (
          <span
            key={b.label}
            className="px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{ background: `color-mix(in srgb, ${b.color} 15%, transparent)`, color: b.color }}
          >
            {b.label}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Why Keystroke Tracking?</h2>
      <p className="mb-3">
        With the rise of large language models, participants in online surveys and assessments
        can generate high-quality responses by pasting AI-generated text. Traditional quality
        checks (attention checks, response time) often fail to detect this behavior.
      </p>
      <p className="mb-6">
        Keystroke tracking provides behavioral evidence: if a 200-character response was entered
        with only 3 keypresses and a paste event, the response was clearly not typed by the
        participant.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">How It Works</h2>
      <div className="space-y-4 mb-6">
        {[
          { step: 1, title: "Embed the SDK", desc: "Add the lightweight tracker to your survey platform (Qualtrics, custom web app, LMS) with minimal code." },
          { step: 2, title: "Collect Data", desc: "The SDK silently records keypresses, paste/copy events, and the typing sequence for each tracked question. All data stays client-side." },
          { step: 3, title: "Analyze with the Dashboard", desc: "Upload your exported CSV to the visualization dashboard. Participants are automatically flagged based on paste events and keypress-character discrepancies." },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 items-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              {s.step}
            </div>
            <div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p style={{ color: "var(--muted)" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Features</h2>
      <ul className="list-disc ml-5 space-y-1 mb-6">
        <li><strong>Keypress counting</strong> with full keystroke order logging</li>
        <li><strong>Paste & copy detection</strong> with event counting</li>
        <li><strong>Focus/blur tracking</strong> to detect tab-switching behavior</li>
        <li><strong>Platform adapters</strong> for Qualtrics, React, Vue, Angular, vanilla JS, and PHP</li>
        <li><strong>Interactive dashboard</strong> with automated flagging, keystroke timeline visualization, and one-click export</li>
        <li><strong>Privacy by design</strong>: all processing happens in the browser</li>
      </ul>

      <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">Ready to get started?</h3>
        <p>
          Check out the <Link href="/docs/install" style={{ color: "var(--accent)" }}>Installation guide</Link>,
          or jump to your platform:{" "}
          <Link href="/docs/qualtrics" style={{ color: "var(--accent)" }}>Qualtrics</Link>,{" "}
          <Link href="/docs/react" style={{ color: "var(--accent)" }}>React</Link>,{" "}
          <Link href="/docs/vue" style={{ color: "var(--accent)" }}>Vue</Link>,{" "}
          <Link href="/docs/vanilla-js" style={{ color: "var(--accent)" }}>Vanilla JS</Link>.
        </p>
      </div>
    </>
  );
}
