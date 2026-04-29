# chakra-react-table

Chakra-native data table built on top of TanStack Table v8.

## Install

```bash
pnpm add chakra-react-table @tanstack/react-table @chakra-ui/react
```

Peer deps:
- `react >= 18`
- `react-dom >= 18`

## Quick Start

```tsx
import { ChakraReactTable, useChakraReactTable, type CRT_ColumnDef } from 'chakra-react-table';

type Person = { firstName: string; lastName: string; age: number };

const columns: CRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First name' },
  { accessorKey: 'lastName', header: 'Last name' },
  { accessorKey: 'age', header: 'Age' },
];

const table = useChakraReactTable({
  columns,
  data,
  enableSorting: true,
  enablePagination: true,
});

<ChakraReactTable table={table} />;
```

## Core API

### `useChakraReactTable(options)`
Typed wrapper around `useReactTable` with feature row-model resolution.

### `ChakraReactTable` props

Required:
- `table: CRT_TableInstance<TData>`

Layout and visual:
- `bordered?: boolean` default `true`
- `tableVariant?: 'outline' | 'line'` default `'outline'`
- `density?: 'compact' | 'comfortable' | 'spacious'` default `'compact'`
- `striped?: boolean` default `false`
- `interactive?: boolean` default `true`
- `showColumnBorder?: boolean` default `true`
- `showColumnGroup?: boolean` default `true`
- `stickyHeader?: boolean` default `true`
- `layoutMode?: 'auto' | 'fixed'` default `'auto'`
- `caption?: ReactNode` (rendered at table bottom)
- `emptyState?: ReactNode`
- `tableProps?: TableRootProps`

Loading:
- `isLoading?: boolean` default `false`
- `loadingType?: 'skeleton' | 'overlay'` default `'skeleton'`
- `loadingRowCount?: number` default `8`

Toolbar and UX:
- `enableGlobalFilter?: boolean` default `true`
- `enablePagination?: boolean` default `true`
- `enableFullScreen?: boolean` default `false`
- `enableActionBar?: boolean` default `true`

Column features:
- `enableColumnVisibilityToggle?: boolean` default `false`
- `enableColumnOrderingControls?: boolean` default `false`
- `enableColumnDragging?: boolean` default `false`
- `enableColumnActions?: boolean` default `false`
- `enableColumnResizing?: boolean` default `false`

Row features:
- `enableRowSelection?: boolean` default `false`
- `enableRowNumbers?: boolean` default `false`
- `enableRowPinning?: boolean` default `false`
- `enableRowOrderingControls?: boolean` default `false`
- `enableRowDragging?: boolean` default `false`
- `enableExpanding?: boolean` default `false`

Editing/creating:
- `enableEditing?: boolean` default `false`
- `editableColumnIds?: string[]`
- `onUpdateCell?: (payload) => void`
- `enableCreating?: boolean` default `false`
- `onCreateRow?: (values) => void`

Custom renderers:
- `renderCellActions?: (cell) => ReactNode`
- `renderRowActions?: (row) => ReactNode`
- `renderDetailPanel?: (row) => ReactNode`
- `renderActionBar?: ({ selectedRows, table }) => ReactNode`

Reordering:
- `onReorderRows?: (sourceRow, targetRow) => void`

Performance:
- `enableMemoizedRows?: boolean` default `false`
- `enableVirtualization?: boolean` default `false`
- `virtualizationHeight?: number` default `520`
- `virtualizationRowHeight?: number` default `44`
- `virtualizationOverscan?: number` default `6`

## Compatibility Notes

- `stickyHeader` is auto-disabled when grouped headers have multiple header rows.
- `enableVirtualization` is auto-disabled when any of these are active:
  - `enableRowPinning`
  - row expanding (`enableExpanding` / detail panel)
  - `enableRowDragging`
- Row reordering callbacks:
  - `enableRowOrderingControls` and `enableRowDragging` both require `onReorderRows`.

## Recommended Presets

### 1) Standard bordered table

```tsx
<ChakraReactTable
  table={table}
  bordered
  tableVariant="outline"
  showColumnBorder
  stickyHeader
/>
```

### 2) Grouped headers

```tsx
const columns = [
  {
    id: 'identity',
    header: 'Identity',
    columns: [
      { accessorKey: 'firstName', header: 'First name' },
      { accessorKey: 'lastName', header: 'Last name' },
    ],
  },
  {
    id: 'meta',
    header: 'Meta',
    columns: [
      { accessorKey: 'age', header: 'Age' },
      { accessorKey: 'city', header: 'City' },
    ],
  },
];
```

### 3) Large dataset (virtualized)

```tsx
<ChakraReactTable
  table={table}
  enablePagination={false}
  enableVirtualization
  virtualizationHeight={520}
  virtualizationRowHeight={44}
  virtualizationOverscan={8}
/>
```

### 4) Selection + action bar

```tsx
<ChakraReactTable
  table={table}
  enableRowSelection
  renderActionBar={({ selectedRows }) => <div>{selectedRows.length} selected</div>}
/>
```

## Monorepo Workspace

- `packages/core` - headless contracts and table-hook wrappers
- `packages/chakra` - Chakra renderer package
- `packages/utils` - shared utilities
- `packages/icons` - icon contracts/defaults
- `apps/docs` - Vite docs playground
- `apps/storybook` - Storybook (Vite)

## Build & Test

- Monorepo: `pnpm` + `turborepo`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Storybook dev: `pnpm dev:storybook`
- Storybook build: `pnpm build:storybook`
- Releases: `changesets`


