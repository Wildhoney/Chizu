import { defineConfig } from 'vite';
import { resolve } from 'node:path'

export default defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'src/library/index.ts'),
        name: 'Chizu',
        fileName: 'chizu',
        formats: ['es', 'umd'],
      },
      rollupOptions: {
        external: ['eventemitter3', 'react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            eventemitter3: 'EventEmitter3',
          },
        },
      },
    },
  })