// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { NotionRenderer } from "react-notion";
// import { CodeBlock } from "./CodeBlock";

// export default function NotionContent({
//   content,
// }: {
//   content: any;
//   tags?: string[];
// }) {
//   // より厳密なバリデーション
//   if (
//     !content ||
//     typeof content !== "object" ||
//     Object.keys(content).length === 0 ||
//     !Object.values(content).some(
//       (block: any) =>
//         block &&
//         typeof block === "object" &&
//         "value" in block &&
//         typeof block.value === "object"
//     )
//   ) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         コンテンツを読み込めませんでした
//       </div>
//     );
//   }

//   try {
//     // カバー画像の有無をチェック
//     const hasCover = Object.values(content).some(
//       (block: any) =>
//         block.value?.type === "page" && block.value?.format?.page_cover
//     );

//     return (
//       <div className={`notion-content ${!hasCover ? "no-cover" : ""}`}>
//         <NotionRenderer
//           blockMap={content}
//           fullPage
//           hideHeader
//           customBlockComponents={{
//             code: CodeBlock,
//           }}
//         />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error rendering Notion content:", error);
//     return (
//       <div className="text-center py-8 text-gray-500">
//         コンテンツの表示中にエラーが発生しました
//       </div>
//     );
//   }
// }

"use client";
import { NotionRenderer } from "react-notion-x";

import { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import TweetEmbed from "react-tweet-embed";
import { Noto_Sans_JP } from "next/font/google";
// import { useTheme } from "next-themes";

// スタイルのインポート
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

// 重いコンポーネントを動的にインポート
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // 追加のPrism構文をインポート
    await Promise.all([
      import("prismjs/components/prism-markup-templating.js"),
      import("prismjs/components/prism-markup.js"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-cpp.js"),
      import("prismjs/components/prism-csharp.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-js-templates.js"),
      import("prismjs/components/prism-coffeescript.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-handlebars.js"),
      import("prismjs/components/prism-less.js"),
      import("prismjs/components/prism-makefile.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-objectivec.js"),
      import("prismjs/components/prism-ocaml.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-reason.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-sass.js"),
      import("prismjs/components/prism-scss.js"),
      import("prismjs/components/prism-solidity.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-stylus.js"),
      import("prismjs/components/prism-swift.js"),
      import("prismjs/components/prism-wasm.js"),
      import("prismjs/components/prism-yaml.js"),
    ]);
    return m.Code;
  })
);

const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);

// const Pdf = dynamic(
//   () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
//   {
//     ssr: false,
//   }
// );

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

function Tweet({ id }: { id: string }) {
  return <TweetEmbed tweetId={id} />;
}

interface NotionContentProps {
  content: ExtendedRecordMap;
  showTableOfContents?: boolean;
}

// NotionRendererのラッパーにスタイルを追加
const NotionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="notion-content [&.notion-content]:!font-inherit [&_.notion-page-content]:!font-inherit">
      {children}
    </div>
  );
};

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export default function NotionContent({ content }: NotionContentProps) {
  if (!content) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        コンテンツを読み込めませんでした
      </div>
    );
  }

  return (
    <div className={notoSansJP.className}>
      <NotionContainer>
        <NotionRenderer
          recordMap={content}
          fullPage={false}
          components={{
            nextImage: Image,
            nextLink: Link,
            Code,
            Equation,
            // Pdf,
            Modal,
            Tweet,
          }}
        />
      </NotionContainer>
    </div>
  );
}
