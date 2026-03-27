import Link from "next/link";

export default function InstallPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Installation</h1>
      <p className="mb-6">There are several ways to add the Keystroke Tracker SDK to your project.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 1: npm (Recommended)</h2>
      <p className="mb-3">Install the SDK from npm:</p>
      <pre className="mb-6"><code>{`npm install keystroke-tracker-sdk`}</code></pre>
      <p className="mb-6">This is the recommended approach for most projects. It gives you versioned installs and works cleanly with modern build tools.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 2: Direct Download</h2>
      <p className="mb-3">
        Download <code>keystroke-core.min.js</code> from the{" "}
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/dist/keystroke-core.min.js" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>SDK dist folder</a>{" "}
        and include it in your project:
      </p>
      <pre className="mb-6"><code>{`<script src="path/to/keystroke-core.min.js"></script>`}</code></pre>
      <p className="mb-6">Use this when you want a simple script-tag integration or do not use a package manager.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 3: wget / curl</h2>
      <p className="mb-3">Download the minified SDK files directly:</p>
      <pre className="mb-6"><code>{`# Core SDK
curl -o keystroke-core.min.js "https://anonymous.4open.science/api/repo/aied-keystroke-viz/file/public/sdk/dist/keystroke-core.min.js"

# Qualtrics-specific version
wget -O keystroke-qualtrics.min.js "https://anonymous.4open.science/api/repo/aied-keystroke-viz/file/public/sdk/dist/keystroke-qualtrics.min.js"`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Option 4: Copy from Repository</h2>
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
