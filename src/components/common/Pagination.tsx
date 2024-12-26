import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  // 表示するページ番号を計算
  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];

    // 最初のページは常に表示
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // 最後のページは常に表示
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // 重複を削除してソート
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // ドットを追加
    let prev = 0;
    for (const i of uniqueRange) {
      if (prev + 1 < i) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex flex-wrap justify-center gap-2 mt-8" aria-label="ページネーション">
      {/* モバイルでは前へ/次へのみ表示 */}
      <div className="flex gap-2 md:hidden w-full justify-between px-2">
        {currentPage > 1 ? (
          <Link
            href={`/?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            前へ
          </Link>
        ) : (
          <span className="px-4 py-2 bg-gray-50 text-gray-300 rounded cursor-not-allowed">
            前へ
          </span>
        )}
        <span className="px-4 py-2">
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={`/?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            次へ
          </Link>
        ) : (
          <span className="px-4 py-2 bg-gray-50 text-gray-300 rounded cursor-not-allowed">
            次へ
          </span>
        )}
      </div>

      {/* デスクトップではページ番号を表示 */}
      <div className="hidden md:flex gap-2">
        {currentPage > 1 && (
          <Link
            href={`/?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            前へ
          </Link>
        )}

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span
              key={`dot-${index}`}
              className="px-4 py-2 text-gray-500"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={`/?page=${page}`}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </Link>
          )
        ))}

        {currentPage < totalPages && (
          <Link
            href={`/?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            次へ
          </Link>
        )}
      </div>
    </nav>
  );
} 