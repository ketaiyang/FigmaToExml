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
  exmlOpacity,
} from "./builderImpl/exmlBlend";
import { exmlPosition } from "./builderImpl/exmlPosition";
import {
  exmlColorFromFills,
  exmlGradientFromFills,
} from "./builderImpl/exmlColor";
import { exmlPadding } from "./builderImpl/exmlPadding";
import { format } from "../common/parse";
import { parentCoordinates } from "../common/parentCoordinates";
import { exmlSize, exmlSizePartial } from "./builderImpl/exmlSize";
import { exmlBorderRadius } from "./builderImpl/exmlBorderRadius";

export class ExmlDefaultBuilder {
  style: string;
  isJSX: boolean;
  visible: boolean;
  name: string = "";
  hasFixedSize = false;

  constructor(node: SceneNode) {
    this.isJSX = optIsJSX;
    this.style = "";
    this.visible = node.visible;

    if (showLayerName) {
      this.name = node.name.replace(" ", "");
    }
  }

  blend(node: SceneNode): this {
    this.style += exmlVisibility(node, this.isJSX);
    this.style += exmlRotation(node);
    this.style += exmlOpacity(node, this.isJSX);

    return this;
  }

  border(node: AltGeometryMixin & AltSceneNode): this {
    // add border-radius: 10, for example.
    this.style += exmlBorderRadius(node, this.isJSX);

    console.log(
      "borderRadius is ",
      exmlBorderRadius(node, this.isJSX),
      " - for ",
      node.name,
      "and ",
      node.id,
      "which is",
      node.type,
      "and",
      node
    );

    // add border: 10px solid, for example.
    if (node.strokes && node.strokes.length > 0 && node.strokeWeight > 0) {
      const fill = this.retrieveFill(node.strokes);
      const weight = node.strokeWeight;

      if (fill.kind === "gradient") {
        this.style += format("border", this.isJSX, `${weight}px solid`);

        // Gradient requires these.
        this.style += format("border-image-slice", this.isJSX, 1);
        this.style += format(
          "border-image-source",
          this.isJSX,
          fill.prop
        );
      } else {
        const border = `${weight}px solid ${fill.prop}`;

        // use "2px solid white" instead of splitting into three properties.
        // This pattern seems more common than using border, borderColor and borderWidth.
        this.style += format("border", this.isJSX, border);
      }
    }

    return this;
  }

  position(node: AltSceneNode, parentId: string): this {
    const position = exmlPosition(node, parentId);

    if (position === "absoluteManualLayout" && node.parent) {
      // tailwind can't deal with absolute layouts.

      const [parentX, parentY] = parentCoordinates(node.parent);

      const left = node.x - parentX;
      const top = node.y - parentY;

      this.style += format("left", this.isJSX, left);
      this.style += format("top", this.isJSX, top);

      this.style += format("position", this.isJSX, "absolute");
    } else {
      this.style += position;
    }

    return this;
  }

  customColor(
    paintArray: ReadonlyArray<Paint> | PluginAPI["mixed"],
    property: "text" | "background-color"
  ): this {
    const fill = this.retrieveFill(paintArray);
    if (fill.kind === "solid") {
      // When text, solid must be outputted as 'color'.
      const prop = property === "text" ? "color" : property;

      this.style += format(prop, this.isJSX, fill.prop);
    } else if (fill.kind === "gradient") {
      if (property === "background-color") {
        this.style += format("background-image", this.isJSX, fill.prop);
      } else if (property === "text") {
        this.style += format("background", this.isJSX, fill.prop);

        this.style += format(
          "-webkit-background-clip",
          this.isJSX,
          "text"
        );

        this.style += format(
          "-webkit-text-fill-color",
          this.isJSX,
          "transparent"
        );
      }
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

  shadow(node: AltBlendMixin): this {
    const shadow = exmlShadow(node);
    if (shadow) {
      this.style += format("box-shadow", this.isJSX, exmlShadow(node));
    }
    return this;
  }

  // must be called before Position, because of the hasFixedSize attribute.
  widthHeight(node: AltSceneNode): this {
    // if current element is relative (therefore, children are absolute)
    // or current element is one of the absoltue children and has a width or height > w/h-64
    if ("isRelative" in node && node.isRelative === true) {
      this.style += exmlSize(node, this.isJSX);
    } else {
      const partial = exmlSizePartial(node, this.isJSX);
      this.hasFixedSize = partial[0] !== "" && partial[1] !== "";

      this.style += partial.join("");
    }
    return this;
  }

  autoLayoutPadding(node: AltFrameMixin | AltDefaultShapeMixin): this {
    this.style += exmlPadding(node, this.isJSX);
    return this;
  }

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
      if (this.isJSX) {
        this.style = ` style={{${this.style}}}`;
      } else {
        this.style = ` style="${this.style}"`;
      }
    }
    if (this.name.length > 0) {
      const classOrClassName = this.isJSX ? "className" : "class";
      return ` ${classOrClassName}="${this.name}"${this.style}`;
    } else {
      return this.style;
    }
  }
}
