import {
  AltFrameNode,
  AltSceneNode,
  AltRectangleNode,
  AltEllipseNode,
  AltTextNode,
  AltGroupNode,
} from "../altNodes/altMixins";
import { ExmlTextBuilder } from "./exmlTextBuilder";
import { ExmlRectBuilder } from "./exmlRectBuilder";
import { ExmlDefaultBuilder as ExmlDefaultBuilder } from "./exmlDefaultBuilder";
import { format } from "../common/parse";
import { indentString } from "../common/indentString";
import { components, common as comComps, properties } from "./builderImpl/exmlComponent";
import { retrieveTopFill } from "../common/retrieveFill";
import { getCompType } from "./builderImpl/exmlCustom"
import { exmlLayout } from "./builderImpl/exmlLayout"

let parentId = "";

let showLayerName = false;

export const exmlMain = (
  sceneNode: Array<AltSceneNode>,
  parentIdSrc: string = "",
  isJsx: boolean = false,
  layerName: boolean = false,
  node: FrameNode | GroupNode
): string => {
  parentId = parentIdSrc;
  showLayerName = layerName;

  let result = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
  let classname = node.getPluginData(properties.class[0])
  let generator = exmlWidgetGenerator(node.children);
  result += `\n<e:Skin ${classname.trim()!==""?`class="${classname} "`:""}width="${node.width}" height="${node.height}" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:euiex="euiex.*">${indentString(generator)}\n</e:Skin>`

  // remove the initial \n that is made in Container.
  // if (result.length > 0 && result.slice(0, 1) === "\n") {
  //   result = result.slice(1, result.length);
  // }

  return result;
};

// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const exmlWidgetGenerator = (
  nodes : ReadonlyArray<SceneNode> = null
): string => {
  let comp = "";
  
  // filter non visible nodes. This is necessary at this step because conversion already happened.
  // const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);

  // const sceneLen = visibleSceneNode.length;

  // visibleSceneNode.forEach((node, index) => {
  //   console.log(components[node.name])
  //   if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
  //     comp += exmlContainer(node, "", "", isJsx);
  //   } else if (node.type === "GROUP") {
  //     comp += exmlGroup(node, isJsx);
  //   } else if (node.type === "FRAME") {
  //     comp += exmlFrame(node, isJsx);
  //   } else if (node.type === "TEXT") {
  //     comp += exmlText(node, false, isJsx);
  //   }

  //   comp += addSpacingIfNeeded(node, index, sceneLen, isJsx);

  //   // todo support Line
  // });

  const visibleNode = nodes.filter((d) => d.visible != false && !d.name.trimStart().startsWith("ignore"))
  visibleNode.forEach((node, index) => {
    // if (node.type === "TEXT"){
    //   comp += exmlText(node);
    // } else if (node.type === "RECTANGLE") {
    //   let fill = retrieveTopFill(node.fills)
    //   if (fill.type === "SOLID"){
    //     comp += exmlRect(node)
    //   } else if (fill.type === "IMAGE"){

    //   }
    // }
    if ("layoutMode" in node){
      console.log(node.layoutMode)
      console.log(node.primaryAxisSizingMode)
      console.log(node.counterAxisSizingMode)
      console.log(node.primaryAxisAlignItems)
      console.log(node.counterAxisAlignItems)
      console.log(node.itemSpacing)
      console.log(node.horizontalPadding)
      console.log(node.verticalPadding)
    }

    let name = node.getPluginData("name")
    let compType = getCompType(node, name)
    if (compType) {
      if (compType.length > 1) {
        if (name === undefined || name === "") {
          comp += exmlComp(node, compType[0])
        } else {
          comp += exmlComp(node, name)
        }
      } else {
        comp += exmlComp(node, compType[0])
      }
    } else {
      comp += exmlContainer(node)
    }
    // if (compType === "group") { 
    //   comp += exmlContainer(node)
    // } else if (compType === "rect") {
    //   comp += exmlRect(node as RectangleNode)
    // } else if (compType === "image") {
    //   comp += exmlContainer(node)
    // } else if (compType === "label") {
    //   if (name === undefined || name === "" || name === "Label") {
    //     comp += exmlText(node as TextNode);
    //   } else if (name === "EditableText") {
    //     comp += exmlEditableText(node as TextNode);
    //   }
    // } else {
    //   comp += exmlContainer(node)
    // }

  });

  return comp;
};

const exmlComp = (node: SceneNode, type: string): string => {
  let comp = "";

  if (type === "Group") { 
    comp += exmlContainer(node)
  } else if (type === "Rect") {
    comp += exmlRect(node as RectangleNode)
  } else if (type === "Image") {
    comp += exmlContainer(node)
  } else if (type === "Label") {
    comp += exmlText(node as TextNode);
  } else if (type === "EditableText") {
    comp += exmlEditableText(node as TextNode);
  } else {
    comp += exmlContainer(node)
  }

  return comp
}

const exmlGroup = (node: AltGroupNode, isJsx: boolean = false): string => {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  // also ignore if there are no children inside, which makes no sense
  if (node.width <= 0 || node.height <= 0 || node.children.length === 0) {
    return "";
  }

  // const vectorIfExists = tailwindVector(node, isJsx);
  // if (vectorIfExists) return vectorIfExists;

  // this needs to be called after CustomNode because widthHeight depends on it
  const builder = new ExmlDefaultBuilder(node, showLayerName, isJsx)
    .blend(node)
    .widthHeight(node)
    .position(node, parentId);

  if (builder.style) {
    const attr = builder.build(format("position", isJsx, "relative"));

    const generator = exmlWidgetGenerator(node.children, isJsx);

    return `\n<div${attr}>${indentString(generator)}\n</div>`;
  }

  return exmlWidgetGenerator(node.children, isJsx);
};

const exmlText = (
  node: TextNode,
  isInput: boolean = false,
): string | [string, string] => {
  // follow the website order, to make it easier

  const builder = new ExmlTextBuilder(node)
    .blend(node)
    .textAutoSize(node)
    .textCharacters(node)
    .constraint(node)
    .position(node)
    .shadow(node)
    .textStroke(node)
    // todo fontFamily (via node.fontName !== figma.mixed ? `fontFamily: ${node.fontName.family}`)
    // todo font smoothing
    .fontSize(node)
    .fontStyle(node)
    // .letterSpacing(node)
    // .lineHeight(node)
    // .textDecoration(node)
    // todo text lists (<li>)
    .textAlign(node)
    .customColor(node.fills, "textColor")
    // .textTransform(node);

  // const splittedChars = node.characters.split("\n");
  // const charsWithLineBreak =
  //   splittedChars.length > 1
  //     ? node.characters.split("\n").join("<br/>")
  //     : node.characters;

  // if (isInput) {
  //   return [builderResult.style, charsWithLineBreak];
  // } else {
  //   return `\n<p${builderResult.build()}>${charsWithLineBreak}</p>`;
  // }
  return `\n<${builder.comp.head}${builder.build()}/>`
};

const exmlEditableText = (
  node: TextNode,
): string | [string, string] => {
  // follow the website order, to make it easier

  const builder = new ExmlTextBuilder(node)
    .blend(node)
    .textAutoSize(node)
    .textCharacters(node, "prompt")
    .constraint(node)
    .position(node)
    .shadow(node)
    .textStroke(node)
    .fontSize(node)
    .fontStyle(node)
    .textAlign(node)
    .customColor(node.fills, "promptColor")

  return `\n<${builder.comp.head}${builder.build()}/>`
};

const exmlRect = (
  node: RectangleNode
) : string => {
  const builder = new ExmlRectBuilder(node)
    .blend(node)
    .position(node)
    .constraint(node)
    .widthHeight(node)
    .customColor(node.fills, "fillColor")
    .rectAlpha(node)
    .rectStroke(node)
    .rectEllipse(node)

  return `\n<${builder.comp.head}${builder.build()}/>`
}

const exmlFrame = (node: AltFrameNode, isJsx: boolean = false): string => {
  // const vectorIfExists = tailwindVector(node, isJsx);
  // if (vectorIfExists) return vectorIfExists;

  if (
    node.children.length === 1 &&
    node.children[0].type === "TEXT" &&
    node?.name?.toLowerCase().match("input")
  ) {
    const isInput = true;
    const [attr, char] = exmlText(node.children[0], isInput, isJsx);
    return exmlContainer(node, ` placeholder="${char}"`, attr, isJsx, isInput);
  }

  const childrenStr = exmlWidgetGenerator(node.children, isJsx);

  if (node.layoutMode !== "NONE") {
    const rowColumn = rowColumnProps(node, isJsx);
    return exmlContainer(node, childrenStr, rowColumn, isJsx);
  } else {
    // node.layoutMode === "NONE" && node.children.length > 1
    // children needs to be absolute
    return exmlContainer(
      node,
      childrenStr,
      format("position", isJsx, "relative"),
      isJsx
    );
  }
};

// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
export const exmlContainer = (
  node: SceneNode,
): string => {

  const builder = new ExmlDefaultBuilder(node)
    .blend(node)
    .constraint(node)
    .position(node)
    .widthHeight(node)
  
  if (builder.comp.head !== ""){
    if (builder.comp.child && "children" in node) {
      if ("layoutMode" in node) {
        let layout = exmlLayout(node)
        return `\n<${builder.comp.head}${builder.build()}>${indentString(layout+exmlWidgetGenerator(node.children))}\n</${builder.comp.head}>`;
      } else {
        return `\n<${builder.comp.head}${builder.build()}>${indentString(exmlWidgetGenerator(node.children))}\n</${builder.comp.head}>`;
      }
    } else {
      return `\n<${builder.comp.head}${builder.build()}/>`;
    }
  }

  console.log(node.name,node.type)
  return ""
};

export const rowColumnProps = (node: AltFrameNode, isJsx: boolean): string => {
  // ROW or COLUMN

  // ignore current node when it has only one child and it has the same size
  if (
    node.children.length === 1 &&
    node.children[0].width === node.width &&
    node.children[0].height === node.height
  ) {
    return "";
  }

  // [optimization]
  // flex, by default, has flex-row. Therefore, it can be omitted.
  const rowOrColumn =
    node.layoutMode === "HORIZONTAL"
      ? format("flex-direction", isJsx, "row")
      : format("flex-direction", isJsx, "column");

  // special case when there is only one children; need to position correctly in Flex.
  // let justify = "justify-center";
  // if (node.children.length === 1) {
  //   const nodeCenteredPosX = node.children[0].x + node.children[0].width / 2;
  //   const parentCenteredPosX = node.width / 2;

  //   const marginX = nodeCenteredPosX - parentCenteredPosX;

  //   // allow a small threshold
  //   if (marginX < -4) {
  //     justify = "justify-start";
  //   } else if (marginX > 4) {
  //     justify = "justify-end";
  //   }
  // }
  let primaryAlign: string;

  switch (node.primaryAxisAlignItems) {
    case "MIN":
      primaryAlign = "flex-start";
      break;
    case "CENTER":
      primaryAlign = "center";
      break;
    case "MAX":
      primaryAlign = "flex-end";
      break;
    case "SPACE_BETWEEN":
      primaryAlign = "space-between";
      break;
  }

  primaryAlign = format("justify-content", isJsx, primaryAlign);

  // [optimization]
  // when all children are STRETCH and layout is Vertical, align won't matter. Otherwise, center it.
  let counterAlign: string;
  switch (node.counterAxisAlignItems) {
    case "MIN":
      counterAlign = "flex-start";
      break;
    case "CENTER":
      counterAlign = "center";
      break;
    case "MAX":
      counterAlign = "flex-end";
      break;
  }
  counterAlign = format("align-items", isJsx, counterAlign);

  // if parent is a Frame with AutoLayout set to Vertical, the current node should expand
  let flex =
    node.parent &&
    "layoutMode" in node.parent &&
    node.parent.layoutMode === node.layoutMode
      ? "flex"
      : "inline-flex";

  flex = format("display", isJsx, flex);

  return `${flex}${rowOrColumn}${counterAlign}${primaryAlign}`;
};

const addSpacingIfNeeded = (
  node: AltSceneNode,
  index: number,
  len: number,
  isJsx: boolean
): string => {
  // Ignore this when SPACE_BETWEEN is set.
  if (
    node.parent?.type === "FRAME" &&
    node.parent.layoutMode !== "NONE" &&
    node.parent.primaryAxisAlignItems !== "SPACE_BETWEEN"
  ) {
    // check if itemSpacing is set and if it isn't the last value.
    // Don't add at the last value. In Figma, itemSpacing CAN be negative; here it can't.
    if (node.parent.itemSpacing > 0 && index < len - 1) {
      const wh = node.parent.layoutMode === "HORIZONTAL" ? "width" : "height";

      // don't show the layer name in these separators.
      const style = new ExmlDefaultBuilder(node, false, isJsx).build(
        format(wh, isJsx, node.parent.itemSpacing)
      );
      return `\n<div${style}></div>`;
    }
  }
  return "";
};
