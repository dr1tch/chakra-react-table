import {
  Box,
  Button,
  Input,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
  chakra,
} from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { CRT_RowData, CRT_TableInstance } from '@chakra-react-table/core';
import { DefaultIcons } from '@chakra-react-table/icons';

export type ChakraReactTableProps<TData extends CRT_RowData> = {
  emptyState?: ReactNode;
  enableColumnOrderingControls?: boolean;
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  table: CRT_TableInstance<TData>;
  tableProps?: Record<string, any>;
};

const SortIndicator = ({ direction }: { direction: false | 'asc' | 'desc' }) => {
  if (!direction) return null;
  if (direction === 'asc') return <span aria-hidden="true"> ▲</span>;
  return <span aria-hidden="true"> ▼</span>;
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
  emptyState,
  enableColumnOrderingControls = false,
  enableColumnVisibilityToggle = false,
  enableGlobalFilter = true,
  enablePagination = true,
  enableRowSelection = false,
  table,
  tableProps,
}: ChakraReactTableProps<TData>) => {
  const [showColumnPanel, setShowColumnPanel] = useState(false);

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

        {(enableColumnVisibilityToggle || enableColumnOrderingControls) && (
          <Button
            onClick={() => setShowColumnPanel((prev) => !prev)}
            size="sm"
            variant="outline"
          >
            Columns
          </Button>
        )}
      </Box>

      {showColumnPanel && (enableColumnVisibilityToggle || enableColumnOrderingControls) && (
        <Box border="1px solid" borderColor="border.muted" borderRadius="md" mb="3" p="3">
          {orderedColumns.map((column, index) => (
            <Box alignItems="center" display="flex" gap="2" justifyContent="space-between" key={column.id} py="1">
              <Box alignItems="center" display="flex" gap="2">
                {enableColumnVisibilityToggle && column.getCanHide() && (
                  <chakra.input
                    checked={column.getIsVisible()}
                    onChange={(event) => column.toggleVisibility(event.target.checked)}
                    type="checkbox"
                  />
                )}
                <Text fontSize="sm">{String(column.columnDef.header ?? column.id)}</Text>
              </Box>

              {enableColumnOrderingControls && (
                <Box display="flex" gap="1">
                  <Button
                    disabled={index === 0}
                    onClick={() => moveColumn(column.id, -1)}
                    size="xs"
                    variant="ghost"
                  >
                    ↑
                  </Button>
                  <Button
                    disabled={index === orderedColumns.length - 1}
                    onClick={() => moveColumn(column.id, 1)}
                    size="xs"
                    variant="ghost"
                  >
                    ↓
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <TableRoot size="sm" variant="outline" {...tableProps}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {rowSelectionEnabled && (
                <TableColumnHeader width="40px">
                  <chakra.input
                    aria-label="Select all rows"
                    checked={table.getIsAllRowsSelected()}
                    onChange={(event) => table.toggleAllRowsSelected(event.target.checked)}
                    type="checkbox"
                  />
                </TableColumnHeader>
              )}

              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <TableColumnHeader key={header.id}>
                    {header.isPlaceholder ? null : canSort ? (
                      <Button
                        onClick={header.column.getToggleSortingHandler()}
                        size="xs"
                        variant="ghost"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <SortIndicator direction={sorted} />
                      </Button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableColumnHeader>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {visibleRows.length ? (
            visibleRows.map((row) => (
              <TableRow key={row.id}>
                {rowSelectionEnabled && (
                  <TableCell width="40px">
                    <chakra.input
                      aria-label={`Select row ${row.id}`}
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      onChange={(event) => row.toggleSelected(event.target.checked)}
                      type="checkbox"
                    />
                  </TableCell>
                )}

                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length + (rowSelectionEnabled ? 1 : 0)}>
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

      {enablePagination && (
        <Box alignItems="center" display="flex" gap="2" justifyContent="space-between" mt="3">
          <Text color="fg.muted" fontSize="sm">
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Rows {Math.min(pageIndex * pageSize + 1, totalRows)}-
            {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
          </Text>
          <Box display="flex" gap="1">
            <Button
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="xs"
              variant="outline"
            >
              <DefaultIcons.ChevronLeftIcon />
            </Button>
            <Button
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="xs"
              variant="outline"
            >
              <DefaultIcons.ChevronRightIcon />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
