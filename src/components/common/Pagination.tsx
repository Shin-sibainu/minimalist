"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/?page=${page}`);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    let prev = 0;
    for (const i of uniqueRange) {
      if (prev + 1 < i) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <nav
      className="flex flex-col items-center gap-4 mt-12 mb-8"
      aria-label="ページネーション"
    >
      {/* モバイル表示 */}
      <div className="flex items-center gap-4 md:hidden">
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`p-2 rounded-full ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
          } transition-all duration-200`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`p-2 rounded-full ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
          } transition-all duration-200`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`p-2 rounded-full ${
            currentPage <= 1
              ? "invisible"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
          } transition-all duration-200`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`dot-${index}`} className="px-4 py-2 text-gray-400">
                {page}
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(Number(page))}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`p-2 rounded-full ${
            currentPage >= totalPages
              ? "invisible"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
          } transition-all duration-200`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
