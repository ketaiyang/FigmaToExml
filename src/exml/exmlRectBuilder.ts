import { ExmlDefaultBuilder } from "./exmlDefaultBuilder";
import { retrieveTopFill } from "../common/retrieveFill";
import { format } from "../common/parse";
import { exmlColor } from "./builderImpl/exmlColor";

export class ExmlRectBuilder extends ExmlDefaultBuilder {
  constructor(node: RectangleNode) {
    super(node);
  }

  rectAlpha(node: RectangleNode): this {
    let fill = retrieveTopFill(node.fills)
    if (fill){
      this.style += format("fillAlpha", node.opacity)
    }

    return this
  }

  rectStroke(node: RectangleNode): this {
    if (node.strokes.length > 0 && node.strokeWeight > 0) {
      this.style += format("strokeWeight", node.strokeWeight)
      let stroke = retrieveTopFill(node.strokes)
      if (stroke.type === "SOLID"){
        this.style += format("strokeColor", exmlColor(stroke.color))
        this.style += format("strokeAlpha", stroke.opacity)
      }
    }

    return this
  }

  rectEllipse(node: RectangleNode): this {
    if (node.cornerRadius === figma.mixed) {
      this.style += format("ellipseWidth", Math.max(node.topLeftRadius, node.topRightRadius, node.bottomLeftRadius, node.bottomRightRadius))
    } else {
      this.style += format("ellipseWidth", node.cornerRadius)
    }

    return this
  }
}
