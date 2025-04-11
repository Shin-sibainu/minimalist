import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/notion";
import { fetchFont } from "./fetch-font";

export const runtime = "edge";
export const revalidate = 60 * 60 * 24;
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
  try {
    const slug = (await params).slug;
    const post = await getPostBySlug(slug);
    const font = await fetchFont();

    if (!post || !post.title) {
      throw new Error(`Invalid post data for slug: ${slug}`);
    }

    const truncatedTitle =
      post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title;

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
                  fontSize: truncatedTitle.length > 30 ? "36px" : "48px",
                  fontWeight: "900",
                  color: "#1a1a1a",
                  lineHeight: 1.4,
                  margin: 0,
                  textShadow: "0 0 1px rgba(0,0,0,0.1)",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {truncatedTitle}
              </h1>
              {post.description && (
                <p
                  style={{
                    fontSize: "24px",
                    color: "#4b5563",
                    margin: 0,
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
                // borderTop: "2px solid #e5e7eb",
                paddingTop: "28px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                {post?.date && (
                  <p style={{ fontSize: "20px", color: "#4b5563", margin: 0 }}>
                    {post.date}
                  </p>
                )}
                {post?.author && (
                  <p style={{ fontSize: "20px", color: "#4b5563", margin: 0 }}>
                    By {post.author.name}
                  </p>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M6.75 3C4.67893 3 3 4.67893 3 6.75V17.25C3 19.3211 4.67893 21 6.75 21H17.25C19.3211 21 21 19.3211 21 17.25V6.75C21 4.67893 19.3211 3 17.25 3H6.75Z"
                    fill="#3b82f6"
                  />
                  <path
                    d="M8 12H16M8 8H16M8 16H13"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#3b82f6",
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
    console.error(
      `OG image generation failed for slug: ${(await params).slug}`,
      error
    );
    // エラー時のフォールバック画像
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
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
            Blog Post
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
