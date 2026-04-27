import { Box, Input, TableCell, TableRow, Text } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { Cell, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type { CRT_RowData } from '@chakra-react-table/core';
import { getPinnedColumnStyles } from './pinningStyles';
import { getCellKey, isCellPrimitiveEditable, toCopyText } from './cellValue';
import { CopyCellAction } from './CopyCellAction';
import { SelectionCheckbox } from './SelectionCheckbox';

type TableBodyRowProps<TData extends CRT_RowData> = {
  enableClickToCopy: boolean;
  enableColumnResizing: boolean;
  enableEditing: boolean;
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
  renderCellActions?: ((cell: Cell<TData, unknown>) => ReactNode) | undefined;
  renderRowActions?: ((row: Row<TData>) => ReactNode) | undefined;
  row: Row<TData>;
  resizingColumnId: false | string;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  highlightOnHover: boolean;
  visibleIndex: number;
};

export const TableBodyRow = <TData extends CRT_RowData>({
  enableClickToCopy,
  enableColumnResizing,
  enableEditing,
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
  renderCellActions,
  renderRowActions,
  row,
  resizingColumnId,
  rowNumbersEnabled,
  rowSelectionEnabled,
  highlightOnHover,
  visibleIndex,
}: TableBodyRowProps<TData>) => {
  const isSelected = row.getIsSelected();
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
    <TableRow
      data-selected={isSelected ? '' : undefined}
      key={row.id}
      {...hoverProps}
    >
      {rowNumbersEnabled && (
        <TableCell color="fg.muted" width="52px">
          {(paginationEnabled ? pageIndex * pageSize : 0) + visibleIndex + 1}
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
                          onCommitEditing(cell);
                        }
                      }}
                      size="xs"
                      value={editingValue}
                    />
                  ) : (
                    <Text
                      cursor="text"
                      onDoubleClick={() => onStartEditing(cell)}
                      userSelect="none"
                    >
                      {displayText ?? ''}
                    </Text>
                  )
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </Box>
              {enableClickToCopy && copyText ? <CopyCellAction value={copyText} /> : null}
              {cellActions ? <Box display="flex" gap="1">{cellActions}</Box> : null}
            </Box>
          </TableCell>
        );
      })}

      {renderRowActions && (
        <TableCell minWidth="80px" width="fit-content">
          <Box display="flex" justifyContent="flex-end">
            {renderRowActions(row)}
          </Box>
        </TableCell>
      )}
    </TableRow>
  );
};
