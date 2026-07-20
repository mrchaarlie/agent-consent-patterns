import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/analytics";
import { ReadingLevelSwitch } from "@/components/reading-level";
import { SiteHeader } from "@/components/site-header";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteSearch } from "@/components/site-search";
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
  // Static PNG (not the app/apple-icon.tsx convention) so it's served with a
  // real .png extension — GitHub Pages serves extension-less metadata routes
  // as application/octet-stream, which iMessage's link preview won't render.
  icons: {
    apple: "/apple-touch-icon.png",
  },
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 sm:px-6 lg:flex-nowrap lg:gap-x-4">
            <Link href="/" className="flex shrink-0 items-baseline gap-2">
              <span className="font-mono text-xs text-ink-faint" aria-hidden>
                ACP/
              </span>
              <span className="hidden font-semibold tracking-tight sm:inline">
                Agent Consent Patterns
              </span>
            </Link>
            <ReadingLevelSwitch />
            <div className="ml-auto flex items-center gap-x-2 lg:gap-x-4">
              <SiteSearch />
              <span className="hidden h-5 w-px bg-line lg:block" aria-hidden />
              <SiteNavigation />
              <span className="hidden h-5 w-px bg-line lg:block" aria-hidden />
              <a
                href="https://github.com/mrchaarlie/agent-consent-patterns"
                aria-label="GitHub repository"
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>
        </SiteHeader>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="relative border-t border-line">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-y-4 px-6 py-8 text-xs text-ink-faint md:flex-row md:items-center md:gap-x-8 md:gap-y-4 md:pr-40">
            <p>
              MIT licensed. Components:{" "}
              <Link
                href="/library/"
                className="font-mono underline underline-offset-4 hover:text-ink"
              >
                @agentconsent/react
              </Link>
            </p>
            <div className="flex w-full items-center justify-between gap-3 md:contents">
              <div className="shrink-0 md:ml-auto">
                <nav aria-label="More">
                  <ul className="flex flex-nowrap gap-x-3 md:gap-x-6">
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
                      href="https://github.com/mrchaarlie/agent-consent-patterns/blob/main/SECURITY.md"
                      className="underline underline-offset-4 hover:text-ink"
                    >
                      Security
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
              <div className="shrink-0 md:absolute md:right-6 md:top-1/2 md:max-w-none md:-translate-y-1/2">
                <ThemeSwitch />
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
