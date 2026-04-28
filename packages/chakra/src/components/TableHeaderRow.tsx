import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Box, Button, IconButton, TableColumnHeader, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { Header, HeaderGroup } from '@tanstack/react-table';
import type { CRT_RowData } from '../coreApi';
import { ChevronsDown, ChevronsRight, GripVertical, Pin, PinOff } from 'lucide-react';
import { ColumnActionMenu } from './ColumnActionMenu';
import { ColumnResizeHandle } from './ColumnResizeHandle';
import { columnDragId, columnDropId } from './dndUtils';
import { getPinnedColumnStyles } from './pinningStyles';
import { SelectionCheckbox } from './SelectionCheckbox';
import { SortIndicator } from './SortIndicator';

type TableHeaderRowProps<TData extends CRT_RowData> = {
  allRowsSelected: boolean;
  allRowsPinned: boolean;
  enableColumnActions: boolean;
  enableColumnDragging: boolean;
  enableColumnResizing: boolean;
  draggingColumnId: string | null;
  rowDraggingEnabled: boolean;
  rowPinningEnabled: boolean;
  rowOrderingEnabled: boolean;
  rowExpandingEnabled: boolean;
  hasRowActions: boolean;
  headerGroup: HeaderGroup<TData>;
  resizingColumnId: false | string;
  resizeDeltaOffset: number;
  columnResizeDirection: 'ltr' | 'rtl';
  columnResizeMode: 'onChange' | 'onEnd';
  onToggleAllRows: (checked: boolean) => void;
  onToggleAllRowsPinned: () => void;
  onToggleAllExpandedRows: () => void;
  allRowsExpanded: boolean;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  someRowsSelected: boolean;
};

type HeaderCellProps<TData extends CRT_RowData> = {
  columnResizeDirection: 'ltr' | 'rtl';
  columnResizeMode: 'onChange' | 'onEnd';
  draggingColumnId: string | null;
  enableColumnActions: boolean;
  enableColumnDragging: boolean;
  enableColumnResizing: boolean;
  header: Header<TData, unknown>;
  resizeDeltaOffset: number;
  resizingColumnId: false | string;
};

const DraggableHeaderCell = <TData extends CRT_RowData>({
  columnResizeDirection,
  columnResizeMode,
  draggingColumnId,
  enableColumnActions,
  enableColumnDragging,
  enableColumnResizing,
  header,
  resizeDeltaOffset,
  resizingColumnId,
}: HeaderCellProps<TData>) => {
  const isGroupHeader = header.subHeaders.length > 0;
  const canDrag = !isGroupHeader && enableColumnDragging && !header.isPlaceholder;

  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: columnDropId(header.column.id),
    data: { columnId: header.column.id, type: 'column' as const },
    disabled: !canDrag,
  });

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setDragRef,
  } = useDraggable({
    id: columnDragId(header.column.id),
    data: { columnId: header.column.id, type: 'column' as const },
    disabled: !canDrag,
  });

  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();
  const resizeEnabled = enableColumnResizing && header.column.getCanResize();
  const showResizeBorder = enableColumnResizing && resizingColumnId === header.column.id;
  const resizeBorderStyles =
    showResizeBorder && columnResizeDirection === 'ltr'
      ? { borderRightColor: 'blue.500', borderRightWidth: '2px' }
      : showResizeBorder && columnResizeDirection === 'rtl'
        ? { borderLeftColor: 'blue.500', borderLeftWidth: '2px' }
        : {};

  return (
    <TableColumnHeader
      colSpan={header.colSpan}
      key={header.id}
      minWidth={enableColumnResizing ? `${header.getSize()}px` : undefined}
      position={resizeEnabled ? 'relative' : undefined}
      ref={setDropRef}
      width={enableColumnResizing ? `${header.getSize()}px` : undefined}
      opacity={isDragging || draggingColumnId === header.column.id ? 0.55 : 1}
      outline={isOver ? '2px solid' : undefined}
      outlineColor={isOver ? 'blue.500' : undefined}
      outlineOffset={isOver ? '-2px' : undefined}
      {...resizeBorderStyles}
      {...getPinnedColumnStyles(header.column, true)}
    >
      {header.isPlaceholder ? null : (
        <Box alignItems="center" display="flex" justifyContent={isGroupHeader ? 'center' : 'space-between'}>
          <Box>
            {canSort ? (
              <Button onClick={header.column.getToggleSortingHandler()} size="xs" variant="ghost">
                {flexRender(header.column.columnDef.header, header.getContext())}
                <SortIndicator direction={sorted} />
              </Button>
            ) : (
              flexRender(header.column.columnDef.header, header.getContext())
            )}
          </Box>
          <Box alignItems="center" display="flex" gap="1">
            {canDrag ? (
              <IconButton
                aria-label={`Drag column ${header.column.id}`}
                cursor="grab"
                ref={setDragRef}
                size="2xs"
                variant="ghost"
                {...attributes}
                {...listeners}
              >
                <GripVertical size={12} />
              </IconButton>
            ) : null}
            {!isGroupHeader && enableColumnActions ? <ColumnActionMenu column={header.column} /> : null}
          </Box>
        </Box>
      )}
      <ColumnResizeHandle
        canResize={resizeEnabled}
        columnResizeDirection={columnResizeDirection}
        columnResizeMode={columnResizeMode}
        deltaOffset={resizeDeltaOffset}
        isResizing={header.column.getIsResizing()}
        onResetSize={() => header.column.resetSize()}
        onResizeStart={header.getResizeHandler()}
      />
    </TableColumnHeader>
  );
};

export const TableHeaderRow = <TData extends CRT_RowData>({
  allRowsSelected,
  allRowsPinned,
  enableColumnActions,
  enableColumnDragging,
  enableColumnResizing,
  draggingColumnId,
  rowDraggingEnabled,
  rowPinningEnabled,
  rowOrderingEnabled,
  rowExpandingEnabled,
  hasRowActions,
  headerGroup,
  resizingColumnId,
  resizeDeltaOffset,
  columnResizeDirection,
  columnResizeMode,
  onToggleAllRows,
  onToggleAllRowsPinned,
  onToggleAllExpandedRows,
  allRowsExpanded,
  rowNumbersEnabled,
  rowSelectionEnabled,
  someRowsSelected,
}: TableHeaderRowProps<TData>) => (
  <TableRow key={headerGroup.id}>
    {rowNumbersEnabled && <TableColumnHeader width="52px">#</TableColumnHeader>}

    {rowPinningEnabled && (
      <TableColumnHeader width="56px">
        <IconButton
          aria-label={allRowsPinned ? 'Unpin all rows' : 'Pin all rows to top'}
          onClick={onToggleAllRowsPinned}
          size="2xs"
          variant="ghost"
        >
          {allRowsPinned ? <PinOff size={14} /> : <Pin size={14} />}
        </IconButton>
      </TableColumnHeader>
    )}

    {rowDraggingEnabled && (
      <TableColumnHeader width="44px">
        <GripVertical size={14} />
      </TableColumnHeader>
    )}

    {rowOrderingEnabled && <TableColumnHeader width="56px">Move</TableColumnHeader>}

    {rowExpandingEnabled && (
      <TableColumnHeader width="40px">
        <IconButton
          aria-label={allRowsExpanded ? 'Collapse all rows' : 'Expand all rows'}
          onClick={onToggleAllExpandedRows}
          size="2xs"
          variant="ghost"
        >
          {allRowsExpanded ? <ChevronsDown size={14} /> : <ChevronsRight size={14} />}
        </IconButton>
      </TableColumnHeader>
    )}

    {rowSelectionEnabled && (
      <TableColumnHeader width="40px">
        <SelectionCheckbox
          ariaLabel="Select all rows"
          checked={allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false}
          onCheckedChange={onToggleAllRows}
        />
      </TableColumnHeader>
    )}

    {headerGroup.headers.map((header) => (
      <DraggableHeaderCell
        key={header.id}
        columnResizeDirection={columnResizeDirection}
        columnResizeMode={columnResizeMode}
        draggingColumnId={draggingColumnId}
        enableColumnActions={enableColumnActions}
        enableColumnDragging={enableColumnDragging}
        enableColumnResizing={enableColumnResizing}
        header={header}
        resizeDeltaOffset={resizeDeltaOffset}
        resizingColumnId={resizingColumnId}
      />
    ))}

    {hasRowActions && <TableColumnHeader minWidth="80px" width="fit-content" />}
  </TableRow>
);
