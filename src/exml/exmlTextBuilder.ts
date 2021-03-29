import {
	numToAutoFixed
} from "../common/numToAutoFixed";
import {
	exmlTextSize as exmlTextSizeBox
} from "./builderImpl/exmlTextSize";
import {
	ExmlDefaultBuilder
} from "./exmlDefaultBuilder";
import {
	format
} from "../common/parse";
import {
	retrieveTopFill
} from "../common/retrieveFill";
import {
	exmlColor
} from "./builderImpl/exmlColor";

export class ExmlTextBuilder extends ExmlDefaultBuilder {
	constructor(node: TextNode) {
		super(node);
	}

	textAutoSize(node: TextNode): this {
		this.style += exmlTextSizeBox(node);

		return this;
	}

	// todo fontFamily
	//  fontFamily(node: AltTextNode): this {
	//    return this;
	//  }

	textCharacters(node: TextNode, property: string = ""): this {
		if (node.characters && node.characters !== "") {
			console.log(property)
			this.style += format(property === "" ? "text" : property, node.characters)
		}

		return this
	}

	textStroke(node: GeometryMixin & SceneNode): this {
		if (node.strokes.length > 0 && node.strokeWeight > 0) {
			this.style += format("stroke", node.strokeWeight)
			let stroke = retrieveTopFill(node.strokes)
			if (stroke.type === "SOLID") {
				this.style += format("strokeColor", exmlColor(stroke.color))
			}
		}

		return this;
	}

	fontSize(node: TextNode): this {
		if (node.fontSize !== figma.mixed) {
			const value = node.fontSize;
			this.style += format("size", value);
		}

		return this;
	}

	fontStyle(node: TextNode): this {
		if (node.fontName !== figma.mixed) {
			const lowercaseStyle = node.fontName.style.toLowerCase();

			if (lowercaseStyle.match("italic")) {
				this.style += format("italic", "true");
			}

			if (lowercaseStyle.match("bold")) {
				this.style += format("bold", "true");
			}
		}

		if (node.textDecoration === "UNDERLINE") {
			this.style += format("underline", "true")
		}

		return this;
	}

	textAlign(node: TextNode): this {
		if (node.textAlignHorizontal) {
			if (node.textAlignHorizontal === "CENTER") {
				this.style += format("textAlign", "center");
			} else if (node.textAlignHorizontal === "LEFT") {
				this.style += format("textAlign", "left");
			} else if (node.textAlignHorizontal === "RIGHT") {
				this.style += format("textAlign", "right");
			}
		}

		if (node.textAlignVertical) {
			if (node.textAlignVertical === "CENTER") {
				this.style += format("verticalAlign", "center");
			} else if (node.textAlignVertical === "TOP") {
				this.style += format("verticalAlign", "top");
			} else if (node.textAlignVertical === "BOTTOM") {
				this.style += format("verticalAlign", "bottom");
			}
		}

		return this;
	}
}
