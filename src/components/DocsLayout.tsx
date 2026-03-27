"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/install", label: "Installation" },
    ],
  },
  {
    title: "Integration Guides",
    links: [
      { href: "/docs/qualtrics", label: "Qualtrics" },
      { href: "/docs/vanilla-js", label: "Vanilla JavaScript" },
      { href: "/docs/react", label: "React" },
      { href: "/docs/vue", label: "Vue" },
      { href: "/docs/angular", label: "Angular" },
      { href: "/docs/php", label: "PHP Backend" },
    ],
  },
  {
    title: "Dashboard",
    links: [{ href: "/docs/dashboard", label: "Using the Dashboard" }],
  },
  {
    title: "Examples",
    links: [
      { href: "/examples", label: "All Examples" },
      { href: "/examples/vanilla", label: "Vanilla JS Demo" },
      { href: "/examples/react", label: "React Demo" },
      { href: "/examples/vue", label: "Vue Demo" },
      { href: "/examples/angular", label: "Angular Demo" },
      { href: "/examples/php", label: "PHP Demo" },
      { href: "/examples/qualtrics", label: "Qualtrics Guide" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 overflow-y-auto sticky top-0 h-screen p-0"
        style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
      >
        <div className="p-5 pb-2">
          <Link href="/" className="no-underline">
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              Keystroke Log Analyzer
            </h2>
          </Link>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            SDK Documentation
          </p>
        </div>
        <nav className="px-3 pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div
                className="text-xs font-semibold uppercase tracking-wider px-3 pt-5 pb-1"
                style={{ color: "var(--muted)" }}
              >
                {section.title}
              </div>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-1.5 rounded-md text-sm no-underline transition-colors"
                  style={{
                    color: pathname === link.href ? "var(--accent)" : "var(--text)",
                    background: pathname === link.href ? "rgba(59,130,246,0.1)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="pt-5 px-3 border-t mt-4" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
          </div>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 max-w-4xl px-8 py-8">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" style={{ color: "var(--accent)" }}>
            ← Back to Dashboard
          </Link>
          <span style={{ color: "var(--muted)" }}>·</span>
          <a
            href="https://anonymous.4open.science/r/aied-keystroke-viz/"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--accent)" }}
          >
            GitHub ↗
          </a>
          <span style={{ color: "var(--muted)" }}>·</span>
          <Link href="/examples" style={{ color: "var(--accent)" }}>
            Examples ↗
          </Link>
        </div>
        <div className="docs-content">{children}</div>
      </main>
    </div>
  );
}
