import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  plugins: [],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
      plugins: [
        typescript({
          declaration: true,
          outDir: 'dist',
        }),
      ],
    },
  },
})
