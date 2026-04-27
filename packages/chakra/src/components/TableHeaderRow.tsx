import { Button, TableColumnHeader, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { HeaderGroup } from '@tanstack/react-table';
import type { CRT_RowData } from '@chakra-react-table/core';
import { SelectionCheckbox } from './SelectionCheckbox';
import { SortIndicator } from './SortIndicator';

type TableHeaderRowProps<TData extends CRT_RowData> = {
  allRowsSelected: boolean;
  headerGroup: HeaderGroup<TData>;
  onToggleAllRows: (checked: boolean) => void;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  someRowsSelected: boolean;
};

export const TableHeaderRow = <TData extends CRT_RowData>({
  allRowsSelected,
  headerGroup,
  onToggleAllRows,
  rowNumbersEnabled,
  rowSelectionEnabled,
  someRowsSelected,
}: TableHeaderRowProps<TData>) => (
  <TableRow key={headerGroup.id}>
    {rowNumbersEnabled && <TableColumnHeader width="52px">#</TableColumnHeader>}

    {rowSelectionEnabled && (
      <TableColumnHeader width="40px">
        <SelectionCheckbox
          ariaLabel="Select all rows"
          checked={allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false}
          onCheckedChange={onToggleAllRows}
        />
      </TableColumnHeader>
    )}

    {headerGroup.headers.map((header) => {
      const canSort = header.column.getCanSort();
      const sorted = header.column.getIsSorted();
      return (
        <TableColumnHeader key={header.id}>
          {header.isPlaceholder ? null : canSort ? (
            <Button onClick={header.column.getToggleSortingHandler()} size="xs" variant="ghost">
              {flexRender(header.column.columnDef.header, header.getContext())}
              <SortIndicator direction={sorted} />
            </Button>
          ) : (
            flexRender(header.column.columnDef.header, header.getContext())
          )}
        </TableColumnHeader>
      );
    })}
  </TableRow>
);
