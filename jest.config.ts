import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!jsondiffpatch|flat).+\\.js$"],
};

export default config;
