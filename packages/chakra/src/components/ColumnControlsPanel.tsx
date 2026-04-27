import { Box, Collapsible, IconButton, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { SelectionCheckbox } from './SelectionCheckbox';

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
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <IconButton aria-label="Toggle column controls" mb="3" size="sm" variant="outline">
          <ChevronDown size={16} />
        </IconButton>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box border="1px solid" borderColor="border.muted" borderRadius="md" mb="3" p="3">
          {orderedColumns.map((column, index) => (
            <Box
              alignItems="center"
              display="flex"
              gap="2"
              justifyContent="space-between"
              key={column.id}
              py="1"
            >
              <Box alignItems="center" display="flex" gap="2">
                {enableColumnVisibilityToggle && column.getCanHide() && (
                  <SelectionCheckbox
                    ariaLabel={`Toggle visibility for ${column.id}`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) => column.toggleVisibility(checked)}
                  />
                )}
                <Text fontSize="sm">{String(column.columnDef.header ?? column.id)}</Text>
              </Box>

              {enableColumnOrderingControls && (
                <Box display="flex" gap="1">
                  <IconButton
                    aria-label={`Move ${column.id} up`}
                    disabled={index === 0}
                    onClick={() => onMoveColumn(column.id, -1)}
                    size="xs"
                    variant="ghost"
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    aria-label={`Move ${column.id} down`}
                    disabled={index === orderedColumns.length - 1}
                    onClick={() => onMoveColumn(column.id, 1)}
                    size="xs"
                    variant="ghost"
                  >
                    ↓
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
