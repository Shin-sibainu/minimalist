import { ImageResponse } from "next/og";
import { getDatabase } from "@/lib/notion";
import { fetchFont } from "./post/[slug]/fetch-font";

export const runtime = "edge";
export const revalidate = 60 * 60 * 24;
export const alt = "Blog OGP";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  try {
    const dbInfo = await getDatabase();
    const font = await fetchFont();
    const title = dbInfo.title || "Minimalist Blog";

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "52px",
              justifyContent: "space-between",
              boxShadow:
                "0 8px 30px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h1
                style={{
                  fontSize: "64px",
                  fontWeight: "900",
                  color: "#1a1a1a",
                  lineHeight: 1.4,
                  margin: 0,
                  textShadow: "0 0 1px rgba(0,0,0,0.1)",
                }}
              >
                {title}
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingTop: "28px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    letterSpacing: "0.025em",
                  }}
                >
                  NotePress
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: font
          ? [
              {
                name: "NotoSansJP",
                data: font,
                weight: 700,
              },
            ]
          : undefined,
      }
    );
  } catch (error) {
    console.error("Failed to generate OG image:", error);
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "48px",
              fontWeight: "bold",
            }}
          >
            Minimalist Blog
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
