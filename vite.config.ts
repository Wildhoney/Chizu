import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    visualizer(),
    dts({
      include: ["src/library"],
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
          "eventemitter3",
          "immer",
          "lodash",
          "react",
          "traverse",
        ].some((pkg) => id === pkg || id.startsWith(pkg + "/"));
      },
      output: {
        globals: {
          eventemitter3: "EventEmitter3",
          immer: "Immer",
          lodash: "_",
          react: "React",
          traverse: "Traverse",
        },
      },
    },
  },
});
