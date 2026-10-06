import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

/**
 * Reusable accessible pagination with 44px mobile touch targets.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem =
    totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-[#A1A1AA]',
        className
      )}
    >
      {/* Items summary */}
      {totalItems !== undefined && (
        <div className="text-center sm:text-left">
          Showing <span className="font-semibold text-[#F5F5F7]">{startItem}</span> to{' '}
          <span className="font-semibold text-[#F5F5F7]">{endItem}</span> of{' '}
          <span className="font-semibold text-[#FF6B00]">{totalItems}</span> records
        </div>
      )}

      {/* Page controls (44px min touch buttons) */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#14141A] border border-[#2A2A35] text-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#14141A] border border-[#2A2A35] text-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-[#A1A1AA]">
                  ...
                </span>
              );
            }
            const pageNum = p as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#FF6B00] text-white font-semibold'
                    : 'bg-[#14141A] border border-[#2A2A35] text-[#F5F5F7] hover:border-[#FF6B00] hover:text-[#FF6B00]'
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#14141A] border border-[#2A2A35] text-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#14141A] border border-[#2A2A35] text-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
