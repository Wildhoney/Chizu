const events = new Map();

export function register(name, listener) {
  events.set(name, listener);
}

export function dispatch(name, payload) {
  events.get(name)(payload);
}
