import { Universal } from "./types";

const universal: Universal = new Proxy(function () {}, {
  get(_, prop) {
    if (prop === Symbol.iterator) return function* () {};
    if (prop === "toJSON") () => ({});
    return universal;
  },
  apply() {
    return universal;
  },
  ownKeys() {
    return [];
  },
  getOwnPropertyDescriptor() {
    return { configurable: true, enumerable: false };
  },
});

export default universal;
