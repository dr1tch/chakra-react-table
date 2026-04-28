import {
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { CRT_RowData, CRT_TableInstance, CRT_TableOptions } from './types';
import { resolveRowModels } from './resolveRowModels';

export const useChakraReactTable = <TData extends CRT_RowData>(
  options: CRT_TableOptions<TData>,
): CRT_TableInstance<TData> => {
  const {
    enableColumnFilters,
    enableExpanding,
    enableGlobalFilter,
    enableGrouping,
    enablePagination,
    enableSorting,
    getExpandedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ...rest
  } = options;

  const featureToggles: {
    enableColumnFilters?: boolean;
    enableExpanding?: boolean;
    enableGlobalFilter?: boolean;
    enableGrouping?: boolean;
    enablePagination?: boolean;
    enableSorting?: boolean;
  } = {};
  if (enableColumnFilters !== undefined) {
    featureToggles.enableColumnFilters = enableColumnFilters;
  }
  if (enableGlobalFilter !== undefined) {
    featureToggles.enableGlobalFilter = enableGlobalFilter;
  }
  if (enableExpanding !== undefined) {
    featureToggles.enableExpanding = enableExpanding;
  }
  if (enableGrouping !== undefined) {
    featureToggles.enableGrouping = enableGrouping;
  }
  if (enablePagination !== undefined) {
    featureToggles.enablePagination = enablePagination;
  }
  if (enableSorting !== undefined) {
    featureToggles.enableSorting = enableSorting;
  }

  const resolved = resolveRowModels<TData>(featureToggles);
  const expandedModel = getExpandedRowModel ?? resolved.getExpandedRowModel;
  const filteredModel = getFilteredRowModel ?? resolved.getFilteredRowModel;
  const groupedModel = getGroupedRowModel ?? resolved.getGroupedRowModel;
  const paginationModel =
    getPaginationRowModel ?? resolved.getPaginationRowModel;
  const sortedModel = getSortedRowModel ?? resolved.getSortedRowModel;

  return useReactTable({
    columnResizeDirection: options.columnResizeDirection ?? 'ltr',
    columnResizeMode: options.columnResizeMode ?? 'onChange',
    ...rest,
    getCoreRowModel: getCoreRowModel(),
    ...(expandedModel ? { getExpandedRowModel: expandedModel } : {}),
    ...(filteredModel ? { getFilteredRowModel: filteredModel } : {}),
    ...(groupedModel ? { getGroupedRowModel: groupedModel } : {}),
    ...(paginationModel ? { getPaginationRowModel: paginationModel } : {}),
    ...(sortedModel ? { getSortedRowModel: sortedModel } : {}),
  });
};
