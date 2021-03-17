import { AltSceneNode } from "../../altNodes/altMixins";
import { format } from "../../common/parse";

/**
 * https://tailwindcss.com/docs/border-radius/
 * example: rounded-sm
 * example: rounded-tr-lg
 */
export const exmlBorderRadius = (
  node: AltSceneNode,
  isJsx: boolean
): string => {
  if (node.type === "ELLIPSE") {
    return format("border-radius", isJsx, 9999);
  } else if (
    (!("cornerRadius" in node) && !("topLeftRadius" in node)) ||
    (node.cornerRadius === figma.mixed && node.topLeftRadius === undefined) ||
    node.cornerRadius === 0
  ) {
    // the second condition is used on tests. On Figma, topLeftRadius is never undefined.
    // ignore when 0, undefined or non existent
    return "";
  }

  let comp = "";

  if (node.cornerRadius !== figma.mixed) {
    comp += format("border-radius", isJsx, node.cornerRadius);
  } else {
    // todo optimize for tr/tl/br/bl instead of t/r/l/b
    if (node.topLeftRadius !== 0) {
      comp += format(
        "border-top-left-radius",
        isJsx,
        node.topLeftRadius
      );
    }
    if (node.topRightRadius !== 0) {
      comp += format(
        "border-top-right-radius",
        isJsx,
        node.topRightRadius
      );
    }
    if (node.bottomLeftRadius !== 0) {
      comp += format(
        "border-bottom-left-radius",
        isJsx,
        node.bottomLeftRadius
      );
    }
    if (node.bottomRightRadius !== 0) {
      comp += format(
        "border-bottom-right-radius",
        isJsx,
        node.bottomRightRadius
      );
    }
  }

  return comp;
};
