import { ImageResponse } from "next/og";

export const alt = "Yoga for Cure by Neha — Online Indian Yoga Teacher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(140deg, #0F2E20 0%, #1a3a1a 45%, #2d5a2d 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#9caf88",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              color: "#1a3a1a",
            }}
          >
            N
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#c9e4d4", fontWeight: 600 }}>
            Yoga for Cure
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: "#faf8f5",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Build strength. Improve flexibility.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#c9e4d4",
            marginTop: 28,
            maxWidth: 880,
          }}
        >
          Live online yoga classes with an experienced Indian yoga teacher
        </div>
      </div>
    ),
    { ...size }
  );
}
