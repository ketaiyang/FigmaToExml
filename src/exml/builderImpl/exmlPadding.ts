import { format } from "../../common/parse";
import { numToAutoFixed } from "../../common/numToAutoFixed";
import { AltFrameMixin, AltDefaultShapeMixin } from "../../altNodes/altMixins";
import { commonPadding } from "../../common/commonPadding";

/**
 * https://tailwindcss.com/docs/margin/
 * example: px-2 py-8
 */
export const exmlPadding = (
  node: AltFrameMixin | AltDefaultShapeMixin,
  isJsx: boolean
): string => {
  const padding = commonPadding(node);
  if (!padding) {
    return "";
  }

  if ("all" in padding) {
    return format("padding", isJsx, padding.all);
  }

  let comp = "";

  // horizontal and vertical, as the default AutoLayout
  if (padding.horizontal) {
    comp += format("padding-left", isJsx, padding.horizontal);
    comp += format("padding-right", isJsx, padding.horizontal);
  }
  if (padding.vertical) {
    comp += format("padding-top", isJsx, padding.vertical);
    comp += format("padding-bottom", isJsx, padding.vertical);
  }
  if (padding.top) {
    comp += format("padding-top", isJsx, padding.top);
  }
  if (padding.bottom) {
    comp += format("padding-bottom", isJsx, padding.bottom);
  }
  if (padding.left) {
    comp += format("padding-left", isJsx, padding.left);
  }
  if (padding.right) {
    comp += format("padding-right", isJsx, padding.right);
  }

  // todo use REM

  return comp;
};
