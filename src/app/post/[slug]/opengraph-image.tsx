import { getPostBySlug } from "@/lib/notion";
import { ImageResponse } from "next/og";
import { fetchFont } from "./fetch-font";

export const runtime = "edge";
export const alt = "Blog Post OGP";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const font = await fetchFont();
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Noto Sans JP",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "48px",
            justifyContent: "space-between",
            position: "relative",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                fontSize: "44px",
                fontWeight: "700",
                color: "#1a1a1a",
                lineHeight: 1.5,
                fontFamily: "Noto Sans JP",
              }}
            >
              {post?.title || "無題"}
            </h1>
            {post?.description && (
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#4b5563",
                  marginTop: "16px",
                  fontFamily: "Noto Sans JP",
                }}
              >
                {post.description}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <p
                style={{
                  fontSize: "20px",
                  color: "#4b5563",
                  fontWeight: "700",
                }}
              >
                {post?.date && new Date(post.date).toLocaleDateString("ja-JP")}
              </p>
              {post?.author && (
                <p
                  style={{
                    fontSize: "20px",
                    color: "#4b5563",
                    marginLeft: "16px",
                    fontWeight: "700",
                  }}
                >
                  By {post.author}
                </p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M6.75 3C4.67893 3 3 4.67893 3 6.75V17.25C3 19.3211 4.67893 21 6.75 21H17.25C19.3211 21 21 19.3211 21 17.25V6.75C21 4.67893 19.3211 3 17.25 3H6.75Z"
                  fill="#6366f1"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12H16M8 8H16M8 16H13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(font && {
        fonts: [
          {
            name: "Noto Sans JP",
            data: font,
            style: "normal",
            weight: 700,
          },
        ],
      }),
    }
  );
}
