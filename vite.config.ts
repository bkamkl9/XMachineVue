import { defineConfig } from "vite";
import { resolve } from "node:path";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [{ src: "README.md", dest: "." }],
    }),
  ],
  build: {
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
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
        typescriptPaths({
          preserveExtensions: true,
        }),
      ],
    },
  },
});
