import { faker } from '@faker-js/faker';
import { Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChakraReactTable,
  useChakraReactTable,
  type CRT_ColumnDef,
} from 'chakra-react-table';

type Person = { firstName: string; lastName: string; age: number };

faker.seed(7);

const data: Person[] = Array.from({ length: 30 }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 90 }),
}));

const Example = () => {
  const columns = useMemo<CRT_ColumnDef<Person>[]>(
    () => [
      {
        header: 'Name',
        columns: [
          { accessorKey: 'firstName', header: 'First name' },
          { accessorKey: 'lastName', header: 'Last name' },
        ],
      },
      { accessorKey: 'age', header: 'Age' },
    ],
    [],
  );

  const table = useChakraReactTable({
    columns,
    data,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableRowSelection: true,
    initialState: {
      columnPinning: { left: ['firstName'], right: ['age'] },
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  });

  return (
    <ChakraReactTable
      caption="Chakra React Table - grouped headers, sticky header, sticky columns, selection action bar"
      enableColumnOrderingControls
      enableColumnVisibilityToggle
      enableRowSelection
      renderActionBar={({ selectedRows }) => (
        <Button size="xs" variant="solid">
          Export {selectedRows.length}
        </Button>
      )}
      table={table}
    />
  );
};

const meta = {
  title: 'Table/Basic',
  component: Example,
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
