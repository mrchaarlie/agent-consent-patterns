import { ImageResponse } from "next/og";

// Required for `output: "export"` — prerender the OG image at build time.
export const dynamic = "force-static";

export const alt = "Agent Consent Patterns";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf9f6",
          color: "#1a1a17",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: "monospace",
            color: "#6f6f69",
            letterSpacing: "0.05em",
          }}
        >
          ACP/
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Agent Consent Patterns
          </div>
          <div style={{ fontSize: 36, color: "#4a4a45", lineHeight: 1.3 }}>
            UX patterns for AI agent permissions, consent, and
            human-in-the-loop control.
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#6f6f69" }}>agentconsent.dev</div>
      </div>
    ),
    { ...size },
  );
}
