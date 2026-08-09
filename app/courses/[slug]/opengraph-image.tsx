import { ImageResponse } from "next/og";
import { getCourseBySlug } from "@/lib/courses";

export const alt = "Yoga for Cure course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  const title = course?.title || "Online Yoga Course";
  const meta = course?.meta || "Yoga for Cure";
  const price = course?.price;

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
            fontSize: 26,
            fontWeight: 600,
            color: "#e8745b",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Yoga for Cure
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 800,
            color: "#faf8f5",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#c9e4d4",
            marginTop: 28,
          }}
        >
          {meta}
        </div>
        {price && (
          <div
            style={{
              display: "flex",
              marginTop: 40,
              padding: "14px 32px",
              borderRadius: 999,
              background: "#e8745b",
              color: "#faf8f5",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {price}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
