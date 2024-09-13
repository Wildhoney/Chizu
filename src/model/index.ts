import { register } from "../dispatcher";

export class Property {
  property: symbol | string;
  value: unknown;

  constructor(value: unknown, property: symbol | string) {
    this.property = property;
    this.value = value;
  }

  public updater(update) {
    register(this.property, update);
  }

  public read(): string {
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
