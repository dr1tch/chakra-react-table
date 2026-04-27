import { faker } from '@faker-js/faker';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ChakraReactTable,
  useChakraReactTable,
  type CRT_ColumnDef,
} from 'chakra-react-table';

type Person = { firstName: string; lastName: string; age: number };

faker.seed(42);

const data: Person[] = Array.from({ length: 40 }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 90 }),
}));

function App() {
  const columns = useMemo<CRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'firstName', header: 'First name' },
      { accessorKey: 'lastName', header: 'Last name' },
      { accessorKey: 'age', header: 'Age' },
    ],
    [],
  );

  const table = useChakraReactTable({
    columns,
    data,
    enableColumnOrdering: true,
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  });

  return (
    <ChakraReactTable
      enableColumnOrderingControls
      enableColumnVisibilityToggle
      enableRowSelection
      table={table}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);
