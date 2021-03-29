export const properties = {
	class: ["class", "类名", "text"],
	id: ["id", "ID", "text"],
	skinname: ["skinName", "皮肤", "text"],
	source: ["source", "资源名", "text"],
	label: ["label", "标签", "text"],
	font: ["font", "位图字体", "text"],
	inputType: ["inputType", "输入类型", "text"],
	currentState: ["currentState", "当前状态", "text"]
}
//每个组件都有的属性
export const common = [properties.id];
export const components = {
	"Skin": {
		"property": [
			properties.class
		],
		"fix": true
	},
	"Button": {
		"property": [
			properties.label,
			properties.skinname,
		],
		"head": "e:Button",
		"adaptive": true
	},
	"RadioButton": {
		"property": [
			properties.label,
			properties.skinname,
		],
		"head": "e:RadioButton",
		"adaptive": true
	},
	"ToggleButton": {
		"property": [
			properties.label,
			properties.skinname,
		],
		"head": "e:ToggleButton",
		"adaptive": true
	},
	"Label": {
		"property": [],
		"head": "e:Label",
	},
	"EditableText": {
		"property": [
			properties.inputType
		],
		"head": "e:EditableText"
	},
	"BitmapLabel": {
		"property": [
			properties.font,
		],
		"head": "e:BitmapLabel",
	},
	"Image": {
		"property": [
			properties.source,
		],
		"head": "e:Image",
		"adaptive": true
	},
	"Group": {
		"property": [],
		"head": "e:Group",
		"child": true,
		"fix": true
	},
	"Rect": {
		"property": [],
		"head": "e:Rect",
	},
	"Scroller": {
		"property": [],
		"head": "e:Scroller",
		"child": true,
	},
	"List": {
		"property": [],
		"head": "e:List",
	},
	"ProgressBar": {
		"property": [
			properties.skinname,
		],
		"head": "e:ProgressBar",
		"adaptive": true
	},
	"CheckBox": {
		"property": [
			properties.label,
			properties.skinname,
		],
		"head": "e:CheckBox",
		"adaptive": true
	},
	"FirstPanel": {
		"property": [
			properties.skinname,
		],
		"head": "e:FirstPanel",
		"child": true,
		"adaptive": true
	},
	"SecondPanel": {
		"property": [
			properties.skinname,
		],
		"head": "e:SecondPanel",
		"child": true,
		"adaptive": true
	},
	"ConsumeWidget": {
		"property": [
			properties.skinname,
		],
		"head": "euiex:ConsumeWidget",
		"adaptive": true
	},
	"FightPowerWidget": {
		"property": [
			properties.skinname,
			properties.currentState
		],
		"head": "euiex:FightPowerWidget",
		"adaptive": true
	},
	"ItemGrid": {
		"property": [],
		"head": "euiex:ItemGrid",
		"adaptive": true
	},
	"ItemGrid80x": {
		"property": [],
		"head": "euiex:ItemGrid80x",
		"adaptive": true
	},
	"RoleHead": {
		"property": [],
		"head": "euiex:RoleHead",
		"adaptive": true
	}
};
