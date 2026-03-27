import Link from "next/link";

export default function AngularExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://github.com/EasonC13-agent/aied-keystroke-viz/tree/main/examples/angular" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/angular" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Angular Example</h1>
      <p className="mb-6">A complete Angular setup with the keystroke tracker directive, service injection, and data export.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">app.module.ts</h2>
      <pre className="mb-6"><code>{`import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { KeystrokeTrackerModule } from "keystroke-tracker-sdk/angular";
import { AppComponent } from "./app.component";
import { SurveyComponent } from "./survey.component";

@NgModule({
  declarations: [AppComponent, SurveyComponent],
  imports: [BrowserModule, KeystrokeTrackerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">survey.component.html</h2>
      <pre className="mb-6"><code>{`<div style="max-width: 640px; margin: 2rem auto;
  padding: 0 1rem">
  <h1>Angular Keystroke Tracker</h1>

  <form (ngSubmit)="onSubmit()">
    <div *ngFor="let q of questions" style="margin-bottom: 1.5rem">
      <label style="font-weight: bold">{{ q.label }}</label>
      <textarea
        [keystrokeTracker]="q.qid"
        rows="4"
        style="width: 100%; padding: 0.5rem;
          margin-top: 0.5rem; border-radius: 4px;
          border: 1px solid #ccc; font-size: 1rem"
      ></textarea>
    </div>

    <button type="submit" style="padding: 0.5rem 1rem;
      border: none; border-radius: 4px; background: #3b82f6;
      color: white; cursor: pointer; margin-right: 0.5rem">
      Submit
    </button>
    <button type="button" (click)="downloadCSV()" style="
      padding: 0.5rem 1rem; border: 1px solid #ccc;
      border-radius: 4px; background: white; cursor: pointer">
      Download CSV
    </button>
  </form>
</div>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">survey.component.ts</h2>
      <pre className="mb-6"><code>{`import { Component } from "@angular/core";
import { KeystrokeService } from "keystroke-tracker-sdk/angular";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html"
})
export class SurveyComponent {
  questions = [
    { qid: "q1", label: "Describe your approach:" },
    { qid: "q2", label: "Explain the results:" }
  ];

  constructor(private ks: KeystrokeService) {}

  onSubmit() {
    const data = this.ks.serialize();
    console.log("Keystroke data:", data);
    alert(JSON.stringify(data, null, 2));
  }

  downloadCSV() {
    const data = this.ks.serialize();
    const rows: string[][] = [
      ["qid","keypresses","pastes","copies","text"]
    ];
    data.data.forEach((d: any) => {
      rows.push([
        d.qid,
        String(d.keypresses),
        String(d.pastes),
        String(d.copies),
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
}`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Setup</h2>
      <pre className="mb-6"><code>{`ng new my-survey
cd my-survey
npm install keystroke-tracker-sdk
# Add the components above
ng serve`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The directive automatically registers and unregisters event listeners with Angular&apos;s lifecycle.
          The <code>KeystrokeService</code> is a singleton scoped to the module, so data persists across component navigation.
        </p>
      </div>
    </>
  );
}
