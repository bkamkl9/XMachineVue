import { resolve } from "node:path";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: "hidden",
    minify: true,
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
        exports: "named",
      },
      plugins: [
        typescript({
          sourceMap: true,
          declaration: true,
          outDir: "dist",
          exclude: ["src/playground.ts", "src/tests/**"],
        }),
      ],
    },
  },
});
