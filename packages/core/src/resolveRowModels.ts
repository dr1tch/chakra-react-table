import {
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { CRT_FeatureToggles, CRT_RowData } from './types';

const defaultToggles: Required<CRT_FeatureToggles> = {
  enableColumnOrdering: true,
  enableColumnFilters: true,
  enableExpanding: true,
  enableGlobalFilter: true,
  enableGrouping: true,
  enablePagination: true,
  enableSorting: true,
};

export const resolveRowModels = <TData extends CRT_RowData>(
  toggles: CRT_FeatureToggles,
) => {
  const merged = { ...defaultToggles, ...toggles };

  return {
    getFilteredRowModel:
      merged.enableColumnFilters || merged.enableGlobalFilter
        ? getFilteredRowModel<TData>()
        : undefined,
    getExpandedRowModel: merged.enableExpanding
      ? getExpandedRowModel<TData>()
      : undefined,
    getGroupedRowModel: merged.enableGrouping
      ? getGroupedRowModel<TData>()
      : undefined,
    getPaginationRowModel: merged.enablePagination
      ? getPaginationRowModel<TData>()
      : undefined,
    getSortedRowModel: merged.enableSorting
      ? getSortedRowModel<TData>()
      : undefined,
  };
};
