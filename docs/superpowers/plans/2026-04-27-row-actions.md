# Row Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `renderRowActions` render prop to `ChakraReactTable` that appends a right-aligned actions column to every row.

**Architecture:** `ChakraReactTable` accepts `renderRowActions?: (row: Row<TData>) => ReactNode`. When provided it passes a boolean flag to `TableHeaderRow` (empty header cell) and the render function itself to `TableBodyRow` (actions cell). The column is never part of TanStack's column model — it is rendered manually like the row-numbers and selection columns.

**Tech Stack:** React 19, TanStack Table v8, Chakra UI v3, TypeScript, Vitest, pnpm, Storybook 10.

---

### Task 1: Update `TableBodyRow` to render an actions cell

**Files:**
- Modify: `packages/chakra/src/components/TableBodyRow.tsx`

- [ ] **Step 1: Add `renderRowActions` to the props type and render the cell**

Full file after the change:

```tsx
import { Box, TableCell, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
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
  renderRowActions?: (row: Row<TData>) => ReactNode;
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
  renderRowActions,
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

    {renderRowActions && (
      <TableCell minWidth="80px" width="fit-content">
        <Box display="flex" justifyContent="flex-end">
          {renderRowActions(row)}
        </Box>
      </TableCell>
    )}
  </TableRow>
);
```

- [ ] **Step 2: Type-check**

```bash
pnpm -C packages/chakra exec tsc --noEmit
```

Expected: no errors.

---

### Task 2: Update `TableHeaderRow` to render an empty actions header cell

**Files:**
- Modify: `packages/chakra/src/components/TableHeaderRow.tsx`

- [ ] **Step 1: Add `hasRowActions` prop and render the header cell**

Full file after the change:

```tsx
import { Button, TableColumnHeader, TableRow } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import type { HeaderGroup } from '@tanstack/react-table';
import type { CRT_RowData } from '@chakra-react-table/core';
import { SelectionCheckbox } from './SelectionCheckbox';
import { SortIndicator } from './SortIndicator';

type TableHeaderRowProps<TData extends CRT_RowData> = {
  allRowsSelected: boolean;
  hasRowActions: boolean;
  headerGroup: HeaderGroup<TData>;
  onToggleAllRows: (checked: boolean) => void;
  rowNumbersEnabled: boolean;
  rowSelectionEnabled: boolean;
  someRowsSelected: boolean;
};

export const TableHeaderRow = <TData extends CRT_RowData>({
  allRowsSelected,
  hasRowActions,
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

    {hasRowActions && <TableColumnHeader minWidth="80px" width="fit-content" />}
  </TableRow>
);
```

- [ ] **Step 2: Type-check**

```bash
pnpm -C packages/chakra exec tsc --noEmit
```

Expected: no errors.

---

### Task 3: Wire `renderRowActions` in `ChakraReactTable`

**Files:**
- Modify: `packages/chakra/src/ChakraReactTable.tsx`

- [ ] **Step 1: Add the prop, import `Row`, pass to children, update colSpan**

Full file after the change:

```tsx
import {
  Box,
  Input,
  TableBody,
  TableCell,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from '@chakra-ui/react';
import type { Row } from '@tanstack/react-table';
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
  renderRowActions?: (row: Row<TData>) => ReactNode;
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
  renderRowActions,
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
              hasRowActions={hasRowActions}
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
                renderRowActions={renderRowActions}
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
```

- [ ] **Step 2: Type-check**

```bash
pnpm -C packages/chakra exec tsc --noEmit
```

Expected: no errors.

---

### Task 4: Update Storybook `RowActions` preset

**Files:**
- Modify: `apps/storybook/src/features/_helpers.tsx`

- [ ] **Step 1: Add imports**

Add alongside the existing imports at the top of `apps/storybook/src/features/_helpers.tsx`:

```tsx
import { IconButton } from '@chakra-ui/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { ChakraReactTableProps } from 'chakra-react-table';
```

- [ ] **Step 2: Update `FeaturePreset` type**

Change:

```ts
export type FeaturePreset = {
  note?: string;
  rendererProps?: Record<string, unknown>;
  tableOptions?: Partial<CRT_TableOptions<Person>>;
};
```

To:

```ts
export type FeaturePreset = {
  note?: string;
  rendererProps?: Partial<Omit<ChakraReactTableProps<Person>, 'table'>>;
  tableOptions?: Partial<CRT_TableOptions<Person>>;
};
```

- [ ] **Step 3: Replace the `RowActions` preset entry**

Change:

```ts
RowActions: { note: 'Row action menus/buttons are planned in actions slice.' },
```

To:

```ts
RowActions: {
  rendererProps: {
    renderRowActions: () => (
      <Box display="flex" gap="1">
        <IconButton aria-label="Edit row" onClick={() => {}} size="xs" variant="ghost">
          <Pencil size={14} />
        </IconButton>
        <IconButton
          aria-label="Delete row"
          colorPalette="red"
          onClick={() => {}}
          size="xs"
          variant="ghost"
        >
          <Trash2 size={14} />
        </IconButton>
      </Box>
    ),
  },
},
```

- [ ] **Step 4: Type-check the storybook package**

```bash
pnpm -C apps/storybook exec tsc --noEmit
```

Expected: no errors.

---

### Task 5: Verify in Storybook

- [ ] **Step 1: Start Storybook**

```bash
pnpm --filter @chakra-react-table/storybook dev
```

- [ ] **Step 2: Open the RowActions story**

Navigate to `Features / Row Actions / Basic`. Verify:
- Each row has an edit (pencil) and delete (trash) icon button in the rightmost column
- The column header cell is empty
- The buttons are right-aligned
- No placeholder note is shown

- [ ] **Step 3: Verify other stories are unaffected**

Open `Features / Sorting / Basic` and `Features / Selection / Basic`. Confirm no actions column appears in either.

- [ ] **Step 4: Stop Storybook** (`Ctrl+C`)
