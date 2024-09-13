import { Property } from "../model";

export function render(
  tree,
  container: DocumentFragment | HTMLElement = document.createDocumentFragment(),
): Text | DocumentFragment | HTMLElement {
  if (!Array.isArray(tree)) {
    if (tree instanceof Property) {
      const node = document.createTextNode(tree.read());
      tree.assign(node);
      return container.appendChild(node);
    }

    const node = document.createTextNode(tree);
    return container.appendChild(node);
  }

  const [tag, attributes, children] = tree;
  const node = document.createElement(tag);
  container.appendChild(node);

  [].concat(children).map((child) => render(child, node));

  return container;
}

export function update() {}
