import { Patch } from "immer";
import { Property } from "../model";
import { Operation } from "../operations";

export function render(
  tree,
  container: DocumentFragment | HTMLElement = document.createDocumentFragment(),
): Text | DocumentFragment | HTMLElement {
  if (!Array.isArray(tree)) {
    // We have a primitive and thus we're creating a text node.
    if (tree instanceof Property) {
      const node = document.createTextNode(tree.get());
      tree.register((patch: Patch) => {
        switch (patch.op) {
          case "replace":
            return void (node.textContent = patch.value);
          case "remove":
            return void node.remove();
        }
      });
      return container.appendChild(node);
    }

    const node = document.createTextNode(tree);
    return container.appendChild(node);
  }

  const [tag, attributes, children] = tree;

  if (tag === Operation) {
    // We have an operation we're skipping for now.
    return container;
  }

  // We have an element and thus we're creating it and attaching its attributes and events.
  const node = document.createElement(tag);
  container.appendChild(node);

  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof Property) {
      value.register((patch: Patch) => {
        switch (patch.op) {
          case "replace":
            return void node.setAttribute(key, patch.value);
          case "remove":
            return void node.removeAttribute(key);
        }
      });
      node.setAttribute(key, value.get());
    } else {
      node.setAttribute(key, value);
    }
  }

  // We're rendering the children of the element as well.
  [].concat(children).map((child) => render(child, node));

  return container;
}

export function update() {}

export function create<T>(name: string, tree: T): T {
  return tree;
}
