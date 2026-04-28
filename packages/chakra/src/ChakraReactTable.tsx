import {
  ActionBar,
  Box,
  Button,
  IconButton,
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
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Cell, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CRT_RowData, CRT_TableInstance } from './coreApi';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  ColumnControlsPanel,
  CreateRowPanel,
  reorderById,
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
  density?: 'comfortable' | 'compact' | 'spacious';
  enableActionBar?: boolean;
  enableClickToCopy?: boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnOrderingControls?: boolean;
  enableColumnResizing?: boolean;
  enableRowOrderingControls?: boolean;
  enableCreating?: boolean;
  enableEditing?: boolean;
  emptyState?: ReactNode;
  enableColumnVisibilityToggle?: boolean;
  enableExpanding?: boolean;
  enableFullScreen?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowDragging?: boolean;
  enableVirtualization?: boolean;
  enableRowPinning?: boolean;
  enableRowNumbers?: boolean;
  enableRowSelection?: boolean;
  editableColumnIds?: string[];
  onCreateRow?: (values: Partial<TData>) => void;
  onReorderRows?: (sourceRow: Row<TData>, targetRow: Row<TData>) => void;
  onUpdateCell?: (payload: CRT_CellUpdatePayload<TData>) => void;
  renderCellActions?: (cell: Cell<TData, unknown>) => ReactNode;
  renderDetailPanel?: (row: Row<TData>) => ReactNode;
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
  isLoading?: boolean;
  layoutMode?: 'auto' | 'fixed';
  loadingRowCount?: number;
  loadingType?: 'overlay' | 'skeleton';
  enableMemoizedRows?: boolean;
  virtualizationHeight?: number;
  virtualizationOverscan?: number;
  virtualizationRowHeight?: number;
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
  density = 'compact',
  enableActionBar = true,
  enableClickToCopy = false,
  enableColumnActions = false,
  enableColumnDragging = false,
  enableColumnOrderingControls = false,
  enableColumnResizing = false,
  enableRowOrderingControls = false,
  enableCreating = false,
  enableEditing = false,
  emptyState,
  enableColumnVisibilityToggle = false,
  enableExpanding = false,
  enableFullScreen = false,
  enableGlobalFilter = true,
  enablePagination = true,
  enableRowDragging = false,
  enableVirtualization = false,
  enableRowPinning = false,
  enableRowNumbers = false,
  enableRowSelection = false,
  editableColumnIds,
  isLoading = false,
  layoutMode = 'auto',
  loadingRowCount = 8,
  loadingType = 'skeleton',
  enableMemoizedRows = false,
  virtualizationHeight = 520,
  virtualizationOverscan = 6,
  virtualizationRowHeight = 44,
  onCreateRow,
  onReorderRows,
  onUpdateCell,
  renderCellActions,
  renderDetailPanel,
  renderRowActions,
  renderActionBar,
  showColumnBorder = true,
  showColumnGroup = true,
  stickyHeader = true,
  striped = false,
  table,
  tableProps,
  tableVariant = 'outline',
  interactive = true,
}: ChakraReactTableProps<TData>) => {
  const [createDraft, setCreateDraft] = useState<Record<string, string>>({});
  const [isCreatingRow, setIsCreatingRow] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editedCellValues, setEditedCellValues] = useState<Record<string, string>>({});
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const [hideSelectionActionBar, setHideSelectionActionBar] = useState(false);
  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
  const visibleLeafColumns = table.getVisibleLeafColumns();
  const headerGroups = table.getHeaderGroups();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const stickyHeaderEnabled = stickyHeader && headerGroups.length <= 1;

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
  const rowPinningEnabled =
    enableRowPinning && (table.options.enableRowPinning ?? true) !== false;
  const topPinnedRows = rowPinningEnabled ? table.getTopRows() : [];
  const bottomPinnedRows = rowPinningEnabled ? table.getBottomRows() : [];
  const centerRows = rowPinningEnabled ? table.getCenterRows() : visibleRows;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDndStart = (event: DragStartEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === 'column') {
      setDraggingColumnId(String(event.active.data.current?.columnId ?? ''));
    }
    if (dragType === 'row') {
      setDraggingRowId(String(event.active.data.current?.rowId ?? ''));
    }
  };

  const handleDndEnd = (event: DragEndEvent) => {
    const dragType = event.active.data.current?.type;
    if (!event.over) {
      setDraggingColumnId(null);
      setDraggingRowId(null);
      return;
    }

    if (dragType === 'column') {
      const sourceColumnId = String(event.active.data.current?.columnId ?? '');
      const targetColumnId = String(event.over.data.current?.columnId ?? '');
      if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
        const currentOrder = columnOrder?.length
          ? [...columnOrder]
          : allLeafColumns.map((column) => column.id);
        table.setColumnOrder(reorderById(currentOrder, sourceColumnId, targetColumnId));
      }
      setDraggingColumnId(null);
      return;
    }

    if (dragType === 'row') {
      const sourceRowId = String(event.active.data.current?.rowId ?? '');
      const targetRowId = String(event.over.data.current?.rowId ?? '');
      if (sourceRowId && targetRowId && sourceRowId !== targetRowId) {
        const sourceRow = centerRows.find((candidate) => candidate.id === sourceRowId);
        const targetRow = centerRows.find((candidate) => candidate.id === targetRowId);
        if (sourceRow && targetRow) {
          onReorderRows?.(sourceRow, targetRow);
        }
      }
      setDraggingRowId(null);
    }
  };
  const allRowsPinned =
    rowPinningEnabled &&
    table.getPrePaginationRowModel().rows.length > 0 &&
    centerRows.length === 0;
  const rowExpandingEnabled =
    enableExpanding || Boolean(renderDetailPanel) || (table.options.enableExpanding ?? false);
  const rowOrderingEnabled = enableRowOrderingControls && Boolean(onReorderRows);
  const rowDraggingEnabled = enableRowDragging && Boolean(onReorderRows);
  const columnDraggingEnabled = enableColumnDragging;
  const allRowsExpanded = table.getIsAllRowsExpanded();
  const paginationEnabled = enablePagination;
  const virtualizationEnabled =
    enableVirtualization &&
    !isLoading &&
    !rowPinningEnabled &&
    !rowExpandingEnabled &&
    !rowDraggingEnabled;
  const rowNumbersEnabled = enableRowNumbers;
  const hasRowActions = Boolean(renderRowActions);
  const detailPanelColSpan =
    visibleLeafColumns.length +
    (rowSelectionEnabled ? 1 : 0) +
    (rowPinningEnabled ? 1 : 0) +
    (rowDraggingEnabled ? 1 : 0) +
    (rowOrderingEnabled ? 1 : 0) +
    (rowNumbersEnabled ? 1 : 0) +
    (rowExpandingEnabled ? 1 : 0) +
    (hasRowActions ? 1 : 0);
  const totalVisibleColumnCount = detailPanelColSpan;
  const virtualStartIndex = virtualizationEnabled
    ? Math.max(0, Math.floor(virtualScrollTop / virtualizationRowHeight) - virtualizationOverscan)
    : 0;
  const virtualEndIndex = virtualizationEnabled
    ? Math.min(
        centerRows.length,
        Math.ceil((virtualScrollTop + virtualizationHeight) / virtualizationRowHeight) +
          virtualizationOverscan,
      )
    : centerRows.length;
  const virtualizedCenterRows = virtualizationEnabled
    ? centerRows.slice(virtualStartIndex, virtualEndIndex)
    : centerRows;
  const virtualTopPadding = virtualizationEnabled
    ? virtualStartIndex * virtualizationRowHeight
    : 0;
  const virtualBottomPadding = virtualizationEnabled
    ? (centerRows.length - virtualEndIndex) * virtualizationRowHeight
    : 0;
  const resolvedBodyRows = useMemo(
    () => [...topPinnedRows, ...virtualizedCenterRows, ...bottomPinnedRows],
    [bottomPinnedRows, topPinnedRows, virtualizedCenterRows],
  );
  const bodyRows = enableMemoizedRows ? resolvedBodyRows : [...topPinnedRows, ...virtualizedCenterRows, ...bottomPinnedRows];
  const tableSize = density === 'comfortable' ? 'md' : density === 'spacious' ? 'lg' : 'sm';
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

  useEffect(() => {
    if (!isFullScreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

  return (
    <Box
      bg={isFullScreen ? 'bg' : undefined}
      bottom={isFullScreen ? 0 : undefined}
      display={isFullScreen ? 'flex' : undefined}
      flexDirection={isFullScreen ? 'column' : undefined}
      gap={isFullScreen ? '3' : undefined}
      left={isFullScreen ? 0 : undefined}
      overflow={isFullScreen ? 'hidden' : undefined}
      p={isFullScreen ? '4' : undefined}
      position={isFullScreen ? 'fixed' : undefined}
      right={isFullScreen ? 0 : undefined}
      top={isFullScreen ? 0 : undefined}
      zIndex={isFullScreen ? 'overlay' : undefined}
    >
      <DndContext sensors={sensors} onDragStart={handleDndStart} onDragEnd={handleDndEnd}>
      <Box
        alignItems={{ base: 'stretch', md: 'center' }}
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        gap="2"
        mb="3"
      >
        {enableGlobalFilter && (
          <Input
            maxW={{ base: 'full', md: '320px' }}
            w={{ base: 'full', md: 'auto' }}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search rows..."
            value={(table.getState().globalFilter as string) ?? ''}
          />
        )}
        <Box
          alignItems="center"
          display="flex"
          flexWrap="wrap"
          gap="2"
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          ml={{ base: '0', md: 'auto' }}
          w={{ base: 'full', md: 'auto' }}
        >
          {enableCreating && !isCreatingRow && (
            <Button onClick={openCreateRow} size="sm" variant="outline">
              Add row
            </Button>
          )}
          <ColumnControlsPanel
            enableColumnOrderingControls={enableColumnOrderingControls}
            enableColumnVisibilityToggle={enableColumnVisibilityToggle}
            onMoveColumn={moveColumn}
            orderedColumns={orderedColumns}
          />
          {enableFullScreen && (
            <IconButton
              aria-label={isFullScreen ? 'Exit fullscreen table' : 'Enter fullscreen table'}
              onClick={() => setIsFullScreen((prev) => !prev)}
              size="sm"
              variant="outline"
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </IconButton>
          )}
        </Box>
      </Box>

      {enableCreating && isCreatingRow && (
        <CreateRowPanel
          columns={creatableColumns.map((column) => ({
            id: column.id,
            label: String(column.columnDef.header ?? column.id),
          }))}
          hideTrigger
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

      {enableActionBar && rowSelectionEnabled && selectedCount > 0 && !hideSelectionActionBar ? (
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

      <Box
        ref={virtualizationEnabled ? scrollContainerRef : undefined}
        onScroll={
          virtualizationEnabled
            ? (event) => setVirtualScrollTop(event.currentTarget.scrollTop)
            : undefined
        }
        position="relative"
        flex={isFullScreen ? 1 : undefined}
        minH={isFullScreen ? 0 : undefined}
        overflowY={virtualizationEnabled ? 'auto' : isFullScreen ? 'auto' : undefined}
        overflowX="auto"
        maxH={virtualizationEnabled ? `${virtualizationHeight}px` : undefined}
      >
        {isLoading && loadingType === 'overlay' ? (
          <Box
            alignItems="center"
            bg="bg/80"
            display="flex"
            inset={0}
            justifyContent="center"
            pointerEvents="none"
            position="absolute"
            zIndex={4}
          >
            <Spinner size="md" />
          </Box>
        ) : null}
        <Box
          borderColor={bordered ? 'border' : 'transparent'}
          borderRadius="md"
          borderWidth={bordered ? '1px' : '0'}
          overflow="hidden"
          boxShadow={bordered ? 'sm' : undefined}
        >
          <TableRoot
            interactive={interactive}
            native
            size={tableSize}
            showColumnBorder={showColumnBorder || bordered}
            stickyHeader={stickyHeaderEnabled}
            striped={striped}
            variant={bordered ? tableVariant : 'line'}
            w="full"
            css={{ tableLayout: layoutMode }}
            {...tableProps}
          >
          {showColumnGroup ? (
            <TableColumnGroup>
              {rowNumbersEnabled ? <TableColumn htmlWidth="52px" /> : null}
              {rowPinningEnabled ? <TableColumn htmlWidth="56px" /> : null}
              {rowDraggingEnabled ? <TableColumn htmlWidth="44px" /> : null}
              {rowOrderingEnabled ? <TableColumn htmlWidth="56px" /> : null}
              {rowExpandingEnabled ? <TableColumn htmlWidth="40px" /> : null}
              {rowSelectionEnabled ? <TableColumn htmlWidth="40px" /> : null}
              {visibleLeafColumns.map((column) => (
                <TableColumn key={column.id} htmlWidth={`${column.getSize()}px`} />
              ))}
              {hasRowActions ? <TableColumn htmlWidth="80px" /> : null}
            </TableColumnGroup>
          ) : null}
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableHeaderRow
                allRowsSelected={table.getIsAllRowsSelected()}
                allRowsPinned={allRowsPinned}
                enableColumnActions={enableColumnActions}
                enableColumnDragging={columnDraggingEnabled}
                enableColumnResizing={enableColumnResizing}
                draggingColumnId={draggingColumnId}
                rowDraggingEnabled={rowDraggingEnabled}
                rowOrderingEnabled={rowOrderingEnabled}
                rowPinningEnabled={rowPinningEnabled}
                rowExpandingEnabled={rowExpandingEnabled}
                hasRowActions={hasRowActions}
                headerGroup={headerGroup}
                key={headerGroup.id}
                columnResizeDirection={columnResizeDirection}
                columnResizeMode={columnResizeMode}
                onToggleAllRows={(checked) => table.toggleAllRowsSelected(checked)}
                onToggleAllRowsPinned={() => {
                  if (allRowsPinned) {
                    table.setRowPinning({ bottom: [], top: [] });
                    return;
                  }
                  table.setRowPinning({
                    bottom: [],
                    top: table.getPrePaginationRowModel().rows.map((row) => row.id),
                  });
                }}
                onToggleAllExpandedRows={() => table.toggleAllRowsExpanded()}
                allRowsExpanded={allRowsExpanded}
                resizeDeltaOffset={resizeDeltaOffset}
                rowNumbersEnabled={rowNumbersEnabled}
                rowSelectionEnabled={rowSelectionEnabled}
                resizingColumnId={resizingColumnId}
                someRowsSelected={table.getIsSomeRowsSelected()}
              />
            ))}
          </TableHeader>

          <TableBody
            onMouseEnter={() => setHideSelectionActionBar(true)}
            onMouseLeave={() => setHideSelectionActionBar(false)}
          >
            {isLoading && loadingType === 'skeleton' ? (
              Array.from({ length: loadingRowCount }).map((_, loadingIndex) => (
                <TableRow key={`loading-row-${loadingIndex}`}>
                  {rowNumbersEnabled ? (
                    <TableCell width="52px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {rowPinningEnabled ? (
                    <TableCell width="56px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {rowDraggingEnabled ? (
                    <TableCell width="44px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {rowOrderingEnabled ? (
                    <TableCell width="56px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {rowExpandingEnabled ? (
                    <TableCell width="40px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {rowSelectionEnabled ? (
                    <TableCell width="40px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                  {visibleLeafColumns.map((column) => (
                    <TableCell key={`${column.id}-loading-${loadingIndex}`}>
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ))}
                  {hasRowActions ? (
                    <TableCell width="80px">
                      <Skeleton h="3" rounded="sm" />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : bodyRows.length ? (
              <>
                {virtualizationEnabled && virtualTopPadding > 0 ? (
                  <TableRow key="virtual-top-padding">
                    <TableCell border="none" colSpan={totalVisibleColumnCount} p="0">
                      <Box h={`${virtualTopPadding}px`} />
                    </TableCell>
                  </TableRow>
                ) : null}

                {bodyRows.map(
                  (row, visibleIndex, allVisibleRows) => {
                    const absoluteCenterIndex = virtualizationEnabled
                      ? virtualStartIndex + visibleIndex
                      : visibleIndex;

                    return (
                <TableBodyRow
                  enableClickToCopy={enableClickToCopy}
                  enableColumnResizing={enableColumnResizing}
                  rowDraggingEnabled={rowDraggingEnabled}
                  rowOrderingEnabled={rowOrderingEnabled}
                  enableEditing={enableEditing}
                  rowPinningEnabled={rowPinningEnabled}
                  rowExpandingEnabled={rowExpandingEnabled}
                  columnResizeDirection={columnResizeDirection}
                  columnResizeMode={columnResizeMode}
                  editableColumnIds={editableColumnIds}
                  editedCellValues={editedCellValues}
                  editingCellId={editingCellId}
                  editingValue={editingValue}
                  key={row.id}
                  onChangeEditingValue={setEditingValue}
                  onCommitEditing={handleCommitEditing}
                  onMoveRowUp={() => {
                    const previousRow = virtualizationEnabled
                      ? centerRows[absoluteCenterIndex - 1]
                      : allVisibleRows[visibleIndex - 1];
                    if (!previousRow) return;
                    onReorderRows?.(row, previousRow);
                  }}
                  onMoveRowDown={() => {
                    const nextRow = virtualizationEnabled
                      ? centerRows[absoluteCenterIndex + 1]
                      : allVisibleRows[visibleIndex + 1];
                    if (!nextRow) return;
                    onReorderRows?.(row, nextRow);
                  }}
                  onStartEditing={handleStartEditing}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  paginationEnabled={paginationEnabled}
                  renderCellActions={renderCellActions}
                  renderDetailPanel={renderDetailPanel}
                  renderRowActions={renderRowActions}
                  row={row}
                  canMoveRowUp={virtualizationEnabled ? absoluteCenterIndex > 0 : visibleIndex > 0}
                  canMoveRowDown={
                    virtualizationEnabled
                      ? absoluteCenterIndex < centerRows.length - 1
                      : visibleIndex < allVisibleRows.length - 1
                  }
                  detailPanelColSpan={detailPanelColSpan}
                  isDragging={draggingRowId === row.id}
                  resizingColumnId={resizingColumnId}
                  rowNumbersEnabled={rowNumbersEnabled}
                  rowSelectionEnabled={rowSelectionEnabled}
                  highlightOnHover={interactive}
                  visibleIndex={virtualizationEnabled ? absoluteCenterIndex : visibleIndex}
                />
                    );
                  },
                )}

                {virtualizationEnabled && virtualBottomPadding > 0 ? (
                  <TableRow key="virtual-bottom-padding">
                    <TableCell border="none" colSpan={totalVisibleColumnCount} p="0">
                      <Box h={`${virtualBottomPadding}px`} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={totalVisibleColumnCount}>
                  {emptyState ?? (
                    <Text color="fg.muted" fontStyle="italic" py="4" textAlign="center">
                      No records to display
                    </Text>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {caption ? <TableCaption style={{ captionSide: 'bottom' }}>{caption}</TableCaption> : null}
          </TableRoot>

          {paginationEnabled && (
            <Box
              alignItems={{ base: 'flex-start', md: 'center' }}
              borderColor={bordered ? 'border' : 'transparent'}
              borderTopWidth="1px"
              onMouseEnter={() => setHideSelectionActionBar(true)}
              onMouseLeave={() => setHideSelectionActionBar(false)}
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              flexWrap="wrap"
              gap="2"
              justifyContent={{ base: 'flex-start', md: 'space-between' }}
              position="sticky"
              bottom="0"
              bg="bg/92"
              backdropFilter="blur(4px)"
              zIndex={2}
              px="3"
              py="2"
            >
              <Text color="fg.muted" fontSize="sm">
                Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
              </Text>
              <Text color="fg.muted" fontSize="sm">
                Rows {Math.min(pageIndex * pageSize + 1, totalRows)}-
                {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
              </Text>
              <Box ml={{ base: '0', md: 'auto' }}>
                <TablePaginationControls
                  canNextPage={table.getCanNextPage()}
                  canPreviousPage={table.getCanPreviousPage()}
                  count={Math.max(totalRows, 1)}
                  onPageChange={(page) => table.setPageIndex(page - 1)}
                  page={Math.min(pageIndex + 1, Math.max(pageCount, 1))}
                  pageSize={pageSize}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      </DndContext>
    </Box>
  );
};
