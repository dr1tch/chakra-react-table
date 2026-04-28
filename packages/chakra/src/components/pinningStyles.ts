import type { Column } from '@tanstack/react-table';
import type { CRT_RowData } from '../coreApi';

export const getPinnedColumnStyles = <TData extends CRT_RowData>(
  column: Column<TData, unknown>,
  isHeader = false,
) => {
  const pinned = column.getIsPinned?.();
  if (!pinned) return {};

  const offset =
    pinned === 'left' ? column.getStart('left') : column.getAfter('right');

  return {
    background: 'inherit',
    [pinned]: `${offset}px`,
    position: 'sticky' as const,
    zIndex: isHeader ? 4 : 2,
  };
};
