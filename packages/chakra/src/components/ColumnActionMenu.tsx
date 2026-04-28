import { IconButton, Menu } from '@chakra-ui/react';
import type { Column } from '@tanstack/react-table';
import type { CRT_RowData } from '../coreApi';
import { EllipsisVertical } from 'lucide-react';

type ColumnActionMenuProps<TData extends CRT_RowData> = {
  column: Column<TData, unknown>;
};

export const ColumnActionMenu = <TData extends CRT_RowData>({
  column,
}: ColumnActionMenuProps<TData>) => {
  const canSort = column.getCanSort();
  const canHide = column.getCanHide();
  const canPin = column.getCanPin?.() ?? false;
  const isPinned = column.getIsPinned?.() ?? false;

  const hasActions = canSort || canHide || canPin;
  if (!hasActions) return null;

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <IconButton aria-label={`Column actions for ${column.id}`} size="2xs" variant="ghost">
          <EllipsisVertical size={14} />
        </IconButton>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content minW="180px">
          {canSort && (
            <>
              <Menu.Item onClick={() => column.toggleSorting(false)} value={`${column.id}-sort-asc`}>
                Sort ascending
              </Menu.Item>
              <Menu.Item onClick={() => column.toggleSorting(true)} value={`${column.id}-sort-desc`}>
                Sort descending
              </Menu.Item>
              <Menu.Item onClick={() => column.clearSorting()} value={`${column.id}-sort-clear`}>
                Clear sort
              </Menu.Item>
            </>
          )}

          {canHide && (
            <Menu.Item
              onClick={() => column.toggleVisibility(false)}
              value={`${column.id}-hide`}
            >
              Hide column
            </Menu.Item>
          )}

          {canPin && (
            <>
              <Menu.Item onClick={() => column.pin('left')} value={`${column.id}-pin-left`}>
                Pin left
              </Menu.Item>
              <Menu.Item onClick={() => column.pin('right')} value={`${column.id}-pin-right`}>
                Pin right
              </Menu.Item>
              {isPinned && (
                <Menu.Item onClick={() => column.pin(false)} value={`${column.id}-unpin`}>
                  Unpin
                </Menu.Item>
              )}
            </>
          )}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
