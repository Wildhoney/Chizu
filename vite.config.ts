import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    visualizer(),
    dts({
      insertTypesEntry: true,
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
        return ["react", "react-dom", "eventemitter3"].some(
          (pkg) => id === pkg || id.startsWith(pkg + "/"),
        );
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          eventemitter3: "EventEmitter3",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
