import Link from "next/link";

const examples = [
  {
    href: "/examples/vanilla",
    title: "Vanilla JavaScript",
    description: "Plain HTML/JS demo with a working textarea tracker and CSV download. No build tools required.",
    tags: ["HTML", "JavaScript"],
  },
  {
    href: "/examples/react",
    title: "React",
    description: "React component using the useKeystrokeTracker hook with live stats display and data export.",
    tags: ["React", "Hooks"],
  },
  {
    href: "/examples/vue",
    title: "Vue 3",
    description: "Vue 3 composable integration with reactive keystroke statistics and form handling.",
    tags: ["Vue 3", "Composition API"],
  },
  {
    href: "/examples/angular",
    title: "Angular",
    description: "Angular directive and service setup for tracking keystrokes across form fields.",
    tags: ["Angular", "Directives"],
  },
  {
    href: "/examples/php",
    title: "PHP Backend",
    description: "Server-side collection with PHP, MySQL storage, and CSV export endpoint for the dashboard.",
    tags: ["PHP", "MySQL"],
  },
  {
    href: "/examples/qualtrics",
    title: "Qualtrics Survey",
    description: "Step-by-step guide for adding keystroke tracking to Qualtrics surveys with embedded data.",
    tags: ["Qualtrics", "Surveys"],
  },
];

export default function ExamplesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Examples</h1>
      <p className="mb-8">
        Working examples for every supported platform. Each example includes complete, copy-paste-ready code.
      </p>

      <div className="grid gap-4">
        {examples.map((ex) => (
          <Link
            key={ex.href}
            href={ex.href}
            className="block p-5 rounded-xl no-underline transition-colors"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{ex.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {ex.description}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0 mt-1">
                {ex.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      color: "var(--accent)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">📦 Source Code</h3>
        <p style={{ color: "var(--muted)" }}>
          All examples are available in the{" "}
          <a
            href="https://anonymous.4open.science/r/aied-keystroke-viz/src/app/examples/page.tsx"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--accent)" }}
          >
            examples directory on GitHub ↗
          </a>
        </p>
      </div>
    </>
  );
}
