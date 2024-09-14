import { register } from "../dispatcher";

export class Property {
  property: symbol | string;
  value: unknown;
  node: Text;

  constructor(value: unknown, property: symbol | string) {
    this.property = property;
    this.value = value;
  }

  public register(update) {
    register(this.property, update);
  }

  public get(): string {
    return String(this.value);
  }
}

export function decorate<T extends object>(model: T) {
  return new Proxy<T>(model, {
    get(target, property) {
      const value = Reflect.get(target, property);
      return new Property(value, property);
    },
  });
}

// [
//   {
//       "op": "replace",
//       "path": [
//           "friends",
//           0,
//           "age"
//       ],
//       "value": 22
//   },
//   {
//       "op": "add",
//       "path": [
//           "friends",
//           3
//       ],
//       "value": {
//           "name": "Adam",
//           "age": 35
//       }
//   }
// ]
