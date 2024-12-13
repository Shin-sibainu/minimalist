import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import Link from "next/link";
import { getDatabase } from "@/lib/notion";
import Image from "next/image";

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
              {dbInfo.icon && (
                <Image
                  src={dbInfo.icon}
                  alt="Blog Logo"
                  width={32}
                  height={32}
                  className="dark:invert"
                />
              )}
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
              href={"https://nextnote.io"}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              NextNote
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
