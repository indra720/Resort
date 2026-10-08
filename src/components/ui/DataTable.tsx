import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Check,
  ArrowLeftRight,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { Pagination } from './Pagination';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number | Date;
  searchable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  filterOptions?: {
    label: string;
    filterFn: (item: T, value: string) => boolean;
    options: { label: string; value: string }[];
  };
  actions?: (item: T) => React.ReactNode;
}

/**
 * Enterprise-grade DataTable built with plain HTML <table> and useState.
 * ZERO TanStack dependencies.
 * - Desktop: Interactive sortable table with column visibility toggle.
 * - Mobile (< 640px): Automatically converts into stacked cards showing ALL data with labels.
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items matching the current search or filters.',
  searchPlaceholder = 'Search table records...',
  pageSize = 5,
  filterOptions,
  actions,
}: DataTableProps<T>) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Active filter state
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Sort state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((col) => {
      initial[col.key] = true;
    });
    return initial;
  });

  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // View mode state ('table' by default to render full LG multi-column with horizontal scroll)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Toggle Column Visibility
  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Ensure at least one column remains visible
      const anyVisible = Object.values(next).some(Boolean);
      return anyVisible ? next : prev;
    });
  };

  // Filter and Search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply custom dropdown filter
    if (filterOptions && activeFilter !== 'ALL') {
      result = result.filter((item) => filterOptions.filterFn(item, activeFilter));
    }

    // Apply global text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        return columns.some((col) => {
          if (col.sortValue) {
            return String(col.sortValue(item)).toLowerCase().includes(q);
          }
          const val = (item as Record<string, unknown>)[col.key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        });
      });
    }

    // Apply Column Sort
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col && col.sortable) {
        result.sort((a, b) => {
          let valA: string | number = col.sortValue
            ? (col.sortValue(a) as string | number)
            : String((a as Record<string, unknown>)[col.key] ?? '');
          let valB: string | number = col.sortValue
            ? (col.sortValue(b) as string | number)
            : String((b as Record<string, unknown>)[col.key] ?? '');

          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();

          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, columns, filterOptions, activeFilter, searchQuery, sortKey, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle Sort Click
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const activeColumns = columns.filter((col) => visibleColumns[col.key] !== false);

  return (
    <div className="space-y-4 w-full">
      {/* Table Toolbar (Search, Filter, Column Visibility) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200/90 p-3 sm:p-3.5 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 text-xs sm:text-sm bg-[#FFF8F3] text-[#1F2937] placeholder:text-[#6B7280] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all"
          />
        </div>

        {/* Filter & Column Toggle Controls */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {filterOptions && (
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="min-h-[44px] px-3 text-xs bg-[#FFF8F3] text-[#1F2937] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#C2410C] shrink-0"
            >
              <option value="ALL">All {filterOptions.label}</option>
              {filterOptions.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* View Mode Switcher (Table [Full LG scrollable] vs Cards) */}
          <div className="flex items-center rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors',
                viewMode === 'table'
                  ? 'bg-[#C2410C] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              )}
              title="Table View (Full LG multi-column with clear smooth scroll)"
            >
              <TableIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn(
                'min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors',
                viewMode === 'cards'
                  ? 'bg-[#C2410C] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              )}
              title="Card View (Stacked cards)"
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsColumnDropdownOpen((prev) => !prev)}
              className="min-h-[44px] px-3 flex items-center gap-1.5 text-xs font-semibold bg-white text-[#1F2937] border border-[#E5E7EB] rounded-lg hover:border-[#C2410C] transition-colors shrink-0 whitespace-nowrap"
              title="Show or hide table columns"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
              <span>Columns</span>
            </button>

            {isColumnDropdownOpen && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setIsColumnDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-48 sm:w-52 max-w-[calc(100vw-32px)] rounded-xl bg-white border border-[#E5E7EB] shadow-xl p-2 z-50 space-y-1">
                  <p className="text-[10px] font-semibold uppercase text-[#6B7280] px-2 py-1">
                    Toggle Columns
                  </p>
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumn(col.key)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-[#1F2937] hover:bg-[#FFF8F3] transition-colors text-left"
                    >
                      <span className="truncate pr-2">{col.header}</span>
                      {visibleColumns[col.key] && (
                        <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Loading Skeleton View */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton variant="rectangular" className="h-12 w-full" />
          <Skeleton variant="rectangular" className="h-16 w-full" />
          <Skeleton variant="rectangular" className="h-16 w-full" />
          <Skeleton variant="rectangular" className="h-16 w-full" />
        </div>
      ) : paginatedData.length === 0 ? (
        /* Empty State */
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            searchQuery || activeFilter !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('ALL');
                }}
                className="text-xs text-[#C2410C] underline font-medium hover:text-[#9A3412]"
              >
                Reset Search & Filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="space-y-2">
              {/* Mobile Swipe Guidance Banner */}
              <div className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-[#C2410C] animate-pulse shrink-0" />
                  <span className="font-semibold text-[#1F2937]">Scroll horizontally for all columns</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C] bg-white border border-[#FED7AA] px-2 py-0.5 rounded shrink-0">
                  Full Table
                </span>
              </div>

              {/* Table View (Displays with full desktop clarity; smooth horizontal scroll on smaller screens) */}
              <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white pb-1 shadow-sm">
                <table className="w-full min-w-[840px] text-left text-sm text-[#1F2937] border-collapse">
                  <thead className="bg-[#FFF8F3] text-xs text-[#1F2937] uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      {activeColumns.map((col) => {
                        const isSorted = sortKey === col.key;
                        return (
                          <th
                            key={col.key}
                            className={cn('py-3.5 px-4 font-semibold select-none whitespace-nowrap', col.headerClassName)}
                          >
                            {col.sortable ? (
                              <button
                                type="button"
                                onClick={() => handleSort(col.key)}
                                className="flex items-center gap-1.5 hover:text-[#C2410C] transition-colors whitespace-nowrap text-[#1F2937]"
                              >
                                <span>{col.header}</span>
                                {isSorted ? (
                                  sortOrder === 'asc' ? (
                                    <ArrowUp className="w-3.5 h-3.5 text-[#C2410C]" />
                                  ) : (
                                    <ArrowDown className="w-3.5 h-3.5 text-[#C2410C]" />
                                  )
                                ) : (
                                  <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280]" />
                                )}
                              </button>
                            ) : (
                              <span>{col.header}</span>
                            )}
                          </th>
                        );
                      })}
                      {actions && (
                        <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap text-[#1F2937]">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {paginatedData.map((item) => (
                      <tr
                        key={keyExtractor(item)}
                        className="hover:bg-[#FFF8F3] transition-colors"
                      >
                        {activeColumns.map((col) => (
                          <td key={col.key} className={cn('py-3.5 px-4 text-sm whitespace-nowrap text-[#1F2937]', col.className)}>
                            {col.accessor(item)}
                          </td>
                        ))}
                        {actions && (
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">{actions(item)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Mobile Stacked Card View (Optional alternate view) */
            <div className="space-y-4">
              {paginatedData.map((item) => (
                <div
                  key={keyExtractor(item)}
                  className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 text-left shadow-sm"
                >
                  {activeColumns.map((col) => (
                    <div
                      key={col.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider shrink-0">
                        {col.header}:
                      </span>
                      <div className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                        {col.accessor(item)}
                      </div>
                    </div>
                  ))}
                  {actions && (
                    <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                      {actions(item)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}
