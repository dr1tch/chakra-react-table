# chakra-react-table

Greenfield monorepo for a Chakra-native table library built on top of TanStack Table.

## Workspace

- `packages/core` - headless table orchestration and typed contracts.
- `packages/chakra` - Chakra renderer package (public package).
- `packages/utils` - shared utilities.
- `packages/icons` - icon contract and defaults.
- `apps/docs` - Vite docs playground.
- `apps/storybook` - Storybook powered by Vite.

## Build System

- Monorepo: pnpm + Turborepo
- Packaging: Vite library mode + vite-plugin-dts
- Testing: Vitest
- Releases: Changesets
