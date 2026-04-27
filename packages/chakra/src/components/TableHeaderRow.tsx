import { Box, Button, TableColumnHeader, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { HeaderGroup } from '@tanstack/react-table';
import type { CRT_RowData } from '@chakra-react-table/core';
import { ColumnActionMenu } from './ColumnActionMenu';
import { ColumnResizeHandle } from './ColumnResizeHandle';
import { getPinnedColumnStyles } from './pinningStyles';
import { SelectionCheckbox } from './SelectionCheckbox';
import { SortIndicator } from './SortIndicator';

type TableHeaderRowProps<TData extends CRT_RowData> = {
  allRowsSelected: boolean;
  enableColumnActions: boolean;
  enableColumnResizing: boolean;
  hasRowActions: boolean;
  headerGroup: HeaderGroup<TData>;
  resizingColumnId: false | string;
  resizeDeltaOffset: number;
  columnResizeDirection: 'ltr' | 'rtl';
  columnResizeMode: 'onChange' | 'onEnd';
  onToggleAllRows: (checked: boolean) => void;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  someRowsSelected: boolean;
};

export const TableHeaderRow = <TData extends CRT_RowData>({
  allRowsSelected,
  enableColumnActions,
  enableColumnResizing,
  hasRowActions,
  headerGroup,
  resizingColumnId,
  resizeDeltaOffset,
  columnResizeDirection,
  columnResizeMode,
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
      const resizeEnabled = enableColumnResizing && header.column.getCanResize();
      const showResizeBorder =
        enableColumnResizing &&
        resizingColumnId === header.column.id;
      const resizeBorderStyles =
        showResizeBorder && columnResizeDirection === 'ltr'
          ? { borderRightColor: 'blue.500', borderRightWidth: '2px' }
          : showResizeBorder && columnResizeDirection === 'rtl'
            ? { borderLeftColor: 'blue.500', borderLeftWidth: '2px' }
            : {};
      return (
        <TableColumnHeader
          key={header.id}
          minWidth={enableColumnResizing ? `${header.getSize()}px` : undefined}
          position={resizeEnabled ? 'relative' : undefined}
          width={enableColumnResizing ? `${header.getSize()}px` : undefined}
          {...resizeBorderStyles}
          {...getPinnedColumnStyles(header.column, true)}
        >
          {header.isPlaceholder ? null : (
            <Box alignItems="center" display="flex" justifyContent="space-between">
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
              {enableColumnActions && <ColumnActionMenu column={header.column} />}
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
    })}

    {hasRowActions && <TableColumnHeader minWidth="80px" width="fit-content" />}
  </TableRow>
);
