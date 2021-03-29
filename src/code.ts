import { exmlMain } from "./exml/exmlMain"
import { compParse, setProperty } from "./exml/builderImpl/exmlCustom"

let currentSelection: SceneNode;

let mode: "exml" | "property";

figma.showUI(__html__, { width: 450, height: 550 });

const run = () => {
  // ignore when nothing was selected || figma.currentPage.selection[0].parent.type !== "PAGE"
  if (figma.currentPage.selection.length === 0 || figma.currentPage.selection.length > 1) {
    figma.ui.postMessage({
      type: "empty",
    });
    return;
  }

  currentSelection = figma.currentPage.selection[0]

  if (mode == "exml"){
    // currentSelection = retrieveTopFrame(currentSelection)
    if ((currentSelection.type == "FRAME" || currentSelection.type == "GROUP") && currentSelection.parent.type === "PAGE") {
      let result = exmlMain(currentSelection)

      figma.ui.postMessage({
        type: "result",
        data: result,
      });
    } else {
      figma.ui.postMessage({
        type: "empty",
      });
    }
  }else if (mode == "property"){
    // if (currentSelection.parent.type !== "PAGE"){
      figma.ui.postMessage({
        type: "result",
        data: compParse(currentSelection),
      });
    // } else{
    //   figma.ui.postMessage({
    //     type: "empty",
    //   });
    // }
  }
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


// let nodes = Array<SceneNode>()
// function traverse(node){
//   if (node.visible != false) {
//     nodes.push(node)
//     if ("children" in node) {
//       for (const child of node.children) {
//         traverse(child)
//       }
//     }
//   }
// }

const retrieveTopFrame = (node: SceneNode): SceneNode => {
  while (node.parent.type === "FRAME" || node.parent.type === "GROUP"){
    node = node.parent
  }
  return node
}