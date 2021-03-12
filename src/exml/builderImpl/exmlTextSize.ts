import { AltTextNode } from "../../altNodes/altMixins";
import { exmlSizePartial } from "./exmlSize";

export const exmlTextSize = (node: AltTextNode, isJsx: boolean): string => {
  const [width, height] = exmlSizePartial(node, isJsx);

  let comp = "";
  if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
    comp += width;
  }

  if (node.textAutoResize === "NONE") {
    comp += height;
  }

  return comp;
};
