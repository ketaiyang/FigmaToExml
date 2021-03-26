import { AltTextNode } from "../../altNodes/altMixins";
import { exmlSizePartial } from "./exmlSize";

export const exmlTextSize = (node: TextNode): string => {
  const [width, height] = exmlSizePartial(node);

  let comp = "";
  if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
    comp += width;
  }

  if (node.textAutoResize === "NONE") {
    comp += height;
  }
  
  return comp;
};
