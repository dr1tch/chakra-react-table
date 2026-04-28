import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'chakra-ui-react-table': resolve(__dirname, '../../packages/chakra/src/index.ts'),
      '@chakra-react-table/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@chakra-react-table/icons': resolve(__dirname, '../../packages/icons/src/index.tsx'),
    },
  },
});
