/** @type {import('next').NextConfig} */
const nextConfig = {
  // 既存の設定を維持
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
  swcMinify: true, // SWCベースの最小化を有効化（より高速）

  // TypeScript型チェックを最適化
  typescript: {
    // 本番ビルド時の型チェックをスキップ（必要に応じて）
    // ※CIで別途型チェックを行う場合に有効化を検討
    // ignoreBuildErrors: true,
  },

  // キャッシュ戦略の最適化
  experimental: {
    // ビルドキャッシュを最適化
    turbotrace: {
      contextDirectory: __dirname,
    },
    // 必要に応じてパッケージのキャッシュを改善
    // outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
