import typedCssModulesPlugin from "vite-plugin-typed-css-modules";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [typedCssModulesPlugin()],
};

export default config;
