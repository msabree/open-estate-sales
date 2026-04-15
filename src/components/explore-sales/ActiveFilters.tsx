import * as React from 'react';

type DateRange = 'today' | 'weekend' | 'week' | 'month' | 'all' | string;

export interface Filters {
  dateRange?: DateRange;
  saleType?: string;
  distance: number;
}

interface Props {
  filters: Filters;
  salesCount: number;
  className?: string;
}

const getDateRangeLabel = (v?: DateRange) => {
  if (!v) return '';
  return v === 'today'
    ? 'Today'
    : v === 'weekend'
    ? 'This Weekend'
    : v === 'week'
    ? 'This Week'
    : v === 'month'
    ? 'This Month'
    : v === 'all'
    ? 'Upcoming Sales'
    : v;
};

export default function ActiveFilters({ filters, salesCount, className = '' }: Props) {
  return (
    <div
      className={`mb-4 sm:mb-6 p-3 sm:p-4 mx-auto bg-zinc-950/40 border border-zinc-800 rounded-xl ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-200">
          <span className="font-medium text-zinc-300">Active filters</span>

          {filters.dateRange && (
            <span className="px-2 py-1 bg-zinc-900/70 border border-zinc-800 rounded-full text-xs text-zinc-200">
              {getDateRangeLabel(filters.dateRange)}
            </span>
          )}

          {filters.saleType !== 'all' && filters.saleType && (
            <span className="px-2 py-1 bg-zinc-900/70 border border-zinc-800 rounded-full text-xs text-zinc-200">
              {filters.saleType === 'company' ? 'Company Sales' : 'Personal Sales'}
            </span>
          )}

          <span className="px-2 py-1 bg-zinc-900/70 border border-zinc-800 rounded-full text-xs text-zinc-200">
            Within {filters.distance} miles
          </span>
        </div>

        <div className="text-xs sm:text-sm text-accent text-center sm:text-right font-semibold">
          {salesCount} sale{salesCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  );
}