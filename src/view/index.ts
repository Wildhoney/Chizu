import { Property } from "../model";

export function render(
  tree,
  container: DocumentFragment | HTMLElement = document.createDocumentFragment(),
): Text | DocumentFragment | HTMLElement {
  if (!Array.isArray(tree)) {
    if (tree instanceof Property) {
      const node = document.createTextNode(tree.read());
      tree.updater((value) => (node.textContent = value));
      return container.appendChild(node);
    }

    const node = document.createTextNode(tree);
    return container.appendChild(node);
  }

  const [tag, attributes, children] = tree;
  const node = document.createElement(tag);
  container.appendChild(node);

  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof Property) {
      value.updater((value) => node.setAttribute(key, value));
      node.setAttribute(key, value.read());
    } else {
      node.setAttribute(key, value);
    }
  }

  [].concat(children).map((child) => render(child, node));

  return container;
}

export function update() {}
