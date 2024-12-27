"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          記事の読み込みに失敗しました
        </h1>
        <p className="text-gray-600">Notionの記事設定を確認してください：</p>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          <li>記事のタイトルが設定されているか</li>
          <li>記事の内容が正しく入力されているか</li>
          <li>公開状態になっているか</li>
        </ul>
        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
