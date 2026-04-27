import type { Cell } from '@tanstack/react-table';
import type { CRT_RowData } from '@chakra-react-table/core';

export const toCopyText = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'bigint':
      return String(value);
    default:
      return null;
  }
};

export const isCellPrimitiveEditable = <TData extends CRT_RowData>(
  cell: Cell<TData, unknown>,
) => toCopyText(cell.getValue()) !== null;

export const getCellKey = <TData extends CRT_RowData>(cell: Cell<TData, unknown>) =>
  `${cell.row.id}:${cell.column.id}`;
