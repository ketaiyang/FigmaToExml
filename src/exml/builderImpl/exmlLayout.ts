import {
	indentString
} from "../../common/indentString";
import {
	format
} from "../../common/parse";

export const exmlLayout = (
	node: BaseFrameMixin
): string => {
	if (node.layoutMode !== "NONE") {
		let layout = "HorizontalLayout"
		let style = ""
		if (node.layoutMode === "HORIZONTAL") {
			layout = "HorizontalLayout"
			if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
				style += format("horizontalAlign", "center")
				if (node.children.length > 1) {
					let childWidth = 0
					node.children.forEach(child => {
						childWidth += child.width
					})
					let gap = (node.width - childWidth) / (node.children.length - 1)
					style += format("gap", gap)
				}
			} else {
				if (node.primaryAxisAlignItems === "MIN") {
					style += format("horizontalAlign", "left")
				} else if (node.primaryAxisAlignItems === "CENTER") {
					style += format("horizontalAlign", "center")
				} else if (node.primaryAxisAlignItems === "MAX") {
					style += format("horizontalAlign", "right")
				}
				style += format("gap", node.itemSpacing)
			}

			if (node.counterAxisAlignItems === "MIN") {
				style += format("verticalAlign", "top")
			} else if (node.counterAxisAlignItems === "CENTER") {
				style += format("verticalAlign", "middle")
			} else if (node.counterAxisAlignItems === "MAX") {
				style += format("verticalAlign", "bottom")
			}
		} else if (node.layoutMode === "VERTICAL") {
			layout = "VerticalLayout"
			if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
				style += format("verticalAlign", "center")
				if (node.children.length > 1) {
					let childHeight = 0
					node.children.forEach(child => {
						childHeight += child.height
					})
					let gap = (node.height - childHeight) / (node.children.length - 1)
					style += format("gap", gap)
				}
			} else {
				if (node.primaryAxisAlignItems === "MIN") {
					style += format("verticalAlign", "top")
				} else if (node.primaryAxisAlignItems === "CENTER") {
					style += format("verticalAlign", "middle")
				} else if (node.primaryAxisAlignItems === "MAX") {
					style += format("verticalAlign", "bottom")
				}
				style += format("gap", node.itemSpacing)
			}

			if (node.counterAxisAlignItems === "MIN") {
				style += format("horizontalAlign", "left")
			} else if (node.counterAxisAlignItems === "CENTER") {
				style += format("horizontalAlign", "center")
			} else if (node.counterAxisAlignItems === "MAX") {
				style += format("horizontalAlign", "right")
			}
		}

		if (node.paddingLeft > 0)
			style += format("paddingLeft", node.paddingLeft)
		if (node.paddingRight > 0)
			style += format("paddingRight", node.paddingRight)
		if (node.paddingTop > 0)
			style += format("paddingTop", node.paddingTop)
		if (node.paddingBottom > 0)
			style += format("paddingBottom", node.paddingBottom)

		return `\n<e:layout>\n${indentString(`<e:${layout}${style}/>`)}\n</e:layout>`
	}

	return ""
}
