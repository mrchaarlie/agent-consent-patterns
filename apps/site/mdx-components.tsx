import type { MDXComponents } from "mdx/types";

/** Typography for MDX pattern pages — technical-editorial, matches globals. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-14 border-t border-line pt-8 text-xl font-semibold tracking-tight"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-8 font-semibold tracking-tight" {...props} />
    ),
    p: (props) => (
      <p className="mt-4 leading-relaxed text-ink-muted" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-muted"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-ink-muted"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-semibold text-ink" {...props} />
    ),
    a: (props) => (
      <a
        className="text-ink underline underline-offset-4 hover:text-agent"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
        {...props}
      />
    ),
    pre: (props) => (
      // tabIndex: scrollable region must be reachable by keyboard (axe)
      <pre
        tabIndex={0}
        className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface-sunken p-4 text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-4 border-l-2 border-line-strong pl-4 italic text-ink-muted"
        {...props}
      />
    ),
    hr: () => <hr className="my-10 border-line" />,
    ...components,
  };
}
