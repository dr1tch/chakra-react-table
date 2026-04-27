import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
} from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type {
  CRT_RowData,
  CRT_TableInstance,
} from '@chakra-react-table/core';

export type ChakraReactTableProps<TData extends CRT_RowData> = {
  table: CRT_TableInstance<TData>;
};

export const ChakraReactTable = <TData extends CRT_RowData>({
  table,
}: ChakraReactTableProps<TData>) => {
  return (
    <TableRoot size="sm" variant="outline">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableColumnHeader key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableColumnHeader>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
};
