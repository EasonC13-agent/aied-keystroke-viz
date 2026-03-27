import Link from "next/link";

export default function AngularPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/adapters/angular/keystroke-tracker.directive.ts" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/examples/angular" style={{ color: "var(--accent)" }}>Example Code ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Angular Integration</h1>
      <p className="mb-6">Use the <code>keystrokeTracker</code> directive and <code>KeystrokeService</code> in Angular applications.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Installation</h2>
      <pre className="mb-6"><code>{`npm install keystroke-tracker-sdk
// or
yarn add keystroke-tracker-sdk`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Module Setup</h2>
      <pre className="mb-6"><code>{`import { KeystrokeTrackerModule } from "keystroke-tracker-sdk/angular";

@NgModule({
  imports: [KeystrokeTrackerModule]
})
export class AppModule {}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Template Usage</h2>
      <p className="mb-3">Add the <code>keystrokeTracker</code> directive to any textarea or input element:</p>
      <pre className="mb-6"><code>{`<!-- survey.component.html -->
<form (ngSubmit)="onSubmit()">
  <div *ngFor="let q of questions">
    <label>{{ q.label }}</label>
    <textarea [keystrokeTracker]="q.qid" rows="4"></textarea>
  </div>
  <button type="submit">Submit</button>
</form>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Component Logic</h2>
      <pre className="mb-6"><code>{`import { Component } from "@angular/core";
import { KeystrokeService } from "keystroke-tracker-sdk/angular";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html"
})
export class SurveyComponent {
  questions = [
    { qid: "q1", label: "Explain your reasoning:" },
    { qid: "q2", label: "Describe the pattern:" }
  ];

  constructor(private ks: KeystrokeService) {}

  onSubmit() {
    const data = this.ks.serialize();
    // { data: [{qid: "q1", keypresses: ..., pastes: ...}, ...] }
    console.log(data);
  }
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Service API</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Method", "Returns", "Description"].map((h) => (
                <th key={h} className="text-left p-2 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>serialize()</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>object</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Returns all tracked keystroke data</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>getQuestion(qid)</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>object</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Returns data for a specific question</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>reset()</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>void</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Clears all tracked data</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Standalone Components (Angular 14+)</h2>
      <p className="mb-3">If using standalone components, import the directive directly:</p>
      <pre className="mb-6"><code>{`import { Component } from "@angular/core";
import {
  KeystrokeTrackerDirective,
  KeystrokeService
} from "keystroke-tracker-sdk/angular";

@Component({
  standalone: true,
  imports: [KeystrokeTrackerDirective],
  providers: [KeystrokeService],
  template: \`
    <textarea [keystrokeTracker]="'q1'" rows="4"></textarea>
  \`
})
export class SurveyComponent {
  constructor(private ks: KeystrokeService) {}
}`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The directive automatically unsubscribes from DOM events when the element is destroyed, so you don&apos;t need to handle cleanup manually.
        </p>
      </div>
    </>
  );
}
