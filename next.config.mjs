/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "notion.so",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // ビルド最適化のための追加設定
  swcMinify: true,

  // キャッシュ戦略の最適化
  experimental: {
    // ビルドキャッシュを最適化
    turbotrace: {
      contextDirectory: ".",
    },
  },
};

export default nextConfig;
