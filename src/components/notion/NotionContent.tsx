/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { NotionRenderer } from "react-notion";
import { CodeBlock } from "./CodeBlock";

export default function NotionContent({ content }: { content: any }) {
  return (
    <NotionRenderer
      blockMap={content}
      fullPage
      hideHeader
      customBlockComponents={{
        code: CodeBlock,
      }}
    />
  );
} 