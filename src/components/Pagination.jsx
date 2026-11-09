function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap-' + page);
    result.push(page);
  });
  return result;
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__page"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </button>

      <span className="pagination__summary">
        Page {page} of {totalPages}
      </span>

      {pageWindow(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            className="pagination__page pagination__page--number"
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onClick={() => onPage(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="pagination__gap pagination__page--number" aria-hidden="true">
            …
          </span>
        )
      )}

      <button
        type="button"
        className="pagination__page"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
