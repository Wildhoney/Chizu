export default function createTrackedModel<M>(model: M, base = "") {
  return new Proxy(base || {}, {
    get(target, prop) {
      if (typeof prop === "symbol") return Reflect.get(target, prop); // Handle symbols like `toStringTag`

      const path = base ? `${base}.${String(prop)}` : String(prop);
      const value = Reflect.get(target, prop);

      if (value && typeof value === "object")
        return createTrackedModel(value, path);

      return {
        getPath() {
          return path;
        },
        getValue() {
          return value;
        },
      };
    },
  });
}
