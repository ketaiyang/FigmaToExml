import { format } from "../../common/parse";

export const exmlSize = (node: SceneNode): string => {
  return exmlSizePartial(node).join("");
};

export const exmlSizePartial = (
  node: SceneNode,
): [string, string] => {
  let w = format("width", node.width.toString())
  let h = format("height", node.height.toString())

  return [w, h];
};
