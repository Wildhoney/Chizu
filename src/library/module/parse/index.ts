import { ComponentChildren, isValidElement, VNode } from "preact";

const transparent =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/5c60mEAAAAASUVORK5CYII=";

const skeleton = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  color: "transparent",
};

export default function parse(tree: VNode): ComponentChildren {
  function seek(tree: VNode) {
    if (!isValidElement(tree)) {
      return tree;
    }

    const busy =
      "aria-busy" in Object(tree.props) && tree.props["aria-busy"] === true;

    return {
      ...tree,
      props: {
        ...tree.props,
        src: busy ? transparent : tree.props.src,
        style: busy
          ? { ...(tree.props.style ?? {}), ...skeleton }
          : tree.props.style,
        children: Array.isArray(tree.props?.children)
          ? tree.props.children.map(seek)
          : tree.props?.children,
      },
    };
  }

  console.log(seek(tree));

  return seek(tree);
}
