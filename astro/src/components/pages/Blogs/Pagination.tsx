type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onChange(currentPage + 1);
    }
  };

  const pages = (() => {
    // 5ページ以下なら全て表示
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: (number | "ellipsis")[] = [];

    const addPage = (page: number) => {
      if (!items.includes(page)) {
        items.push(page);
      }
    };

    const addEllipsis = () => {
      if (items[items.length - 1] !== "ellipsis") {
        items.push("ellipsis");
      }
    };

    const firstPage = 1;
    const lastPage = totalPages;

    // 先頭と末尾は常に表示
    addPage(firstPage);

    // 現在ページの前後を計算
    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, totalPages - 1);

    // 先頭との間にギャップがある場合は省略記号
    if (start > 2) {
      addEllipsis();
    }

    // 現在ページの前後を追加
    for (let page = start; page <= end; page++) {
      addPage(page);
    }

    // 末尾との間にギャップがある場合は省略記号
    if (end < totalPages - 1) {
      addEllipsis();
    }

    addPage(lastPage);

    return items;
  })();

  return (
    <nav
      aria-label="ブログ一覧のページネーション"
      className="flex items-center justify-center gap-2 py-4"
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        前へ
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="px-2 text-sm text-gray-500">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                className={`px-3 py-1 text-sm rounded border ${
                  item === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        次へ
      </button>
    </nav>
  );
}

