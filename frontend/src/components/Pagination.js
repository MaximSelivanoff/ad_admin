import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ page, totalPages, limit, total, onPageChange, onLimitChange }) => {
  const [inputPage, setInputPage] = useState(page);

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setInputPage(pageNum);
    }
  };

  React.useEffect(() => {
    setInputPage(page);
  }, [page]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 border-t text-sm gap-4">
      {/* Left: Info and limit selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-gray-600 text-xs">
          {total > 0 ? `${(page - 1) * limit + 1}–${Math.min(page * limit, total)}` : '0'} of {total}
        </span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          className="px-2 py-1 border rounded-md text-xs bg-white hover:bg-gray-50"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-gray-600 text-xs">per page</span>
      </div>

      {/* Center: Go to page input */}
      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <span className="text-gray-600 text-xs">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-12 px-2 py-1 border rounded-md text-xs text-center"
        />
        <span className="text-gray-600 text-xs">of {totalPages}</span>
        <button
          type="submit"
          className="px-2 py-1 border rounded-md text-xs bg-white hover:bg-gray-100 disabled:opacity-50"
          disabled={totalPages === 0}
        >
          Go
        </button>
      </form>

      {/* Right: Navigation buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1 || totalPages === 0}
          className="p-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || totalPages === 0}
          className="p-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="p-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages || totalPages === 0}
          className="p-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
