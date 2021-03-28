import { exmlShadow } from "./builderImpl/exmlShadow";
import {
  AltSceneNode,
  AltGeometryMixin,
  AltBlendMixin,
  AltFrameMixin,
  AltDefaultShapeMixin,
} from "../altNodes/altMixins";
import {
  exmlVisibility,
  exmlRotation,
  exmlAlpha,
} from "./builderImpl/exmlBlend";
import { exmlPosition } from "./builderImpl/exmlPosition";
import {
  exmlColor,
  exmlColorFromFills,
  exmlGradientFromFills,
} from "./builderImpl/exmlColor";
import { exmlPadding } from "./builderImpl/exmlPadding";
import { format } from "../common/parse";
import { parentCoordinates } from "../common/parentCoordinates";
import { exmlSize, exmlSizePartial } from "./builderImpl/exmlSize";
import { exmlBorderRadius } from "./builderImpl/exmlBorderRadius";
import { retrieveTopFill } from "../common/retrieveFill";
import { components, common as comComps, properties } from "./builderImpl/exmlComponent";
import { exmlProperty, getHead } from "./builderImpl/exmlCustom";

export class ExmlDefaultBuilder {
  style: string;
  visible: boolean;
  name: string = "";
  comp: {head : string, child : boolean, adaptive: boolean};
  hasFixedSize = false;
  constraintTypeH : ConstraintType;
  constraintTypeV : ConstraintType;
  constraintH : boolean = false;
  constraintV : boolean = false;
  adaptiveW : boolean = false;
  adaptiveH : boolean = false;
  inLayout : boolean = false;

  constructor(node: SceneNode) {
    this.style = "";
    this.visible = node.visible;
    this.comp = getHead(node)

    if ("constraints" in node) {
      this.constraintTypeH = node.constraints.horizontal
      if (this.constraintTypeH === "CENTER" || this.constraintTypeH === "MAX" || this.constraintTypeH === "MIN" || this.constraintTypeH === "STRETCH") {
        this.constraintH = true
        if (this.constraintTypeH === "STRETCH") {
          this.adaptiveW = true
        }
      }
      this.constraintTypeV = node.constraints.vertical
      if (this.constraintTypeV === "CENTER" || this.constraintTypeV === "MAX" || this.constraintTypeV === "MIN" || this.constraintTypeV === "STRETCH") {
        this.constraintV = true
        if (this.constraintTypeV === "STRETCH") {
          this.adaptiveH = true
        }
      }
    }

    if (this.comp.adaptive) {
      this.adaptiveW = true
      this.adaptiveH = true
    }

    if ("layoutMode" in node && node.layoutMode !== "NONE"){
      if (node.layoutMode === "HORIZONTAL"){
        if (node.primaryAxisSizingMode === "AUTO")
          this.adaptiveW = true
        if (node.counterAxisSizingMode === "AUTO")
          this.adaptiveH = true
      }

      if (node.layoutMode === "VERTICAL"){
        if (node.primaryAxisSizingMode === "AUTO")
          this.adaptiveH = true
        if (node.counterAxisSizingMode === "AUTO")
          this.adaptiveW = true
      }
    }

    if ("layoutMode" in node.parent && node.parent.layoutMode !== "NONE"){
      this.inLayout = true
    }
  }

  blend(node: SceneNode): this {
    this.style += exmlVisibility(node);
    // this.style += exmlRotation(node);
    this.style += exmlAlpha(node);
    this.style += exmlProperty(node)

    return this;
  }

  // border(node: GeometryMixin & SceneNode): this {
  //   // add border-radius: 10, for example.
  //   this.style += exmlBorderRadius(node, this.isJSX);

  //   console.log(
  //     "borderRadius is ",
  //     exmlBorderRadius(node, this.isJSX),
  //     " - for ",
  //     node.name,
  //     "and ",
  //     node.id,
  //     "which is",
  //     node.type,
  //     "and",
  //     node
  //   );

  //   // add border: 10px solid, for example.
  //   if (node.strokes && node.strokes.length > 0 && node.strokeWeight > 0) {
  //     const fill = this.retrieveFill(node.strokes);
  //     const weight = node.strokeWeight;

  //     if (fill.kind === "gradient") {
  //       this.style += format("border", this.isJSX, `${weight}px solid`);

  //       // Gradient requires these.
  //       this.style += format("border-image-slice", this.isJSX, 1);
  //       this.style += format(
  //         "border-image-source",
  //         this.isJSX,
  //         fill.prop
  //       );
  //     } else {
  //       const border = `${weight}px solid ${fill.prop}`;

  //       // use "2px solid white" instead of splitting into three properties.
  //       // This pattern seems more common than using border, borderColor and borderWidth.
  //       this.style += format("border", this.isJSX, border);
  //     }
  //   }

  //   return this;
  // }

  constraint(node: SceneNode): this {
    if ("width" in node.parent && "height" in node.parent && !this.inLayout){
      if (this.constraintH) {
        if (this.constraintTypeH === "CENTER") {
          this.style += format("horizontalCenter", node.x + node.width/2 - node.parent.width/2)
        } else if (this.constraintTypeH === "MAX") {
          this.style += format("right", node.parent.width - (node.x + node.width))
        } else if (this.constraintTypeH === "MIN") {
          this.style += format("left", node.x)
        } else if (this.constraintTypeH === "STRETCH") {
          this.style += format("left", node.x)
          this.style += format("right", node.parent.width - (node.x + node.width))
        }
      }

      if (this.constraintV) {
        if (this.constraintTypeV === "CENTER") {
          this.style += format("verticalCenter", node.y + node.height/2 - node.parent.height/2)
        } else if (this.constraintTypeV === "MAX") {
          this.style += format("bottom", node.parent.height - (node.y + node.height))
        } else if (this.constraintTypeV === "MIN") {
          this.style += format("top", node.y)
        } else if (this.constraintTypeV === "STRETCH") {
          this.style += format("top", node.y)
          this.style += format("bottom", node.parent.height - (node.y + node.height))
        }
      }
    }

    return this
  }

  position(node: SceneNode): this {
    // const position = exmlPosition(node, parentId);

    // if (position === "absoluteManualLayout" && node.parent) {
    //   // tailwind can't deal with absolute layouts.

    //   const [parentX, parentY] = parentCoordinates(node.parent);

    //   const left = node.x - parentX;
    //   const top = node.y - parentY;

    //   this.style += format("left", this.isJSX, left);
    //   this.style += format("top", this.isJSX, top);

    //   this.style += format("position", this.isJSX, "absolute");
    // } else {
    //   this.style += position;
    // }

    if (!this.inLayout){
      if (!this.constraintH){
        this.style += format("x", node.x)
      }

      if (!this.constraintV){
        if (node.type === "VECTOR")
          this.style += format("y", node.y - node.height)
        else
          this.style += format("y", node.y)
      }
    }

    return this;
  }

  rotation(node: SceneNode): this {
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
      this.style += format("rotation", node.rotation);
    }
    return this;
  }

  customColor(
    paintArray: ReadonlyArray<Paint> | PluginAPI["mixed"],
    property: string
  ): this {
    const fill = this.retrieveFill(paintArray);
    if (fill.kind === "solid") {
      this.style += format(property, fill.prop);
    } else if (fill.kind === "gradient") {
      //白鹭没有渐变
    }

    return this;
  }

  retrieveFill = (
    paintArray: ReadonlyArray<Paint> | PluginAPI["mixed"]
  ): { prop: string; kind: "solid" | "gradient" | "none" } => {
    // visible is true or undefinied (tests)
    if (this.visible !== false) {
      const gradient = exmlGradientFromFills(paintArray);
      if (gradient) {
        return { prop: gradient, kind: "gradient" };
      } else {
        const color = exmlColorFromFills(paintArray);
        if (color) {
          return { prop: color, kind: "solid" };
        }
      }
    }
    return { prop: "", kind: "none" };
  };

  stroke(node: GeometryMixin & SceneNode): this {
    if (node.strokes.length > 0 && node.strokeWeight > 0) {
      this.style += format("stroke", node.strokeWeight)
      let stroke = retrieveTopFill(node.strokes)
      if (stroke.type === "SOLID"){
        this.style += format("strokeColor", exmlColor(stroke.color))
      }
    }

    return this;
  }

  shadow(node: BlendMixin): this {
    const shadow = exmlShadow(node);
    if (shadow !== "") {
      this.style += shadow;
    }
    
    return this;
  }

  // must be called before Position, because of the hasFixedSize attribute.
  widthHeight(node: SceneNode): this {
    // if current element is relative (therefore, children are absolute)
    // or current element is one of the absoltue children and has a width or height > w/h-64
    // if ("isRelative" in node && node.isRelative === true) {
    //   this.style += exmlSize(node, this.isJSX);
    // } else {
    //   const partial = exmlSizePartial(node, this.isJSX);
    //   this.hasFixedSize = partial[0] !== "" && partial[1] !== "";

    //   this.style += partial.join("");
    // }

    if (!this.adaptiveW) {
      this.style += format("width", node.width)
    }

    if (!this.adaptiveH) {
      this.style += format("height", node.height)
    }

    return this;
  }

  // autoLayoutPadding(node: AltFrameMixin | AltDefaultShapeMixin): this {
  //   this.style += exmlPadding(node, this.isJSX);
  //   return this;
  // }

  removeTrailingSpace(): this {
    if (this.style.length > 0 && this.style.slice(-1) === " ") {
      this.style = this.style.slice(0, -1);
    }
    return this;
  }

  build(additionalStyle: string = ""): string {
    this.style += additionalStyle;
    this.removeTrailingSpace();

    if (this.style) {
      this.style = `${this.style}`;
    }
    
    return this.style;
  }
}
