 
'use client';

import { CopyButton } from "../common/CopyButton";
import { FC } from "react";
import { CustomBlockComponentProps } from "react-notion";

export const CodeBlock: FC<CustomBlockComponentProps<"code">> = ({ blockValue }) => {
  const code = blockValue.properties.title[0][0];

  return (
    <div className="relative">
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <CopyButton text={code} />
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}; 