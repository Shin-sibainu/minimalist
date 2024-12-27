import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/*", // APIルートをクロールから除外
        "/admin/*", // 管理画面を除外（存在する場合）
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
