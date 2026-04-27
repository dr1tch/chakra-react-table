import { faker } from '@faker-js/faker';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  ChakraReactTable,
  useChakraReactTable,
  type ChakraReactTableProps,
  type CRT_ColumnDef,
  type CRT_TableOptions,
} from 'chakra-react-table';
import { Pencil, Trash2 } from 'lucide-react';

type Person = {
  age: number;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type FeaturePreset = {
  note?: string;
  rendererProps?: Partial<Omit<ChakraReactTableProps<Person>, 'table'>>;
  tableOptions?: Partial<CRT_TableOptions<Person>>;
};

export type FeatureStoryArgs = Partial<Omit<ChakraReactTableProps<Person>, 'table'>> & {
  pageSize: number;
  rowCount: number;
  seedOffset: number;
};

export const defaultFeatureStoryArgs: FeatureStoryArgs = {
  bordered: true,
  captionSide: 'top',
  enableColumnActions: false,
  enableColumnOrderingControls: true,
  enableColumnResizing: false,
  enableColumnVisibilityToggle: true,
  enableCreating: false,
  enableEditing: false,
  enableGlobalFilter: true,
  enablePagination: true,
  enableRowSelection: false,
  interactive: true,
  pageSize: 8,
  rowCount: 40,
  seedOffset: 0,
  showColumnBorder: true,
  showColumnGroup: true,
  stickyHeader: true,
  striped: true,
  tableVariant: 'outline',
};

export const featureStoryArgTypes = {
  bordered: { control: 'boolean' },
  captionSide: { control: 'radio', options: ['top', 'bottom'] },
  enableClickToCopy: { control: 'boolean' },
  enableColumnActions: { control: 'boolean' },
  enableColumnOrderingControls: { control: 'boolean' },
  enableColumnResizing: { control: 'boolean' },
  enableColumnVisibilityToggle: { control: 'boolean' },
  enableCreating: { control: 'boolean' },
  enableEditing: { control: 'boolean' },
  enableGlobalFilter: { control: 'boolean' },
  enablePagination: { control: 'boolean' },
  enableRowNumbers: { control: 'boolean' },
  enableRowSelection: { control: 'boolean' },
  interactive: { control: 'boolean' },
  pageSize: { control: { max: 20, min: 3, step: 1, type: 'number' } },
  rowCount: { control: { max: 200, min: 10, step: 5, type: 'number' } },
  seedOffset: { control: { max: 99, min: 0, step: 1, type: 'number' } },
  showColumnBorder: { control: 'boolean' },
  showColumnGroup: { control: 'boolean' },
  stickyHeader: { control: 'boolean' },
  striped: { control: 'boolean' },
  tableVariant: { control: 'radio', options: ['outline', 'line'] },
} as const;

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
  'Memo',
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
  CellActions: {
    rendererProps: {
      renderCellActions: () => (
        <Box display="flex" gap="1">
          <IconButton aria-label="Edit cell" onClick={() => {}} size="2xs" variant="ghost">
            <Pencil size={12} />
          </IconButton>
          <IconButton aria-label="Delete cell" onClick={() => {}} size="2xs" variant="ghost">
            <Trash2 size={12} />
          </IconButton>
        </Box>
      ),
    },
  },
  ClickToCopy: { rendererProps: { enableClickToCopy: true } },
  ColumnActions: {
    rendererProps: { enableColumnActions: true },
    tableOptions: { enableColumnPinning: true },
  },
  ColumnDragging: { note: 'Drag handles are planned; up/down ordering controls are currently available.' },
  ColumnGrouping: {
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
  ColumnHiding: { rendererProps: { enableColumnVisibilityToggle: true } },
  ColumnOrdering: {
    rendererProps: { enableColumnOrderingControls: true },
    tableOptions: { enableColumnOrdering: true },
  },
  ColumnPinning: {
    rendererProps: { enableColumnActions: true },
    tableOptions: { enableColumnPinning: true },
  },
  ColumnResizing: {
    rendererProps: { enableColumnResizing: true },
    tableOptions: { enableColumnResizing: true },
  },
  Creating: { rendererProps: { enableCreating: true } },
  DensePadding: { note: 'Density modes are planned; Chakra size/variant controls are available today.' },
  DetailPanel: { note: 'Detail panels are planned in expansion slice.' },
  Editing: { rendererProps: { enableEditing: true } },
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
  Memo: { note: 'Memoization strategy options are planned in performance slice.' },
  Pagination: { rendererProps: { enablePagination: true } },
  RowActions: {
    rendererProps: {
      renderRowActions: () => (
        <Box display="flex" gap="1">
          <IconButton aria-label="Edit row" onClick={() => {}} size="xs" variant="ghost">
            <Pencil size={14} />
          </IconButton>
          <IconButton
            aria-label="Delete row"
            colorPalette="red"
            onClick={() => {}}
            size="xs"
            variant="ghost"
          >
            <Trash2 size={14} />
          </IconButton>
        </Box>
      ),
    },
  },
  RowDragging: { note: 'Row drag interactions are planned in DnD slice.' },
  RowNumbers: { rendererProps: { enableRowNumbers: true } },
  RowOrdering: { note: 'Row ordering via drag is planned; column ordering controls are currently available.' },
  RowPinning: { note: 'Row pinning is planned in pinning slice.' },
  Search: { rendererProps: { enableGlobalFilter: true } },
  Selection: {
    rendererProps: {
      enableRowSelection: true,
      renderActionBar: ({ selectedRows }) => (
        <Text fontSize="xs">Bulk actions for {selectedRows.length} selected</Text>
      ),
    },
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

export const FeatureStoryTable = ({
  featureName,
  storyArgs,
}: {
  featureName: FeatureName;
  storyArgs?: FeatureStoryArgs;
}) => {
  const preset = featurePresets[featureName];
  const resolvedStoryArgs: FeatureStoryArgs = {
    ...defaultFeatureStoryArgs,
    ...(storyArgs ?? {}),
  };
  const {
    pageSize,
    rowCount,
    seedOffset,
    ...rendererOverrides
  } = resolvedStoryArgs;
  const seed = featureName.length * 17 + seedOffset;
  const [data, setData] = useState<Person[]>(() => makeData(seed, rowCount));

  useEffect(() => {
    setData(makeData(seed, rowCount));
  }, [featureName, rowCount, seed]);

  const fallbackColumns = useMemo(() => makeColumns(), []);

  const table = useChakraReactTable({
    columns: (preset.tableOptions?.columns as CRT_ColumnDef<Person>[]) ?? fallbackColumns,
    data,
    enableColumnOrdering: preset.tableOptions?.enableColumnOrdering ?? true,
    enableColumnPinning: preset.tableOptions?.enableColumnPinning ?? false,
    enableColumnResizing:
      rendererOverrides.enableColumnResizing ??
      preset.tableOptions?.enableColumnResizing ??
      false,
    enableGlobalFilter:
      rendererOverrides.enableGlobalFilter ??
      preset.tableOptions?.enableGlobalFilter ??
      true,
    enablePagination:
      rendererOverrides.enablePagination ??
      preset.tableOptions?.enablePagination ??
      true,
    enableRowSelection:
      rendererOverrides.enableRowSelection ??
      preset.tableOptions?.enableRowSelection ??
      false,
    ...preset.tableOptions,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
      ...(preset.tableOptions?.initialState as Record<string, unknown> | undefined),
    },
  });

  const dynamicRendererProps: Partial<Omit<ChakraReactTableProps<Person>, 'table'>> = {};

  if (featureName === 'Editing') {
    dynamicRendererProps.enableEditing = true;
    dynamicRendererProps.onUpdateCell = ({
      columnId,
      rowIndex,
      value,
    }) => {
      setData((prev) =>
        prev.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row,
        ),
      );
    };
  }

  if (featureName === 'Creating') {
    dynamicRendererProps.enableCreating = true;
    dynamicRendererProps.onCreateRow = (values) => {
      setData((prev) => [
        {
          age: Number(values.age ?? faker.number.int({ min: 18, max: 70 })),
          city: String(values.city ?? faker.location.city()),
          email: String(values.email ?? faker.internet.email()),
          firstName: String(values.firstName ?? faker.person.firstName()),
          lastName: String(values.lastName ?? faker.person.lastName()),
        },
        ...prev,
      ]);
    };
  }

  return (
    <Box>
      {preset.note ? (
        <Text color="fg.muted" fontSize="sm" mb="3">
          {preset.note}
        </Text>
      ) : null}
      <ChakraReactTable
        caption={`${featureName} example`}
        enableColumnOrderingControls
        enableColumnVisibilityToggle
        enableGlobalFilter
        enablePagination
        table={table}
        {...(preset.rendererProps ?? {})}
        {...dynamicRendererProps}
        {...rendererOverrides}
      />
    </Box>
  );
};
