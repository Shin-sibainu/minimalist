import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import Link from "next/link";
import { getDatabase } from "@/lib/notion";
import Image from "next/image";
import { Metadata } from "next";

// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Minimalist",
    template: "%s | Minimalist",
  },
  description: "A minimalist blog template built with Next.js and Notion",
  openGraph: {
    title: {
      default: "Minimalist",
      template: "%s | Minimalist",
    },
    description: "A minimalist blog template built with Next.js and Notion",
    type: "website",
    siteName: "Minimalist",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Minimalist Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimalist",
    description: "A minimalist blog template built with Next.js and Notion",
    site: "@your_site_handle",
    creator: "@your_handle",
  },
};

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

            {/* <nav className="ml-auto">
              <ul className="flex gap-4">
                <li>
                  <Link href={"/"} className="text-gray-600 hover:text-black">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-black"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav> */}
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
