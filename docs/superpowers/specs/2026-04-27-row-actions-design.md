# Row Actions Design

**Date:** 2026-04-27
**Status:** Approved

## Goal

Add per-row action rendering to `ChakraReactTable` via a render prop. The table owns the column slot; the consumer owns the content.

## API

```ts
renderRowActions?: (row: Row<TData>) => ReactNode;
```

Added to `ChakraReactTableProps<TData>`. When omitted, no actions column is rendered.

## Column Behavior

- Column id: `__actions__`
- Added as the rightmost column when `renderRowActions` is provided
- Never sortable, filterable, hideable, or reorderable
- Excluded from `orderedColumns` passed to `ColumnControlsPanel`
- Excluded from global filter
- Width: `fit-content`, minimum `80px`
- Header cell: empty

## Cell Rendering

`TableBodyRow` receives `renderRowActions` and calls it with the current `row`. The return value is wrapped in:

```tsx
<Box display="flex" justifyContent="flex-end">
  {renderRowActions(row)}
</Box>
```

Always visible (no hover-reveal). Accessibility-first: actions are always reachable by keyboard and screen readers. Consumers can add their own hover styling inside the returned JSX.

## Empty State

The empty-state row `colSpan` is incremented by 1 when `renderRowActions` is provided.

## Storybook

`RowActions.stories.tsx` preset updated to pass a `renderRowActions` that renders an edit and delete `IconButton`. The `note` placeholder is removed.

## Out of Scope

- Hover-reveal / opacity transitions (consumer responsibility)
- Built-in action descriptors / menu component (future slice)
- Sticky column positioning (future slice)
