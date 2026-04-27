import {
  ActionBar,
  Box,
  Button,
  Input,
  TableBody,
  TableCaption,
  TableCell,
  TableColumn,
  TableColumnGroup,
  TableHeader,
  TableRoot,
  type TableRootProps,
  TableRow,
  Text,
} from '@chakra-ui/react';
import type { Cell, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { CRT_RowData, CRT_TableInstance } from '@chakra-react-table/core';
import {
  ColumnControlsPanel,
  CreateRowPanel,
  getCellKey,
  toCopyText,
  TableBodyRow,
  TableHeaderRow,
  TablePaginationControls,
} from './components';

export type CRT_CellUpdatePayload<TData extends CRT_RowData> = {
  columnId: string;
  row: TData;
  rowId: string;
  rowIndex: number;
  value: string;
};

export type ChakraReactTableProps<TData extends CRT_RowData> = {
  bordered?: boolean;
  caption?: ReactNode;
  captionSide?: 'bottom' | 'top';
  enableActionBar?: boolean;
  enableClickToCopy?: boolean;
  enableColumnActions?: boolean;
  enableColumnResizing?: boolean;
  enableCreating?: boolean;
  enableEditing?: boolean;
  emptyState?: ReactNode;
  enableColumnOrderingControls?: boolean;
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowNumbers?: boolean;
  enableRowSelection?: boolean;
  editableColumnIds?: string[];
  onCreateRow?: (values: Partial<TData>) => void;
  onUpdateCell?: (payload: CRT_CellUpdatePayload<TData>) => void;
  renderCellActions?: (cell: Cell<TData, unknown>) => ReactNode;
  renderRowActions?: (row: Row<TData>) => ReactNode;
  renderActionBar?: (args: {
    selectedRows: Row<TData>[];
    table: CRT_TableInstance<TData>;
  }) => ReactNode;
  showColumnBorder?: boolean;
  showColumnGroup?: boolean;
  stickyHeader?: boolean;
  striped?: boolean;
  table: CRT_TableInstance<TData>;
  tableProps?: TableRootProps;
  tableVariant?: 'line' | 'outline';
  interactive?: boolean;
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
  bordered = true,
  caption,
  captionSide = 'top',
  enableActionBar = true,
  enableClickToCopy = false,
  enableColumnActions = false,
  enableColumnResizing = false,
  enableCreating = false,
  enableEditing = false,
  emptyState,
  enableColumnOrderingControls = false,
  enableColumnVisibilityToggle = false,
  enableGlobalFilter = true,
  enablePagination = true,
  enableRowNumbers = false,
  enableRowSelection = false,
  editableColumnIds,
  onCreateRow,
  onUpdateCell,
  renderCellActions,
  renderRowActions,
  renderActionBar,
  showColumnBorder = true,
  showColumnGroup = true,
  stickyHeader = true,
  striped = true,
  table,
  tableProps,
  tableVariant = 'outline',
  interactive = true,
}: ChakraReactTableProps<TData>) => {
  const [createDraft, setCreateDraft] = useState<Record<string, string>>({});
  const [isCreatingRow, setIsCreatingRow] = useState(false);
  const [editedCellValues, setEditedCellValues] = useState<Record<string, string>>({});
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const {
    columnSizingInfo,
    columnOrder,
    pagination: { pageIndex, pageSize },
  } = table.getState();
  const resizingColumnId = columnSizingInfo?.isResizingColumn ?? false;
  const resizeDeltaOffset = columnSizingInfo?.deltaOffset ?? 0;
  const columnResizeDirection = table.options.columnResizeDirection ?? 'ltr';
  const columnResizeMode = table.options.columnResizeMode ?? 'onChange';

  const pageCount = table.getPageCount();
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const visibleRows = table.getRowModel().rows;
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const allLeafColumns = table.getAllLeafColumns();
  const orderedColumns = useMemo(() => {
    const byId = new Map(allLeafColumns.map((column) => [column.id, column]));
    const ids = columnOrder?.length ? columnOrder : allLeafColumns.map((column) => column.id);
    return ids
      .map((id) => byId.get(id))
      .filter((column): column is (typeof allLeafColumns)[number] => Boolean(column));
  }, [allLeafColumns, columnOrder]);

  const moveColumn = (columnId: string, direction: -1 | 1) => {
    const currentOrder = (
      columnOrder?.length ? columnOrder : allLeafColumns.map((column) => column.id)
    ).filter((id) => id !== '__select__');
    const index = currentOrder.indexOf(columnId);
    if (index < 0) return;
    table.setColumnOrder(moveItem(currentOrder, index, direction));
  };

  const rowSelectionEnabled =
    enableRowSelection && (table.options.enableRowSelection ?? true) !== false;
  const paginationEnabled = enablePagination;
  const rowNumbersEnabled = enableRowNumbers;
  const hasRowActions = Boolean(renderRowActions);
  const creatableColumns = useMemo(
    () =>
      allLeafColumns.filter((column) => {
        if (column.id.startsWith('__')) return false;
        const value = toCopyText(column.id);
        return Boolean(value);
      }),
    [allLeafColumns],
  );

  const handleStartEditing = (cell: Cell<TData, unknown>) => {
    const cellKey = getCellKey(cell);
    const current = editedCellValues[cellKey] ?? toCopyText(cell.getValue()) ?? '';
    setEditingCellId(cellKey);
    setEditingValue(current);
  };

  const handleCommitEditing = (cell: Cell<TData, unknown>) => {
    const cellKey = getCellKey(cell);
    setEditedCellValues((prev) => ({ ...prev, [cellKey]: editingValue }));
    setEditingCellId(null);
    onUpdateCell?.({
      columnId: cell.column.id,
      row: cell.row.original as TData,
      rowId: cell.row.id,
      rowIndex: cell.row.index,
      value: editingValue,
    });
  };

  const openCreateRow = () => {
    const initialDraft = Object.fromEntries(
      creatableColumns.map((column) => [column.id, '']),
    );
    setCreateDraft(initialDraft);
    setIsCreatingRow(true);
  };

  const saveCreateRow = () => {
    onCreateRow?.(createDraft as Partial<TData>);
    setIsCreatingRow(false);
  };

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

      {enableCreating && (
        <CreateRowPanel
          columns={creatableColumns.map((column) => ({
            id: column.id,
            label: String(column.columnDef.header ?? column.id),
          }))}
          isOpen={isCreatingRow}
          onCancel={() => setIsCreatingRow(false)}
          onOpen={openCreateRow}
          onSave={saveCreateRow}
          onValueChange={(columnId, value) =>
            setCreateDraft((prev) => ({ ...prev, [columnId]: value }))
          }
          values={createDraft}
        />
      )}

      <ColumnControlsPanel
        enableColumnOrderingControls={enableColumnOrderingControls}
        enableColumnVisibilityToggle={enableColumnVisibilityToggle}
        onMoveColumn={moveColumn}
        orderedColumns={orderedColumns}
      />

      {enableActionBar && rowSelectionEnabled && selectedCount > 0 ? (
        <ActionBar.Root open>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <Text fontSize="sm" fontWeight="medium">
                {selectedCount} row{selectedCount === 1 ? '' : 's'} selected
              </Text>
              <ActionBar.Separator />
              {renderActionBar?.({ selectedRows, table })}
              <Button
                onClick={() => table.toggleAllRowsSelected(false)}
                size="xs"
                variant="outline"
              >
                Clear selection
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      ) : null}

      <Box overflowX="auto">
        <TableRoot
          interactive={interactive}
          native
          showColumnBorder={showColumnBorder || bordered}
          size="sm"
          stickyHeader={stickyHeader}
          striped={striped}
          variant={bordered ? tableVariant : 'line'}
          {...tableProps}
        >
          {caption ? <TableCaption style={{ captionSide }}>{caption}</TableCaption> : null}
          {showColumnGroup ? (
            <TableColumnGroup>
              {rowNumbersEnabled ? <TableColumn htmlWidth="52px" /> : null}
              {rowSelectionEnabled ? <TableColumn htmlWidth="40px" /> : null}
              {table.getVisibleLeafColumns().map((column) => (
                <TableColumn key={column.id} htmlWidth={`${column.getSize()}px`} />
              ))}
              {hasRowActions ? <TableColumn htmlWidth="80px" /> : null}
            </TableColumnGroup>
          ) : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeaderRow
                allRowsSelected={table.getIsAllRowsSelected()}
                enableColumnActions={enableColumnActions}
                enableColumnResizing={enableColumnResizing}
                hasRowActions={hasRowActions}
                headerGroup={headerGroup}
                key={headerGroup.id}
                columnResizeDirection={columnResizeDirection}
                columnResizeMode={columnResizeMode}
                onToggleAllRows={(checked) => table.toggleAllRowsSelected(checked)}
                resizeDeltaOffset={resizeDeltaOffset}
                rowNumbersEnabled={rowNumbersEnabled}
                rowSelectionEnabled={rowSelectionEnabled}
                resizingColumnId={resizingColumnId}
                someRowsSelected={table.getIsSomeRowsSelected()}
              />
            ))}
          </TableHeader>

          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row, visibleIndex) => (
                <TableBodyRow
                  enableClickToCopy={enableClickToCopy}
                  enableColumnResizing={enableColumnResizing}
                  enableEditing={enableEditing}
                  columnResizeDirection={columnResizeDirection}
                  columnResizeMode={columnResizeMode}
                  editableColumnIds={editableColumnIds}
                  editedCellValues={editedCellValues}
                  editingCellId={editingCellId}
                  editingValue={editingValue}
                  key={row.id}
                  onChangeEditingValue={setEditingValue}
                  onCommitEditing={handleCommitEditing}
                  onStartEditing={handleStartEditing}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  paginationEnabled={paginationEnabled}
                  renderCellActions={renderCellActions}
                  renderRowActions={renderRowActions}
                  row={row}
                  resizingColumnId={resizingColumnId}
                  rowNumbersEnabled={rowNumbersEnabled}
                  rowSelectionEnabled={rowSelectionEnabled}
                  highlightOnHover={interactive}
                  visibleIndex={visibleIndex}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    table.getVisibleLeafColumns().length +
                    (rowSelectionEnabled ? 1 : 0) +
                    (rowNumbersEnabled ? 1 : 0) +
                    (hasRowActions ? 1 : 0)
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
      </Box>

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
