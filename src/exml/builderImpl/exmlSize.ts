import { format } from "../../common/parse";
import { AltSceneNode } from "../../altNodes/altMixins";
import { nodeWidthHeight } from "../../common/nodeWidthHeight";

export const exmlSize = (node: SceneNode): string => {
  return exmlSizePartial(node).join("");
};

export const exmlSizePartial = (
  node: SceneNode,
): [string, string] => {
  let w = format("width", node.width.toString())
  let h = format("height", node.height.toString())
  return [w, h];

  // const size = nodeWidthHeight(node, false);

  // let w = "";
  // if (typeof size.width === "number") {
  //   w += format("width", size.width);
  // } else if (size.width === "full") {
  //   if (
  //     node.parent &&
  //     "layoutMode" in node.parent &&
  //     node.parent.layoutMode === "HORIZONTAL"
  //   ) {
  //     w += format("flex", "1 1 0%");
  //   } else {
  //     w += format("width", "100%");
  //   }
  // }

  // let h = "";
  // if (typeof size.height === "number") {
  //   h += format("height", size.height);
  // } else if (typeof size.height === "string") {
  //   if (
  //     node.parent &&
  //     "layoutMode" in node.parent &&
  //     node.parent.layoutMode === "VERTICAL"
  //   ) {
  //     h += format("flex", "1 1 0%");
  //   } else {
  //     h += format("height", "100%");
  //   }
  // }

  // return [w, h];
};
