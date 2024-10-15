export default function module(options: any) {
  return new (class Module {
    public meta = options;
  })();
}
