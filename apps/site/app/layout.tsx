import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/analytics";
import { ReadingLevelSwitch } from "@/components/reading-level";
import { SiteHeader } from "@/components/site-header";
import { SiteNavigation } from "@/components/site-navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import "./globals.css";

/**
 * Applies the stored reading level before first paint so the static HTML
 * (which defaults to "human") never flashes the wrong copy. Runs pre-hydration;
 * React never re-renders the attribute, hence suppressHydrationWarning on <html>.
 */
const READING_LEVEL_INIT = `try{var l=localStorage.getItem("acp-reading-level");if(l==="caveman"||l==="academic")document.documentElement.dataset.level=l;}catch(e){}`;

/**
 * Applies a stored theme override before first paint so light/dark never
 * flashes. Unset (or "system") leaves prefers-color-scheme in control.
 */
const THEME_INIT = `try{var t=localStorage.getItem("acp-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}`;

const SITE_DESCRIPTION =
  "UX patterns for AI agent permissions, consent, and human-in-the-loop control. A reference site and React component library.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentconsent.dev"),
  title: {
    default: "Agent Consent Patterns",
    template: "%s · Agent Consent Patterns",
  },
  description: SITE_DESCRIPTION,
  // "./" resolves to the current route's URL (composed with metadataBase), so
  // every page self-canonicalizes instead of all pointing at the homepage.
  alternates: {
    canonical: "./",
    // Agent-readable mirror: point crawlers and agents at the llms.txt index and
    // the plain-Markdown view of the site (generated into out/ at build time).
    types: {
      "text/markdown": [{ url: "/llms.txt", title: "Agent-readable (llms.txt)" }],
    },
  },
  openGraph: {
    type: "website",
    siteName: "Agent Consent Patterns",
    title: "Agent Consent Patterns",
    description: SITE_DESCRIPTION,
    url: "./",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Consent Patterns",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-level="human" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: READING_LEVEL_INIT }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Analytics />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-5 md:flex-nowrap md:pr-40">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ink-faint" aria-hidden>
                ACP/
              </span>
              <span className="font-semibold tracking-tight">
                Agent Consent Patterns
              </span>
            </Link>
            <div className="ml-auto">
              <SiteNavigation />
            </div>
          </div>
          <div className="mx-auto mt-2 max-w-5xl px-6 pb-5 md:absolute md:right-6 md:top-1/2 md:mt-0 md:max-w-none md:-translate-y-1/2 md:px-0 md:pb-0">
            <ReadingLevelSwitch />
          </div>
        </SiteHeader>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="relative border-t border-line">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-8 text-xs text-ink-faint md:flex-nowrap md:pr-40">
            <p>
              MIT licensed. Components:{" "}
              <Link
                href="/library/"
                className="font-mono underline underline-offset-4 hover:text-ink"
              >
                @agentconsent/react
              </Link>
            </p>
            <div className="ml-auto">
              <nav aria-label="More">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  <li>
                    <Link
                      href="/about/"
                      className="underline underline-offset-4 hover:text-ink"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@agentconsent.dev"
                      className="underline underline-offset-4 hover:text-ink"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/mrchaarlie/agent-consent-patterns"
                      className="underline underline-offset-4 hover:text-ink"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="/llms.txt"
                      className="underline underline-offset-4 hover:text-ink"
                    >
                      llms.txt
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="mx-auto px-6 pb-8 md:absolute md:right-6 md:top-1/2 md:max-w-none md:-translate-y-1/2 md:px-0 md:pb-0">
            <ThemeSwitch />
          </div>
        </footer>
      </body>
    </html>
  );
}
