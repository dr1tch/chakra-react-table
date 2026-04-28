import {
  Box,
  Button,
  IconButton,
  Input,
  TableCell,
  TableRow,
  Text,
} from '@chakra-ui/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { flexRender } from '@tanstack/react-table';
import type { Cell, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type { CRT_RowData } from '../coreApi';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical, Pin, PinOff } from 'lucide-react';
import { CopyCellAction } from './CopyCellAction';
import { getCellKey, isCellPrimitiveEditable, toCopyText } from './cellValue';
import { getPinnedColumnStyles } from './pinningStyles';
import { rowDragId, rowDropId } from './dndUtils';
import { SelectionCheckbox } from './SelectionCheckbox';

type TableBodyRowProps<TData extends CRT_RowData> = {
  enableClickToCopy: boolean;
  enableColumnResizing: boolean;
  enableEditing: boolean;
  rowDraggingEnabled: boolean;
  rowPinningEnabled: boolean;
  rowOrderingEnabled: boolean;
  rowExpandingEnabled: boolean;
  columnResizeDirection: 'ltr' | 'rtl';
  columnResizeMode: 'onChange' | 'onEnd';
  editableColumnIds?: string[] | undefined;
  editedCellValues: Record<string, string>;
  editingCellId: string | null;
  editingValue: string;
  onChangeEditingValue: (value: string) => void;
  onCommitEditing: (cell: Cell<TData, unknown>) => void;
  onStartEditing: (cell: Cell<TData, unknown>) => void;
  pageIndex: number;
  pageSize: number;
  paginationEnabled: boolean;
  canMoveRowDown: boolean;
  canMoveRowUp: boolean;
  onMoveRowDown?: (() => void) | undefined;
  onMoveRowUp?: (() => void) | undefined;
  renderCellActions?: ((cell: Cell<TData, unknown>) => ReactNode) | undefined;
  renderDetailPanel?: ((row: Row<TData>) => ReactNode) | undefined;
  renderRowActions?: ((row: Row<TData>) => ReactNode) | undefined;
  row: Row<TData>;
  detailPanelColSpan: number;
  resizingColumnId: false | string;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  highlightOnHover: boolean;
  isDragging: boolean;
  visibleIndex: number;
};

export const TableBodyRow = <TData extends CRT_RowData>({
  enableClickToCopy,
  enableColumnResizing,
  enableEditing,
  rowDraggingEnabled,
  rowPinningEnabled,
  rowOrderingEnabled,
  rowExpandingEnabled,
  columnResizeDirection,
  columnResizeMode,
  editableColumnIds,
  editedCellValues,
  editingCellId,
  editingValue,
  onChangeEditingValue,
  onCommitEditing,
  onStartEditing,
  pageIndex,
  pageSize,
  paginationEnabled,
  canMoveRowDown,
  canMoveRowUp,
  onMoveRowDown,
  onMoveRowUp,
  renderCellActions,
  renderDetailPanel,
  renderRowActions,
  row,
  detailPanelColSpan,
  resizingColumnId,
  rowNumbersEnabled,
  rowSelectionEnabled,
  highlightOnHover,
  isDragging,
  visibleIndex,
}: TableBodyRowProps<TData>) => {
  const isSelected = row.getIsSelected();
  const isExpanded = row.getIsExpanded();
  const pinState = row.getIsPinned();
  const isPinned = pinState === 'top' || pinState === 'bottom';
  const detailPanel = renderDetailPanel?.(row);
  const hasDetailPanel = Boolean(detailPanel);
  const canExpand = rowExpandingEnabled && (row.getCanExpand() || hasDetailPanel);

  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: rowDropId(row.id),
    data: { rowId: row.id, type: 'row' as const },
    disabled: !rowDraggingEnabled,
  });

  const {
    attributes: rowDragAttributes,
    listeners: rowDragListeners,
    setNodeRef: setDragRef,
  } = useDraggable({
    id: rowDragId(row.id),
    data: { rowId: row.id, type: 'row' as const },
    disabled: !rowDraggingEnabled,
  });

  const hoverProps = highlightOnHover
    ? {
        _hover: {
          '& > td': {
            background: 'bg.subtle',
          },
        },
      }
    : {};

  return (
    <>
      <TableRow
        data-selected={isSelected ? '' : undefined}
        data-pinned={isPinned ? '' : undefined}
        key={row.id}
        ref={setDropRef}
        position={isPinned ? 'sticky' : undefined}
        top={pinState === 'top' ? '0' : undefined}
        bottom={pinState === 'bottom' ? '0' : undefined}
        opacity={isDragging ? 0.55 : 1}
        outline={rowDraggingEnabled && isOver ? '2px solid' : undefined}
        outlineColor={rowDraggingEnabled && isOver ? 'blue.500' : undefined}
        outlineOffset={rowDraggingEnabled && isOver ? '-2px' : undefined}
        zIndex={isPinned ? 3 : undefined}
        {...hoverProps}
      >
        {rowNumbersEnabled && (
          <TableCell color="fg.muted" width="52px">
            {(paginationEnabled ? pageIndex * pageSize : 0) + visibleIndex + 1}
          </TableCell>
        )}

        {rowPinningEnabled && (
          <TableCell width="56px">
            <Box display="flex" justifyContent="center">
              <IconButton
                aria-label={isPinned ? `Unpin row ${row.id}` : `Pin row ${row.id}`}
                onClick={() => row.pin(isPinned ? false : 'top')}
                size="2xs"
                variant="ghost"
              >
                {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
              </IconButton>
            </Box>
          </TableCell>
        )}

        {rowDraggingEnabled && (
          <TableCell width="44px">
            <Box display="flex" justifyContent="center">
              <IconButton
                aria-label={`Drag row ${row.id}`}
                cursor="grab"
                ref={setDragRef}
                size="2xs"
                variant="ghost"
                {...rowDragAttributes}
                {...rowDragListeners}
              >
                <GripVertical size={14} />
              </IconButton>
            </Box>
          </TableCell>
        )}

        {rowOrderingEnabled && (
          <TableCell width="56px">
            <Box alignItems="center" display="flex" gap="1" justifyContent="center">
              <IconButton
                aria-label={`Move row ${row.id} up`}
                disabled={!canMoveRowUp}
                onClick={onMoveRowUp}
                size="2xs"
                variant="ghost"
              >
                <ArrowUp size={14} />
              </IconButton>
              <IconButton
                aria-label={`Move row ${row.id} down`}
                disabled={!canMoveRowDown}
                onClick={onMoveRowDown}
                size="2xs"
                variant="ghost"
              >
                <ArrowDown size={14} />
              </IconButton>
            </Box>
          </TableCell>
        )}

        {rowExpandingEnabled && (
          <TableCell width="40px">
            {canExpand ? (
              <IconButton
                aria-label={isExpanded ? `Collapse row ${row.id}` : `Expand row ${row.id}`}
                onClick={row.getToggleExpandedHandler()}
                size="2xs"
                variant="ghost"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </IconButton>
            ) : null}
          </TableCell>
        )}

        {rowSelectionEnabled && (
          <TableCell width="40px">
            <SelectionCheckbox
              ariaLabel={`Select row ${row.id}`}
              checked={isSelected}
              disabled={!row.getCanSelect()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
            />
          </TableCell>
        )}

        {row.getVisibleCells().map((cell) => {
          const cellKey = getCellKey(cell);
          const isEditing = editingCellId === cellKey;
          const baseText = toCopyText(cell.getValue());
          const editedText = editedCellValues[cellKey];
          const displayText = editedText ?? baseText;
          const copyText = displayText ?? baseText;
          const isEditable =
            enableEditing &&
            isCellPrimitiveEditable(cell) &&
            (editableColumnIds ? editableColumnIds.includes(cell.column.id) : true);
          const cellActions = renderCellActions?.(cell);
          const showResizeBorder =
            enableColumnResizing &&
            resizingColumnId === cell.column.id;
          const resizeBorderStyles =
            showResizeBorder && columnResizeDirection === 'ltr'
              ? { borderRightColor: 'blue.500', borderRightWidth: '2px' }
              : showResizeBorder && columnResizeDirection === 'rtl'
                ? { borderLeftColor: 'blue.500', borderLeftWidth: '2px' }
                : {};
          return (
            <TableCell
              key={cell.id}
              minWidth={enableColumnResizing ? `${cell.column.getSize()}px` : undefined}
              width={enableColumnResizing ? `${cell.column.getSize()}px` : undefined}
              {...resizeBorderStyles}
              {...getPinnedColumnStyles(cell.column)}
            >
              <Box alignItems="center" display="flex" gap="2">
                <Box flex="1" minW="0">
                  {isEditable ? (
                    isEditing ? (
                      <Input
                        autoFocus
                        onBlur={() => onCommitEditing(cell)}
                        onChange={(event) => onChangeEditingValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            onCommitEditing(cell);
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            onChangeEditingValue(displayText ?? '');
                            onCommitEditing(cell);
                          }
                        }}
                        size="xs"
                        value={editingValue}
                      />
                    ) : (
                      <Button
                        justifyContent="flex-start"
                        onClick={() => onStartEditing(cell)}
                        px="0"
                        size="xs"
                        variant="ghost"
                        width="full"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Button>
                    )
                  ) : (
                    <Text truncate>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Text>
                  )}
                </Box>

                {enableClickToCopy && copyText ? <CopyCellAction value={copyText} /> : null}

                {cellActions}
              </Box>
            </TableCell>
          );
        })}

        {renderRowActions ? (
          <TableCell width="80px">
            <Box display="flex" justifyContent="flex-end">
              {renderRowActions(row)}
            </Box>
          </TableCell>
        ) : null}
      </TableRow>

      {hasDetailPanel && isExpanded ? (
        <TableRow key={`${row.id}-detail`}>
          <TableCell colSpan={detailPanelColSpan}>{detailPanel}</TableCell>
        </TableRow>
      ) : null}
    </>
  );
};
