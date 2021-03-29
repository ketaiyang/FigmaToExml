import {
	ExmlTextBuilder
} from "./exmlTextBuilder";
import {
	ExmlRectBuilder
} from "./exmlRectBuilder";
import {
	ExmlDefaultBuilder as ExmlDefaultBuilder
} from "./exmlDefaultBuilder";
import {
	indentString
} from "../common/indentString";
import {
	components,
	common as comComps,
	properties
} from "./builderImpl/exmlComponent";
import {
	getCompType
} from "./builderImpl/exmlCustom"
import {
	exmlLayout
} from "./builderImpl/exmlLayout"

export const exmlMain = (
	node: FrameNode | GroupNode
): string => {

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

const exmlWidgetGenerator = (
	nodes: ReadonlyArray < SceneNode > = null
): string => {
	let comp = "";

	const visibleNode = nodes.filter((d) => d /*d.visible != false && !d.name.trimStart().startsWith("ignore")*/ )
	visibleNode.forEach((node, index) => {

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

const exmlText = (
	node: TextNode,
): string | [string, string] => {

	const builder = new ExmlTextBuilder(node)
		.blend(node)
		.textAutoSize(node)
		.textCharacters(node)
		.constraint(node)
		.position(node)
		.shadow(node)
		.textStroke(node)
		.fontSize(node)
		.fontStyle(node)
		.textAlign(node)
		.customColor(node.fills, "textColor")

	return `\n<${builder.comp.head}${builder.build()}/>`
};

const exmlEditableText = (
	node: TextNode,
): string | [string, string] => {

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
): string => {
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

export const exmlContainer = (
	node: SceneNode,
): string => {

	const builder = new ExmlDefaultBuilder(node)
		.blend(node)
		.constraint(node)
		.position(node)
		.widthHeight(node)

	if (builder.comp.head !== "") {
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

	console.log(`Miss Node, Name:${node.name}, Type:${node.type}`)
	return ""
};