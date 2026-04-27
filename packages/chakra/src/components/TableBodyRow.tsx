import { Box, TableCell, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import type { CRT_RowData } from '@chakra-react-table/core';
import { CopyCellAction } from './CopyCellAction';
import { SelectionCheckbox } from './SelectionCheckbox';

const toCopyText = (value: unknown): string | null => {
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

type TableBodyRowProps<TData extends CRT_RowData> = {
  enableClickToCopy: boolean;
  pageIndex: number;
  pageSize: number;
  paginationEnabled: boolean;
  row: Row<TData>;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  visibleIndex: number;
};

export const TableBodyRow = <TData extends CRT_RowData>({
  enableClickToCopy,
  pageIndex,
  pageSize,
  paginationEnabled,
  row,
  rowNumbersEnabled,
  rowSelectionEnabled,
  visibleIndex,
}: TableBodyRowProps<TData>) => (
  <TableRow key={row.id}>
    {rowNumbersEnabled && (
      <TableCell color="fg.muted" width="52px">
        {(paginationEnabled ? pageIndex * pageSize : 0) + visibleIndex + 1}
      </TableCell>
    )}

    {rowSelectionEnabled && (
      <TableCell width="40px">
        <SelectionCheckbox
          ariaLabel={`Select row ${row.id}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
        />
      </TableCell>
    )}

    {row.getVisibleCells().map((cell) => {
      const copyText = toCopyText(cell.getValue());
      return (
        <TableCell key={cell.id}>
          <Box alignItems="center" display="flex" gap="2">
            <Box flex="1" minW="0">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Box>
            {enableClickToCopy && copyText ? <CopyCellAction value={copyText} /> : null}
          </Box>
        </TableCell>
      );
    })}
  </TableRow>
);
