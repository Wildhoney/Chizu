
export default{
    Synchronous(target: any, propertyKey: string) {
      return function (...args: any[]) {
        return target[propertyKey](...args);
      };
    },
  Debounce(delay: number) {
    return function (target: any, propertyKey: string) {};
  },
};