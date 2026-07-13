import type { ReactNode } from "react";

export type ReadingLevel = "caveman" | "human" | "academic";

/**
 * One variant of a leveled prose block (server-safe). All three variants are
 * server-rendered into the static HTML; globals.css displays only the one
 * matching <html data-level>, which also keeps the hidden variants out of the
 * accessibility tree.
 */
export function Lvl({
  level,
  as: Tag = "div",
  className,
  children,
}: {
  level: ReadingLevel;
  as?: "div" | "span" | "p";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-lvl={level} className={className}>
      {children}
    </Tag>
  );
}
