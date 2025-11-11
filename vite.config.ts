import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    visualizer(),
    dts({
      include: ["src/library"],
      outDir: "dist",
      entryRoot: "src/library",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/library/index.ts"),
      name: "Chizu",
      fileName: "chizu",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external(id) {
        return [
          "@mobily/ts-belt",
          "eventemitter3",
          "immer",
          "immeration",
          "lodash",
          "react",
          "react-dom",
          "traverse",
        ].some((pkg) => id === pkg || id.startsWith(pkg + "/"));
      },
      output: {
        globals: {
          "@mobily/ts-belt": "TsBelt",
          eventemitter3: "EventEmitter3",
          immer: "Immer",
          immeration: "Immeration",
          lodash: "_",
          react: "React",
          "react-dom": "ReactDOM",
          traverse: "Traverse",
        },
      },
    },
  },
});
