import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

/**
 * Responsive FilterBar for listing pages with search, filter selects, and reset action.
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  children,
  onReset,
  hasActiveFilters = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-[#14141A] border border-[#2A2A35] rounded-xl text-left">
      {/* Search Input (44px touch target) */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full min-h-[44px] pl-10 pr-9 text-xs sm:text-sm bg-[#1C1C24] text-[#F5F5F7] placeholder:text-[#A1A1AA] border border-[#2A2A35] rounded-lg focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A1A1AA] hover:text-[#F5F5F7]"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Selects & Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {children}

        {hasActiveFilters && onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
