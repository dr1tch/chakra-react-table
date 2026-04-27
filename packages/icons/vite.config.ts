import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/createLibraryConfig';

export default createLibraryConfig({
  entry: resolve(__dirname, 'src/index.tsx'),
  externals: ['react'],
});
