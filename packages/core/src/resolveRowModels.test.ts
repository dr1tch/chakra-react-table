import { describe, expect, it } from 'vitest';
import { resolveRowModels } from './resolveRowModels';

describe('resolveRowModels', () => {
  it('enables all row models by default', () => {
    const resolved = resolveRowModels({});

    expect(resolved.getFilteredRowModel).toBeTypeOf('function');
    expect(resolved.getGroupedRowModel).toBeTypeOf('function');
    expect(resolved.getPaginationRowModel).toBeTypeOf('function');
    expect(resolved.getSortedRowModel).toBeTypeOf('function');
  });

  it('disables row models when toggles are false', () => {
    const resolved = resolveRowModels({
      enableColumnFilters: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enablePagination: false,
      enableSorting: false,
    });

    expect(resolved.getFilteredRowModel).toBeUndefined();
    expect(resolved.getGroupedRowModel).toBeUndefined();
    expect(resolved.getPaginationRowModel).toBeUndefined();
    expect(resolved.getSortedRowModel).toBeUndefined();
  });

  it('keeps filtered row model when either global or column filtering is enabled', () => {
    const onlyGlobal = resolveRowModels({
      enableColumnFilters: false,
      enableGlobalFilter: true,
    });

    const onlyColumn = resolveRowModels({
      enableColumnFilters: true,
      enableGlobalFilter: false,
    });

    expect(onlyGlobal.getFilteredRowModel).toBeTypeOf('function');
    expect(onlyColumn.getFilteredRowModel).toBeTypeOf('function');
  });
});
