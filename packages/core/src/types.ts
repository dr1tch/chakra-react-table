import type {
  ColumnDef,
  RowData,
  Table,
  TableOptions,
  TableState,
} from '@tanstack/react-table';

export type CRT_RowData = RowData;

export type CRT_ColumnDef<TData extends CRT_RowData, TValue = unknown> =
  ColumnDef<TData, TValue>;

export type CRT_TableState = TableState;

export type CRT_TableOptions<TData extends CRT_RowData> = Omit<
  TableOptions<TData>,
  'getCoreRowModel'
> & {
  columns: CRT_ColumnDef<TData, any>[];
};

export type CRT_TableInstance<TData extends CRT_RowData> = Table<TData>;
