export class Property {
  property: symbol | string;
  value: unknown;
  textNode: Text;

  constructor(value: unknown, property: symbol | string) {
    this.property = property;
    this.value = value;
  }

  public assign(textNode: Text) {
    this.textNode = textNode;
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
