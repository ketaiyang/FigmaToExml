import {
  AltFrameNode,
  AltSceneNode,
  AltRectangleNode,
  AltEllipseNode,
  AltTextNode,
  AltGroupNode,
} from "../altNodes/altMixins";
import { ExmlTextBuilder } from "./exmlTextBuilder";
import { ExmlDefaultBuilder as ExmlDefaultBuilder } from "./exmlDefaultBuilder";
import { format } from "../common/parse";
import { indentString } from "../common/indentString";
import { components, common as comComps, properties } from "./builderImpl/exmlComponent";
import { retrieveTopFill } from "../common/retrieveFill";

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
  let generator = exmlWidgetGenerator(sceneNode, isJsx, node.children);
  result += `\n<e:Skin width="${node.width}" height="${node.height}" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">${indentString(generator)}\n</e:Skin>`

  // remove the initial \n that is made in Container.
  if (result.length > 0 && result.slice(0, 1) === "\n") {
    result = result.slice(1, result.length);
  }

  return result;
};

// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const exmlWidgetGenerator = (
  sceneNode: ReadonlyArray<AltSceneNode>,
  isJsx: boolean,
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
    if (node.type === "TEXT"){
      if (node.fontName !== figma.mixed){
        console.log(node.fontName.style)
        console.log(node.constraints.horizontal)
        console.log(node.getPluginData("id"))
        // node.setPluginData("id","256")
      }
      // comp += exmlText(node);
    }
    console.log(node.name+node.type+("constraints" in node))
    // console.log(node.name+node.constraints.horizontal)
    if ("constraints" in node) {
      // if(node.parent.type === "COMPONENT"){
      //   node.parent.width
      // }
      console.log(node.name+node.constraints.horizontal)
    }
  });

  return comp;
};

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

  const builderResult = new ExmlTextBuilder(node)
    .blend(node)
    .textAutoSize(node)
    .position(node, parentId)
    // todo fontFamily (via node.fontName !== figma.mixed ? `fontFamily: ${node.fontName.family}`)
    // todo font smoothing
    .fontSize(node)
    .fontStyle(node)
    .letterSpacing(node)
    .lineHeight(node)
    .textDecoration(node)
    // todo text lists (<li>)
    .textAlign(node)
    .customColor(node.fills, "text")
    .textTransform(node);

  const splittedChars = node.characters.split("\n");
  const charsWithLineBreak =
    splittedChars.length > 1
      ? node.characters.split("\n").join("<br/>")
      : node.characters;

  if (isInput) {
    return [builderResult.style, charsWithLineBreak];
  } else {
    return `\n<p${builderResult.build()}>${charsWithLineBreak}</p>`;
  }
};

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
  node: AltFrameNode | AltRectangleNode | AltEllipseNode,
  children: string,
  additionalStyle: string = "",
  isJsx: boolean,
  isInput: boolean = false
): string => {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width <= 0 || node.height <= 0) {
    return children;
  }

  const builder = new ExmlDefaultBuilder(node, showLayerName, isJsx)
    .blend(node)
    .autoLayoutPadding(node)
    .widthHeight(node)
    .position(node, parentId)
    .customColor(node.fills, "background-color")
    // TODO image and gradient support (tailwind does not support gradients)
    .shadow(node)
    .border(node);

  if (isInput) {
    return `\n<input${builder.build(additionalStyle)}>${children}</input>`;
  }

  if (builder.style || additionalStyle) {
    const build = builder.build(additionalStyle);

    if (children) {
      return `\n<div${build}>${indentString(children)}\n</div>`;
    } else {
      return `\n<div${build}></div>`;
    }
  }

  return children;
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

export const compParse = (
  node: SceneNode,
) : {}=> {

  let dict = {}

  let name = node.getPluginData("name")
  if (node.type === "FRAME" || node.type === "GROUP"){
    if (name === ""){
      name = "Group"
    }
  } else if (node.type === "RECTANGLE"){
    let fill = retrieveTopFill(node.fills)
    if (fill.type === "SOLID"){
      name = "Rect"
      dict["fix"] = true
    } else if (fill.type === "IMAGE"){
      name = "Image"
      dict["fix"] = true
    }
  } else if (node.type === "TEXT"){
    name = "Label"
    dict["fix"] = true
  }
  console.log("anme"+name)
  if (name in components){
    dict["name"] = name
    dict["property"] = new Array()

    comComps.forEach(element => {
        let key = element[0]
        let value = node.getPluginData(key)
        let cn = element[1]
        let type = element[2]
        dict["property"].push([key, value, cn])
    })

    let comps = components[name]
    comps.property.forEach(element => {
        let key = element[0]
        let value = node.getPluginData(key)
        let cn = element[1]
        let type = element[2]
        dict["property"].push([key, value, cn])
    });
  }

  return dict
};

export const setProperty = (
  curNode : SceneNode,
  data : any
) => {
  data.forEach(element => {
    let key = element[0]
    let value = element[1]
    if (key === "name") {
      let oldName = curNode.getPluginData("name")
      if (oldName != "" && oldName != key) {
        Object.keys(properties).forEach(key => {
          curNode.setPluginData(properties[key][0], "")
        })
      }
    }
    curNode.setPluginData(key, value)
    if (key === "name") {
      // let split_name = currentSelection.name.split("|")
      // if (split_name.length > 1) {
      //   currentSelection.name = `${value}${value===""?"":"|"}${split_name.slice(1).join("|")}`
      // } else{
      //   currentSelection.name = `${value}${value===""?"":"|"}${currentSelection.name}`
      // }
      let idValue = curNode.getPluginData("id")
      if (value != "")
        curNode.name = `${value}${idValue===""?"":("-"+idValue)}`
      else
        curNode.name = curNode.type.charAt(0) + curNode.type.slice(1).toLowerCase()
    }
    if (key === "id") {
      // let split_name = currentSelection.name.split("|")
      // if (split_name.length > 1) {
      //   currentSelection.name = `${split_name[0].split("-")[0]}${value===""?"":"-"}${value}|${split_name.slice(1).join("|")}`
      // }
      let nameValue = curNode.getPluginData("name")
      if (nameValue != "")
        curNode.name = `${nameValue}-${value}`
      else
        curNode.name = curNode.type.charAt(0) + curNode.type.slice(1).toLowerCase()
    }
  });
}
