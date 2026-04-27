import { faker } from '@faker-js/faker';
import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import {
  ChakraReactTable,
  useChakraReactTable,
  type CRT_ColumnDef,
  type CRT_TableOptions,
} from 'chakra-react-table';

type Person = {
  age: number;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type FeaturePreset = {
  note?: string;
  rendererProps?: Record<string, unknown>;
  tableOptions?: Partial<CRT_TableOptions<Person>>;
};

export const featureNames = [
  'Aggregation',
  'CellActions',
  'ClickToCopy',
  'ColumnActions',
  'ColumnDragging',
  'ColumnGrouping',
  'ColumnHiding',
  'ColumnOrdering',
  'ColumnPinning',
  'ColumnResizing',
  'Creating',
  'DensePadding',
  'DetailPanel',
  'Editing',
  'Filtering',
  'FullScreen',
  'HeaderGroups',
  'LayoutMode',
  'Loading',
  'Memod',
  'Pagination',
  'RowActions',
  'RowDragging',
  'RowNumbers',
  'RowOrdering',
  'RowPinning',
  'Search',
  'Selection',
  'Sorting',
  'SubRowTree',
  'Toolbar',
  'Virtualization',
] as const;

export type FeatureName = (typeof featureNames)[number];

const makeData = (seed: number, count: number): Person[] => {
  faker.seed(seed);
  return Array.from({ length: count }, () => ({
    age: faker.number.int({ max: 90, min: 18 }),
    city: faker.location.city(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }));
};

const makeColumns = (): CRT_ColumnDef<Person>[] => [
  { accessorKey: 'firstName', header: 'First name' },
  { accessorKey: 'lastName', header: 'Last name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'email', header: 'Email' },
];

export const featurePresets: Record<FeatureName, FeaturePreset> = {
  Aggregation: {
    note: 'Grouped/Aggregation internals come from TanStack; dedicated aggregation UI is planned.',
    tableOptions: { initialState: { grouping: ['city'] } },
  },
  CellActions: { note: 'Custom cell action menus will be added in the next slice.' },
  ClickToCopy: { rendererProps: { enableClickToCopy: true } },
  ColumnActions: { note: 'Column actions menu is planned; sorting and visibility controls are available.' },
  ColumnDragging: { note: 'Drag handles are planned; up/down ordering controls are currently available.' },
  ColumnGrouping: { tableOptions: { initialState: { grouping: ['city'] } } },
  ColumnHiding: { rendererProps: { enableColumnVisibilityToggle: true } },
  ColumnOrdering: {
    rendererProps: { enableColumnOrderingControls: true },
    tableOptions: { enableColumnOrdering: true },
  },
  ColumnPinning: { note: 'Column pinning is planned in a subsequent slice.' },
  ColumnResizing: { note: 'Column resizing support is planned in a subsequent slice.' },
  Creating: { note: 'Row creation workflows are planned in editing slices.' },
  DensePadding: { note: 'Density modes are planned; Chakra size/variant controls are available today.' },
  DetailPanel: { note: 'Detail panels are planned in expansion slice.' },
  Editing: { note: 'Editing modes are planned in the next implementation slice.' },
  Filtering: {
    rendererProps: { enableGlobalFilter: true },
    tableOptions: { enableGlobalFilter: true },
  },
  FullScreen: { note: 'Fullscreen mode is planned in toolbar/UX slice.' },
  HeaderGroups: {
    tableOptions: {
      columns: [
        {
          columns: [
            { accessorKey: 'firstName', header: 'First name' },
            { accessorKey: 'lastName', header: 'Last name' },
          ],
          header: 'Identity',
          id: 'identity',
        },
        {
          columns: [
            { accessorKey: 'age', header: 'Age' },
            { accessorKey: 'city', header: 'City' },
            { accessorKey: 'email', header: 'Email' },
          ],
          header: 'Meta',
          id: 'meta',
        },
      ],
    },
  },
  LayoutMode: { note: 'Alternative layout modes (grid/no-grow) are planned in layout slice.' },
  Loading: { note: 'Loading overlays/skeletons are planned in UX slice.' },
  Memod: { note: 'Memoization strategy options are planned in performance slice.' },
  Pagination: { rendererProps: { enablePagination: true } },
  RowActions: { note: 'Row action menus/buttons are planned in actions slice.' },
  RowDragging: { note: 'Row drag interactions are planned in DnD slice.' },
  RowNumbers: { rendererProps: { enableRowNumbers: true } },
  RowOrdering: { note: 'Row ordering via drag is planned; column ordering controls are currently available.' },
  RowPinning: { note: 'Row pinning is planned in pinning slice.' },
  Search: { rendererProps: { enableGlobalFilter: true } },
  Selection: {
    rendererProps: { enableRowSelection: true },
    tableOptions: { enableRowSelection: true },
  },
  Sorting: { tableOptions: { enableSorting: true } },
  SubRowTree: { note: 'Tree data/sub-rows are planned in expansion slice.' },
  Toolbar: {
    rendererProps: {
      enableColumnOrderingControls: true,
      enableColumnVisibilityToggle: true,
      enableGlobalFilter: true,
    },
    tableOptions: { enableColumnOrdering: true },
  },
  Virtualization: { note: 'Row/column virtualization will be introduced in performance slice.' },
};

export const FeatureStoryTable = ({ featureName }: { featureName: FeatureName }) => {
  const preset = featurePresets[featureName];

  const data = useMemo(() => makeData(featureName.length * 17, 40), [featureName]);
  const fallbackColumns = useMemo(() => makeColumns(), []);

  const table = useChakraReactTable({
    columns: (preset.tableOptions?.columns as CRT_ColumnDef<Person>[]) ?? fallbackColumns,
    data,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowSelection: false,
    ...preset.tableOptions,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
      ...(preset.tableOptions?.initialState as Record<string, unknown> | undefined),
    },
  });

  return (
    <Box>
      {preset.note ? (
        <Text color="fg.muted" fontSize="sm" mb="3">
          {preset.note}
        </Text>
      ) : null}
      <ChakraReactTable
        enableColumnOrderingControls
        enableColumnVisibilityToggle
        enableGlobalFilter
        enablePagination
        table={table}
        {...(preset.rendererProps ?? {})}
      />
    </Box>
  );
};
