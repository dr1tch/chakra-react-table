import { defineConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

export type LibraryConfigInput = {
  entry: string;
  externals: string[];
};

export const createLibraryConfig = ({
  entry,
  externals,
}: LibraryConfigInput): UserConfig =>
  defineConfig({
    plugins: [
      dts({
        entryRoot: 'src',
        include: ['src'],
        insertTypesEntry: true,
        rollupTypes: false,
      }),
    ],
    build: {
      lib: {
        entry,
        fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
        formats: ['es', 'cjs'],
      },
      sourcemap: true,
      rollupOptions: {
        external: externals,
      },
    },
  });
