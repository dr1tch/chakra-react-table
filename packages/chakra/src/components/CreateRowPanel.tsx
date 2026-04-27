import { Box, Button, Input, Text } from '@chakra-ui/react';

type CreateColumnField = {
  id: string;
  label: string;
};

type CreateRowPanelProps = {
  columns: CreateColumnField[];
  isOpen: boolean;
  onCancel: () => void;
  onOpen: () => void;
  onSave: () => void;
  onValueChange: (columnId: string, value: string) => void;
  saveDisabled?: boolean;
  values: Record<string, string>;
};

export const CreateRowPanel = ({
  columns,
  isOpen,
  onCancel,
  onOpen,
  onSave,
  onValueChange,
  saveDisabled,
  values,
}: CreateRowPanelProps) => (
  <Box mb="3">
    {!isOpen ? (
      <Button onClick={onOpen} size="sm" variant="solid">
        Add row
      </Button>
    ) : (
      <Box border="1px solid" borderColor="border.muted" borderRadius="md" p="3">
        <Text fontSize="sm" fontWeight="semibold" mb="2">
          Create row
        </Text>
        <Box display="grid" gap="2" gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))" mb="3">
          {columns.map((column) => (
            <Input
              key={column.id}
              onChange={(event) => onValueChange(column.id, event.target.value)}
              placeholder={column.label}
              size="sm"
              value={values[column.id] ?? ''}
            />
          ))}
        </Box>
        <Box display="flex" gap="2" justifyContent="flex-end">
          <Button onClick={onCancel} size="sm" variant="ghost">
            Cancel
          </Button>
          <Button disabled={saveDisabled} onClick={onSave} size="sm" variant="solid">
            Save row
          </Button>
        </Box>
      </Box>
    )}
  </Box>
);
