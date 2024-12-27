import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import Link from "next/link";
import { getDatabase } from "@/lib/notion";
import Image from "next/image";
import { Metadata } from "next";

// メタデータを動的に生成する関数
async function generateMetadata(): Promise<Metadata> {
  const dbInfo = await getDatabase();
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const title = dbInfo.title || "Minimalist";
  const description = "A minimalist blog template built with Next.js and Notion";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description,
      type: "website",
      siteName: title,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${title} Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // Notionのデータベースから取得した作者情報があれば使用
      creator: dbInfo.author ? `@${dbInfo.author}` : undefined,
      site: dbInfo.site ? `@${dbInfo.site}` : undefined,
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

// メタデータを動的に生成
export const metadata = generateMetadata();

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbInfo = await getDatabase();

  return (
    <html lang="ja" className={`${notoSansJP.className}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <header className="border-b mb-6">
          <div className="max-w-2xl mx-auto py-4 px-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {dbInfo.title || "Minimalist"}
              </h1>
            </Link>

            <nav className="ml-auto">
              {dbInfo.icon &&
                (typeof dbInfo.icon === "string" && dbInfo.icon.length <= 2 ? (
                  // 絵文字の場合
                  <span className="text-3xl">{dbInfo.icon}</span>
                ) : (
                  // 画像URLの場合
                  <Image
                    src={dbInfo.icon}
                    alt="Blog Logo"
                    width={32}
                    height={32}
                    className="dark:invert"
                  />
                ))}
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="border-t mt-6">
          <div className="max-w-4xl mx-auto py-6 px-4 text-center text-gray-500">
            © {new Date().getFullYear()} {"Minimalist"} from {""}
            <Link
              href={"https://notepress.xyz"}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              NotePress
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
