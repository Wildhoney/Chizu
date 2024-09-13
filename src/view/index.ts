export function render(
  tree,
  container: DocumentFragment | HTMLElement = document.createDocumentFragment(),
): Text | DocumentFragment | HTMLElement {
  if (!Array.isArray(tree)) {
    return container.appendChild(document.createTextNode(tree));
  }

  const [tag, attributes, children] = tree;
  const node = document.createElement(tag);
  container.appendChild(node);

  [].concat(children).map((child) => render(child, node));

  return container;
}

export function update() {}
