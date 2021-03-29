import {
	components,
	common as comComps,
	properties
} from "./exmlComponent";
import {
	retrieveTopFill
} from "../../common/retrieveFill";
import {
	format
} from "../../common/parse";

//解析组件包含数据
export const compParse = (
	node: SceneNode,
): {} => {

	let dict = {}

	let name = node.getPluginData("name")

	let compType = getCompType(node, name)
	if (compType) {
		if (compType.length > 1) {
			if (name === undefined || name === "") {
				name = compType[0]
				setProperty(node, [
					["name", name]
				])
			}
			dict["option"] = compType
			dict["fix"] = true
		} else {
			name = compType[0]
			setProperty(node, [
				["name", name]
			])
			if (name !== "Group") {
				dict["fix"] = true
			}
		}
	}
	// else {
	//   if (compType === "group"){ 
	//     name = "Group"
	//   } else if (compType === "rect"){
	//     name = "Rect"
	//     dict["fix"] = true
	//   } else if (compType === "image"){
	//     name = "Image"
	//     dict["fix"] = true
	//   } else if (compType === "skin"){
	//     name = "Skin"
	//     dict["fix"] = true
	//   }
	// }

	if (name in components) {
		dict["name"] = name
		dict["property"] = new Array()

		if (name !== "Skin") {
			comComps.forEach(element => {
				let key = element[0]
				let value = node.getPluginData(key)
				let cn = element[1]
				let type = element[2]
				dict["property"].push([key, value, cn, type])
			})
		}

		let comps = components[name]
		comps.property.forEach(element => {
			let key = element[0]
			let value = node.getPluginData(key)
			let cn = element[1]
			let type = element[2]
			dict["property"].push([key, value, cn, type])
		});
	}

	return dict
};

//设置定制的数据
export const setProperty = (
	curNode: SceneNode,
	data: Array < [string, string] >
) => {
	data.forEach(element => {
		let key = element[0]
		let value = element[1]
		if (key === "name") {
			let oldName = curNode.getPluginData("name")
			if (oldName !== "" && oldName !== key) {
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
			if (value !== "")
				curNode.name = `${value}${idValue.trim()===""?"":("-"+idValue)}`
			else
				curNode.name = curNode.type.charAt(0) + curNode.type.slice(1).toLowerCase()
		}
		if (key === "id") {
			// let split_name = currentSelection.name.split("|")
			// if (split_name.length > 1) {
			//   currentSelection.name = `${split_name[0].split("-")[0]}${value===""?"":"-"}${value}|${split_name.slice(1).join("|")}`
			// }
			let nameValue = curNode.getPluginData("name")
			if (nameValue !== "")
				curNode.name = `${nameValue}${value.trim()===""?"":("-"+value)}`
			else
				curNode.name = curNode.type.charAt(0) + curNode.type.slice(1).toLowerCase()
		}
	});
}

/**
 * example: { head: "e:Group", child: true}
 */
export const getHead = (
	node: SceneNode
): {
	head: string,
	child: boolean,
	adaptive: boolean
} => {
	let name = node.getPluginData("name")
	let comp = undefined

	let compType = getCompType(node, name)
	if (compType) {
		if (compType.length > 1) {
			if (name === undefined || name === "") {
				comp = components[compType[0]]
			} else {
				comp = components[name]
			}
		} else {
			comp = components[compType[0]]
		}
	} else {
		comp = components[name]
	}

	// if (compType === "group"){ 
	//   comp = components.Group
	// } else if (compType === "rect"){
	//   comp = components.Rect
	// } else if (compType === "image"){
	//   comp = components.Image
	// } else if (compType === "label"){
	//   if (name === undefined || name === "") {
	//     comp = components.Label
	//   } else {
	//     comp = components[name]
	//   }
	// } else {
	//   comp = components[name]
	// }

	let head = comp ? comp.head : ""
	let child = comp ? (comp["child"] ? true : false) : false
	let adaptive = comp ? (comp["adaptive"] ? true : false) : false

	return {
		head: head,
		child: child,
		adaptive: adaptive
	}
}

/**
 * example: id="grp"
 */
export const exmlProperty = (node: SceneNode): string => {
	let property = ""
	let name = node.getPluginData("name")

	let compType = getCompType(node, name)
	if (compType) {
		if (compType.length > 1) {
			if (name === undefined || name === "") {
				name = compType[0]
			}
		} else {
			name = compType[0]
		}
	}

	// if (compType === "group"){ 
	//   name = "Group"
	// } else if (compType === "rect"){
	//   name = "Rect"
	// } else if (compType === "image"){
	//   name = "Image"
	// } else if (compType === "label"){
	//   name = "Label"
	// }

	if (name !== undefined && name !== "") {
		comComps.forEach(element => {
			let value = node.getPluginData(element[0])
			if (value !== undefined && value !== "")
				property += format(element[0], value)
		})

		let comp = components[name]
		if (comp) {
			comp.property.forEach(element => {
				let value = node.getPluginData(element[0])
				if (value !== undefined && value !== "")
					property += format(element[0], value)
			});
		}
	}

	return property
}

// 获取控件类型
export const getCompType = (node: SceneNode, name: string): string[] | undefined => {
	if (node.parent.type !== "FRAME" && node.parent.type !== "GROUP") {
		return ["Skin"]
	} else {
		if (node.type === "FRAME" || node.type === "GROUP") {
			if (name === undefined || name === "") {
				return ["Group"]
			}
		} else if (node.type === "RECTANGLE") {
			let fill = retrieveTopFill(node.fills)
			if (fill.type === "SOLID") {
				return ["Rect", "Image"]
			} else if (fill.type === "IMAGE") {
				return ["Image", "Button"]
			}
		} else if (node.type === "TEXT") {
			return ["Label", "EditableText"]
		}
	}

	return undefined
}
