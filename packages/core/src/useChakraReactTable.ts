import {
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { CRT_RowData, CRT_TableInstance, CRT_TableOptions } from './types';

export const useChakraReactTable = <TData extends CRT_RowData>(
  options: CRT_TableOptions<TData>,
): CRT_TableInstance<TData> => {
  return useReactTable({
    ...options,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
};
