import { Box, IconButton, Menu, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Columns3, Eye, EyeOff, Grip } from 'lucide-react';

type ColumnControlItem = {
  columnDef: { header?: unknown };
  getCanHide: () => boolean;
  getIsVisible: () => boolean;
  id: string;
  toggleVisibility: (value?: boolean) => void;
};

type ColumnControlsPanelProps = {
  enableColumnOrderingControls: boolean;
  enableColumnVisibilityToggle: boolean;
  onMoveColumn: (columnId: string, direction: -1 | 1) => void;
  orderedColumns: ColumnControlItem[];
};

export const ColumnControlsPanel = ({
  enableColumnOrderingControls,
  enableColumnVisibilityToggle,
  onMoveColumn,
  orderedColumns,
}: ColumnControlsPanelProps) => {
  if (!enableColumnVisibilityToggle && !enableColumnOrderingControls) {
    return null;
  }

  return (
    <Box alignItems="center" display="flex" gap="2">
      {enableColumnVisibilityToggle && (
        <Menu.Root closeOnSelect={false} positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <IconButton aria-label="Show or hide columns" size="sm" variant="outline">
              <Columns3 size={16} />
            </IconButton>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content minW="240px">
              {orderedColumns.map((column) => {
                if (!column.getCanHide()) return null;
                const isVisible = column.getIsVisible();
                return (
                  <Menu.Item
                    key={column.id}
                    onClick={() => column.toggleVisibility(!isVisible)}
                    value={`toggle-${column.id}`}
                  >
                    <Box alignItems="center" display="flex" gap="2" justifyContent="space-between" w="full">
                      <Text fontSize="sm">{String(column.columnDef.header ?? column.id)}</Text>
                      {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Box>
                  </Menu.Item>
                );
              })}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      )}

      {enableColumnOrderingControls && (
        <Menu.Root closeOnSelect={false} positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <IconButton aria-label="Order columns" size="sm" variant="outline">
              <Grip size={16} />
            </IconButton>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content minW="260px" p="2">
              {orderedColumns.map((column, index) => (
                <Box
                  alignItems="center"
                  display="flex"
                  gap="2"
                  justifyContent="space-between"
                  key={column.id}
                  px="2"
                  py="1"
                >
                  <Text fontSize="sm">{String(column.columnDef.header ?? column.id)}</Text>
                  <Box display="flex" gap="1">
                    <IconButton
                      aria-label={`Move ${column.id} left`}
                      disabled={index === 0}
                      onClick={() => onMoveColumn(column.id, -1)}
                      size="2xs"
                      variant="ghost"
                    >
                      <ArrowUp size={12} />
                    </IconButton>
                    <IconButton
                      aria-label={`Move ${column.id} right`}
                      disabled={index === orderedColumns.length - 1}
                      onClick={() => onMoveColumn(column.id, 1)}
                      size="2xs"
                      variant="ghost"
                    >
                      <ArrowDown size={12} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      )}
    </Box>
  );
};
