import {
  Box,
  Input,
  TableBody,
  TableHeader,
  TableRoot,
  TableRow,
  TableCell,
  Text,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { CRT_RowData, CRT_TableInstance } from '@chakra-react-table/core';
import {
  ColumnControlsPanel,
  TableBodyRow,
  TableHeaderRow,
  TablePaginationControls,
} from './components';

export type ChakraReactTableProps<TData extends CRT_RowData> = {
  enableClickToCopy?: boolean;
  emptyState?: ReactNode;
  enableColumnOrderingControls?: boolean;
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowNumbers?: boolean;
  enableRowSelection?: boolean;
  table: CRT_TableInstance<TData>;
  tableProps?: Record<string, any>;
};

const moveItem = (items: string[], index: number, direction: -1 | 1) => {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  const currentValue = next[index];
  const targetValue = next[targetIndex];
  if (currentValue === undefined || targetValue === undefined) return items;
  next[index] = targetValue;
  next[targetIndex] = currentValue;
  return next;
};

export const ChakraReactTable = <TData extends CRT_RowData>({
  enableClickToCopy = false,
  emptyState,
  enableColumnOrderingControls = false,
  enableColumnVisibilityToggle = false,
  enableGlobalFilter = true,
  enablePagination = true,
  enableRowNumbers = false,
  enableRowSelection = false,
  table,
  tableProps,
}: ChakraReactTableProps<TData>) => {
  const {
    columnOrder,
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const pageCount = table.getPageCount();
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const visibleRows = table.getRowModel().rows;

  const allLeafColumns = table.getAllLeafColumns();
  const orderedColumns = useMemo(() => {
    const byId = new Map(allLeafColumns.map((column) => [column.id, column]));
    const ids = columnOrder?.length ? columnOrder : allLeafColumns.map((column) => column.id);
    return ids
      .map((id) => byId.get(id))
      .filter((column): column is (typeof allLeafColumns)[number] => Boolean(column));
  }, [allLeafColumns, columnOrder]);

  const moveColumn = (columnId: string, direction: -1 | 1) => {
    const currentOrder = (columnOrder?.length ? columnOrder : allLeafColumns.map((column) => column.id)).filter(
      (id) => id !== '__select__',
    );
    const index = currentOrder.indexOf(columnId);
    if (index < 0) return;
    table.setColumnOrder(moveItem(currentOrder, index, direction));
  };

  const rowSelectionEnabled =
    enableRowSelection && (table.options.enableRowSelection ?? true) !== false;
  const paginationEnabled = enablePagination;
  const rowNumbersEnabled = enableRowNumbers;

  return (
    <Box>
      <Box alignItems="center" display="flex" flexWrap="wrap" gap="2" mb="3">
        {enableGlobalFilter && (
          <Input
            flex="1"
            minW="220px"
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search rows..."
            value={(table.getState().globalFilter as string) ?? ''}
          />
        )}
      </Box>

      <ColumnControlsPanel
        enableColumnOrderingControls={enableColumnOrderingControls}
        enableColumnVisibilityToggle={enableColumnVisibilityToggle}
        onMoveColumn={moveColumn}
        orderedColumns={orderedColumns}
      />

      <TableRoot size="sm" variant="outline" {...tableProps}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeaderRow
              allRowsSelected={table.getIsAllRowsSelected()}
              headerGroup={headerGroup}
              key={headerGroup.id}
              onToggleAllRows={(checked) => table.toggleAllRowsSelected(checked)}
              rowNumbersEnabled={rowNumbersEnabled}
              rowSelectionEnabled={rowSelectionEnabled}
              someRowsSelected={table.getIsSomeRowsSelected()}
            />
          ))}
        </TableHeader>

        <TableBody>
          {visibleRows.length ? (
            visibleRows.map((row, visibleIndex) => (
              <TableBodyRow
                enableClickToCopy={enableClickToCopy}
                key={row.id}
                pageIndex={pageIndex}
                pageSize={pageSize}
                paginationEnabled={paginationEnabled}
                row={row}
                rowNumbersEnabled={rowNumbersEnabled}
                rowSelectionEnabled={rowSelectionEnabled}
                visibleIndex={visibleIndex}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  table.getVisibleLeafColumns().length +
                  (rowSelectionEnabled ? 1 : 0) +
                  (rowNumbersEnabled ? 1 : 0)
                }
              >
                {emptyState ?? (
                  <Text color="fg.muted" fontStyle="italic" py="4" textAlign="center">
                    No records to display
                  </Text>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {paginationEnabled && (
        <Box alignItems="center" display="flex" gap="2" justifyContent="space-between" mt="3">
          <Text color="fg.muted" fontSize="sm">
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Rows {Math.min(pageIndex * pageSize + 1, totalRows)}-
            {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
          </Text>
          <TablePaginationControls
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            count={Math.max(totalRows, 1)}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            page={Math.min(pageIndex + 1, Math.max(pageCount, 1))}
            pageSize={pageSize}
          />
        </Box>
      )}
    </Box>
  );
};
