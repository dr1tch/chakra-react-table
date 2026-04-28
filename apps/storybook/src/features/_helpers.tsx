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
  subRows?: Person[];
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
  density: 'compact',
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnOrderingControls: true,
  enableColumnResizing: false,
  enableColumnVisibilityToggle: true,
  enableCreating: false,
  enableEditing: false,
  enableExpanding: false,
  enableFullScreen: false,
  enableGlobalFilter: true,
  enablePagination: true,
  enableVirtualization: false,
  enableRowDragging: false,
  enableRowOrderingControls: false,
  enableRowPinning: false,
  enableRowSelection: false,
  interactive: true,
  isLoading: false,
  enableMemoizedRows: false,
  layoutMode: 'auto',
  loadingRowCount: 8,
  loadingType: 'skeleton',
  virtualizationHeight: 440,
  virtualizationOverscan: 6,
  virtualizationRowHeight: 44,
  pageSize: 8,
  rowCount: 40,
  seedOffset: 0,
  showColumnBorder: true,
  showColumnGroup: true,
  stickyHeader: true,
  striped: false,
  tableVariant: 'outline',
};

export const featureStoryArgTypes = {
  bordered: { control: 'boolean' },
  density: { control: 'radio', options: ['compact', 'comfortable', 'spacious'] },
  enableClickToCopy: { control: 'boolean' },
  enableColumnActions: { control: 'boolean' },
  enableColumnDragging: { control: 'boolean' },
  enableColumnOrderingControls: { control: 'boolean' },
  enableColumnResizing: { control: 'boolean' },
  enableColumnVisibilityToggle: { control: 'boolean' },
  enableCreating: { control: 'boolean' },
  enableEditing: { control: 'boolean' },
  enableExpanding: { control: 'boolean' },
  enableFullScreen: { control: 'boolean' },
  enableGlobalFilter: { control: 'boolean' },
  enablePagination: { control: 'boolean' },
  enableVirtualization: { control: 'boolean' },
  enableRowDragging: { control: 'boolean' },
  enableRowOrderingControls: { control: 'boolean' },
  enableRowPinning: { control: 'boolean' },
  enableRowNumbers: { control: 'boolean' },
  enableRowSelection: { control: 'boolean' },
  interactive: { control: 'boolean' },
  isLoading: { control: 'boolean' },
  enableMemoizedRows: { control: 'boolean' },
  layoutMode: { control: 'radio', options: ['auto', 'fixed'] },
  loadingRowCount: { control: { max: 30, min: 1, step: 1, type: 'number' } },
  loadingType: { control: 'radio', options: ['skeleton', 'overlay'] },
  virtualizationHeight: { control: { max: 1000, min: 200, step: 20, type: 'number' } },
  virtualizationOverscan: { control: { max: 30, min: 0, step: 1, type: 'number' } },
  virtualizationRowHeight: { control: { max: 80, min: 24, step: 1, type: 'number' } },
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

const makeTreeData = (seed: number, parentCount: number, childCount: number): Person[] => {
  faker.seed(seed);
  return Array.from({ length: parentCount }, () => {
    const parent: Person = {
      age: faker.number.int({ max: 90, min: 18 }),
      city: faker.location.city(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    parent.subRows = Array.from({ length: childCount }, () => ({
      age: faker.number.int({ max: 90, min: 18 }),
      city: faker.location.city(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }));

    return parent;
  });
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
    rendererProps: { enableExpanding: true },
    tableOptions: {
      columns: [
        { accessorKey: 'city', header: 'City' },
        {
          accessorKey: 'firstName',
          aggregationFn: 'count',
          aggregatedCell: ({ getValue }) => `${getValue<number>() ?? 0} people`,
          header: 'People',
        },
        {
          accessorKey: 'age',
          aggregationFn: 'mean',
          aggregatedCell: ({ getValue }) => {
            const value = getValue<number>();
            return `${Math.round(value ?? 0)} avg`;
          },
          header: 'Average age',
        },
        {
          accessorKey: 'email',
          aggregationFn: 'count',
          aggregatedCell: ({ getValue }) => `${getValue<number>() ?? 0} emails`,
          header: 'Email count',
        },
      ],
      enableExpanding: true,
      enableGrouping: true,
      initialState: {
        expanded: true,
        grouping: ['city'],
      },
    },
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
  ColumnDragging: {
    rendererProps: { enableColumnDragging: true },
    tableOptions: { enableColumnOrdering: true },
  },
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
  DensePadding: {
    rendererProps: { density: 'compact' },
  },
  DetailPanel: {
    rendererProps: {
      enableExpanding: true,
      renderDetailPanel: (row) => (
        <Box color="fg.muted" fontSize="sm" py="2">
          Detail panel for {String(row.original.firstName)} {String(row.original.lastName)}
        </Box>
      ),
    },
    tableOptions: {
      enableExpanding: true,
      getRowCanExpand: () => true,
    },
  },
  Editing: { rendererProps: { enableEditing: true } },
  Filtering: {
    rendererProps: { enableGlobalFilter: true },
    tableOptions: { enableGlobalFilter: true },
  },
  FullScreen: { rendererProps: { enableFullScreen: true } },
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
  LayoutMode: {
    rendererProps: { layoutMode: 'fixed' },
  },
  Loading: {
    rendererProps: {
      enablePagination: false,
      isLoading: true,
      loadingRowCount: 10,
      loadingType: 'skeleton',
    },
  },
  Memo: {
    rendererProps: { enableMemoizedRows: true },
  },
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
  RowDragging: {
    rendererProps: { enableRowDragging: true },
  },
  RowNumbers: { rendererProps: { enableRowNumbers: true } },
  RowOrdering: {
    rendererProps: { enableRowOrderingControls: true },
  },
  RowPinning: {
    rendererProps: { enableRowPinning: true },
    tableOptions: {
      enableRowPinning: true,
      initialState: {
        rowPinning: {
          top: ['0'],
        },
      },
    },
  },
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
  SubRowTree: {
    rendererProps: { enableExpanding: true },
    tableOptions: {
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
    },
  },
  Toolbar: {
    rendererProps: {
      enableColumnOrderingControls: true,
      enableColumnVisibilityToggle: true,
      enableGlobalFilter: true,
    },
    tableOptions: { enableColumnOrdering: true },
  },
  Virtualization: {
    rendererProps: {
      enablePagination: false,
      enableVirtualization: true,
      virtualizationHeight: 440,
      virtualizationOverscan: 8,
      virtualizationRowHeight: 44,
    },
  },
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
  const [data, setData] = useState<Person[]>(() =>
    featureName === 'SubRowTree'
      ? makeTreeData(seed, Math.max(8, Math.floor(rowCount / 2)), 3)
      : makeData(seed, rowCount),
  );

  useEffect(() => {
    setData(
      featureName === 'SubRowTree'
        ? makeTreeData(seed, Math.max(8, Math.floor(rowCount / 2)), 3)
        : makeData(seed, rowCount),
    );
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
    enableRowPinning:
      rendererOverrides.enableRowPinning ??
      preset.tableOptions?.enableRowPinning ??
      false,
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

  if (featureName === 'RowOrdering' || featureName === 'RowDragging') {
    dynamicRendererProps.enableRowDragging = featureName === 'RowDragging';
    dynamicRendererProps.enableRowOrderingControls = featureName === 'RowOrdering';
    dynamicRendererProps.onReorderRows = (sourceRow, targetRow) => {
      setData((prev) => {
        const sourceIndex = prev.findIndex((item) => item === sourceRow.original);
        const targetIndex = prev.findIndex((item) => item === targetRow.original);
        if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return prev;
        const next = [...prev];
        const [moved] = next.splice(sourceIndex, 1);
        if (!moved) return prev;
        next.splice(targetIndex, 0, moved);
        return next;
      });
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
