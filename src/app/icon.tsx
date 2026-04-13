import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

/** Tab / PWA icon: condensed FREE + [ES] on dark (full wordmark too small at 32–48px). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ccff00", fontSize: 20, fontWeight: 800 }}>
            OPEN
          </span>
          <span style={{ color: "#fafafa", fontSize: 11, fontWeight: 800 }}>
            ES
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
