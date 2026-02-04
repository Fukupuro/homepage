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

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="ブログ一覧のページネーション"
      className="flex items-center justify-center gap-2 py-4"
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        前へ
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              type="button"
              onClick={() => onChange(pageNumber)}
              className={`px-3 py-1 text-sm rounded border ${
                pageNumber === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        次へ
      </button>
    </nav>
  );
}

