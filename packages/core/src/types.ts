import type {
  ColumnDef,
  RowModel,
  RowData,
  Table,
  TableOptions,
  TableState,
} from '@tanstack/react-table';

export type CRT_RowData = RowData;

export type CRT_ColumnDef<TData extends CRT_RowData, TValue = unknown> =
  ColumnDef<TData, TValue>;

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
