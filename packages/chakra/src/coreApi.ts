import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type RowModel,
  type Table,
  type TableOptions,
  type TableState,
} from '@tanstack/react-table';

export type CRT_RowData = RowData;
export type CRT_ColumnDef<TData extends CRT_RowData, TValue = unknown> = ColumnDef<TData, TValue>;
export type CRT_TableState = TableState;

export type CRT_FeatureToggles = {
  enableColumnOrdering?: boolean;
  enableColumnFilters?: boolean;
  enableExpanding?: boolean;
  enableGlobalFilter?: boolean;
  enableGrouping?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
};

export type CRT_TableOptions<TData extends CRT_RowData> = Omit<
  TableOptions<TData>,
  | 'getCoreRowModel'
  | 'getExpandedRowModel'
  | 'getFilteredRowModel'
  | 'getGroupedRowModel'
  | 'getPaginationRowModel'
  | 'getSortedRowModel'
> &
  CRT_FeatureToggles & {
    columns: CRT_ColumnDef<TData, any>[];
    data: TData[];
    getExpandedRowModel?: (table: Table<TData>) => () => RowModel<TData>;
    getFilteredRowModel?: (table: Table<TData>) => () => RowModel<TData>;
    getGroupedRowModel?: (table: Table<TData>) => () => RowModel<TData>;
    getPaginationRowModel?: (table: Table<TData>) => () => RowModel<TData>;
    getSortedRowModel?: (table: Table<TData>) => () => RowModel<TData>;
  };

export type CRT_TableInstance<TData extends CRT_RowData> = Table<TData>;

const defaultToggles: Required<CRT_FeatureToggles> = {
  enableColumnOrdering: true,
  enableColumnFilters: true,
  enableExpanding: true,
  enableGlobalFilter: true,
  enableGrouping: true,
  enablePagination: true,
  enableSorting: true,
};

const resolveRowModels = <TData extends CRT_RowData>(toggles: CRT_FeatureToggles) => {
  const merged = { ...defaultToggles, ...toggles };

  return {
    getFilteredRowModel:
      merged.enableColumnFilters || merged.enableGlobalFilter
        ? getFilteredRowModel<TData>()
        : undefined,
    getExpandedRowModel: merged.enableExpanding ? getExpandedRowModel<TData>() : undefined,
    getGroupedRowModel: merged.enableGrouping ? getGroupedRowModel<TData>() : undefined,
    getPaginationRowModel: merged.enablePagination ? getPaginationRowModel<TData>() : undefined,
    getSortedRowModel: merged.enableSorting ? getSortedRowModel<TData>() : undefined,
  };
};

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

  const featureToggles: CRT_FeatureToggles = {};
  if (enableColumnFilters !== undefined) featureToggles.enableColumnFilters = enableColumnFilters;
  if (enableGlobalFilter !== undefined) featureToggles.enableGlobalFilter = enableGlobalFilter;
  if (enableExpanding !== undefined) featureToggles.enableExpanding = enableExpanding;
  if (enableGrouping !== undefined) featureToggles.enableGrouping = enableGrouping;
  if (enablePagination !== undefined) featureToggles.enablePagination = enablePagination;
  if (enableSorting !== undefined) featureToggles.enableSorting = enableSorting;

  const resolved = resolveRowModels<TData>(featureToggles);
  const expandedModel = getExpandedRowModel ?? resolved.getExpandedRowModel;
  const filteredModel = getFilteredRowModel ?? resolved.getFilteredRowModel;
  const groupedModel = getGroupedRowModel ?? resolved.getGroupedRowModel;
  const paginationModel = getPaginationRowModel ?? resolved.getPaginationRowModel;
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
