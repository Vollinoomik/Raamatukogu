import type { PaginationInfo } from '../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps): JSX.Element {
  const { currentPage, totalPages, itemsPerPage, totalItems, hasNextPage, hasPreviousPage } = pagination;

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white p-5 shadow-soft md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-600">
        Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-bold text-slate-900">{totalPages}</span> · Limit{' '}
        <span className="font-bold text-slate-900">{itemsPerPage}</span> · Total{' '}
        <span className="font-bold text-slate-900">{totalItems}</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
