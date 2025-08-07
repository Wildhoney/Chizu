/* eslint-disable @typescript-eslint/no-explicit-any */

export default {
  Synchronous(target: any, propertyKey: string) {
    return function (...args: any[]) {
      return target[propertyKey](...args);
    };
  },
  Debounce(target: any, propertyKey: string) {
    return function (...args: any[]) {
      return target[propertyKey](...args);
    };
  },
};
