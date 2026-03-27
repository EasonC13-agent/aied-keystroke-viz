import Link from "next/link";

export default function InstallPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Installation</h1>
      <p className="mb-6">There are several ways to add the Keystroke Tracker SDK to your project.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 1: Direct Download (Recommended)</h2>
      <p className="mb-3">
        Download <code>keystroke-core.min.js</code> from the{" "}
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/dist" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>SDK dist folder</a>{" "}
        and include it in your project:
      </p>
      <pre className="mb-6"><code>{`<script src="path/to/keystroke-core.min.js"></script>`}</code></pre>
      <p className="mb-6">This is the simplest approach and works with any web platform. The file is less than 3KB minified.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 2: wget / curl</h2>
      <p className="mb-3">Download the minified SDK directly from the hosted dashboard:</p>
      <pre className="mb-3"><code>{`# Download the core SDK (<3KB)
wget https://keystroke-viz-anon.vercel.app/sdk/dist/keystroke-core.min.js

# Or with curl
curl -O https://keystroke-viz-anon.vercel.app/sdk/dist/keystroke-core.min.js

# Qualtrics-specific version
wget https://keystroke-viz-anon.vercel.app/sdk/dist/keystroke-qualtrics.min.js`}</code></pre>
      <p className="mb-6" style={{ color: "var(--muted)" }}>
        The npm package will be published after the review process. In the meantime, use direct download or wget from the hosted site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 3: Copy from Repository</h2>
      <p className="mb-3">Clone or download the repository and copy the files you need:</p>
      <pre className="mb-6"><code>{`# Clone the repository
git clone <repository-url>

# The SDK files are in sdk/
# - sdk/src/core.js          (source, ~5KB)
# - sdk/dist/keystroke-core.min.js  (minified, <3KB)
# - sdk/adapters/            (framework-specific adapters)`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">What&apos;s Included</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["File", "Size", "Description"].map((h) => (
                <th key={h} className="text-left p-2 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>keystroke-core.min.js</code></td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>&lt;3KB</td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Core library. Platform-agnostic <code>KeystrokeTracker</code> class.</td></tr>
            <tr><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>keystroke-tracker.min.js</code></td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>~4KB</td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Qualtrics-compatible version with <code>trackQuestion()</code> helper.</td></tr>
            <tr><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>keystroke-qualtrics.min.js</code></td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>~2KB</td><td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Qualtrics header script (handles embedded data storage).</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">After Installation</h2>
      <p className="mb-3">Once installed, see the integration guide for your platform:</p>
      <ul className="list-disc ml-5 space-y-1">
        <li><Link href="/docs/qualtrics" style={{ color: "var(--accent)" }}>Qualtrics</Link> (surveys)</li>
        <li><Link href="/docs/vanilla-js" style={{ color: "var(--accent)" }}>Vanilla JavaScript</Link> (any web page)</li>
        <li><Link href="/docs/react" style={{ color: "var(--accent)" }}>React</Link></li>
        <li><Link href="/docs/vue" style={{ color: "var(--accent)" }}>Vue 3</Link></li>
        <li><Link href="/docs/angular" style={{ color: "var(--accent)" }}>Angular</Link></li>
        <li><Link href="/docs/php" style={{ color: "var(--accent)" }}>PHP Backend</Link> (server-side storage)</li>
      </ul>
    </>
  );
}
