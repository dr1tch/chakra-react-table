import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'chakra-react-table': resolve(
        __dirname,
        '../../../packages/chakra/src/index.ts',
      ),
      '@chakra-react-table/core': resolve(
        __dirname,
        '../../../packages/core/src/index.ts',
      ),
    };
    return config;
  },
};

export default config;
