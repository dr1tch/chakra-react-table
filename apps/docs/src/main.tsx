import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraReactTable, useChakraReactTable, type CRT_ColumnDef } from 'chakra-react-table';

type Person = { firstName: string; lastName: string; age: number };

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
  { firstName: 'Grace', lastName: 'Hopper', age: 85 },
];

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
  });

  return <ChakraReactTable table={table} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);
