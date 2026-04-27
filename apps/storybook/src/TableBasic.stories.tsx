import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChakraReactTable, useChakraReactTable, type CRT_ColumnDef } from 'chakra-react-table';

type Person = { firstName: string; lastName: string; age: number };

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
  { firstName: 'Grace', lastName: 'Hopper', age: 85 },
  { firstName: 'Edsger', lastName: 'Dijkstra', age: 72 },
];

const Example = () => {
  const columns = useMemo<CRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'firstName', header: 'First name' },
      { accessorKey: 'lastName', header: 'Last name' },
      { accessorKey: 'age', header: 'Age' },
    ],
    [],
  );

  const table = useChakraReactTable({ columns, data });
  return <ChakraReactTable table={table} />;
};

const meta = {
  title: 'Table/Basic',
  component: Example,
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
