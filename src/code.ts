// import { retrieveTailwindText } from "./tailwind/retrieveUI/retrieveTexts";
// import {
//   retrieveGenericLinearGradients,
//   retrieveGenericSolidUIColors,
// } from "./common/retrieveUI/retrieveColors";
// import { htmlMain } from "./html/htmlMain";
// import { swiftuiMain } from "./swiftui/swiftuiMain";
// import { tailwindMain } from "./tailwind/tailwindMain";
// import { flutterMain } from "./flutter/flutterMain";
import { convertIntoAltNodes } from "./altNodes/altConversion";
import { exmlMain, compParse, setProperty } from "./exml/exmlMain"

let parentId: string;
let isJsx = false;
let layerName = false;
let currentSelection: SceneNode;
// let material = true;

let mode: "exml" | "property";

figma.showUI(__html__, { width: 450, height: 550 });

const run = () => {
  // ignore when nothing was selected
  if (figma.currentPage.selection.length === 0 || figma.currentPage.selection.length > 1) {
    figma.ui.postMessage({
      type: "empty",
    });
    return;
  }

  // check [ignoreStackParent] description
  if (figma.currentPage.selection.length > 0) {
    parentId = figma.currentPage.selection[0].parent?.id ?? "";
  }

  let result = "";

  const convertedSelection = convertIntoAltNodes(
    figma.currentPage.selection,
    null
  );

  currentSelection = figma.currentPage.selection[0]
  console.log(currentSelection.type)
  // const nodes = currentSelection.findAll(node => node.visible != false)
  nodes = Array<SceneNode>()
  traverse(currentSelection)
  // for(const node of nodes){
  //   console.log(node.name)
  // }

  // @ts-ignore
  // if (mode === "flutter") {
  //   result = flutterMain(convertedSelection, parentId, material);
  // } else if (mode === "tailwind") {
  //   result = tailwindMain(convertedSelection, parentId, isJsx, layerName);
  // } else if (mode === "swiftui") {
  //   result = swiftuiMain(convertedSelection, parentId);
  // } else if (mode === "html") {
  //   result = htmlMain(convertedSelection, parentId, isJsx, layerName);
  // }
  if (mode == "exml"){
    if (currentSelection.type == "FRAME" || currentSelection.type == "GROUP"){
      result = exmlMain(convertedSelection, parentId, isJsx, layerName, currentSelection)

      figma.ui.postMessage({
        type: "result",
        data: result,
      });
    }
  }else if (mode == "property"){
    if (currentSelection.parent){
      console.log("11111111111111")
      figma.ui.postMessage({
        type: "result",
        data: compParse(currentSelection),
      });
    }
  }

//   console.log(result);


//   if (
//     mode === "tailwind" ||
//     mode === "flutter" ||
//     mode === "html" ||
//     mode === "swiftui"
//   ) {
//     figma.ui.postMessage({
//       type: "colors",
//       data: retrieveGenericSolidUIColors(convertedSelection, mode),
//     });

//     figma.ui.postMessage({
//       type: "gradients",
//       data: retrieveGenericLinearGradients(convertedSelection, mode),
//     });
//   }
//   if (mode === "tailwind") {
//     figma.ui.postMessage({
//       type: "text",
//       data: retrieveTailwindText(convertedSelection),
//     });
//   }
};

figma.on("selectionchange", () => {
  run();
});

// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = (msg) => {
  if (msg.type === "exml") 
  {
    mode = msg.type;
    run();
  } else if (msg.type === "property") {
    mode = msg.type;
    if (msg.data) {
      setProperty(currentSelection, msg.data)
    }
    run();
  } 
//   else if (msg.type === "jsx" && msg.data !== isJsx) {
//     isJsx = msg.data;
//     run();
//   } else if (msg.type === "layerName" && msg.data !== layerName) {
//     layerName = msg.data;
//     run();
//   } else if (msg.type === "material" && msg.data !== material) {
//     material = msg.data;
//     run();
//   }
};


let nodes = Array<SceneNode>()
function traverse(node){
  if (node.visible != false) {
    nodes.push(node)
    if ("children" in node) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }
}