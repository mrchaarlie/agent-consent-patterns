import { ImageResponse } from "next/og";

// Required for `output: "export"` — prerender at build time.
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — ACP mark on ink, matching the SVG favicon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a18",
          borderRadius: 40,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 64,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "#fdfdfc",
        }}
      >
        <span>ACP</span>
        <span style={{ color: "#3d4f9e", marginLeft: 4 }}>/</span>
      </div>
    ),
    { ...size },
  );
}
