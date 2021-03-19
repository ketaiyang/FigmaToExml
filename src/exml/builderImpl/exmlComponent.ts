export const properties = {
    id : ["id", "ID"],
    skinname : ["skinName", "皮肤"],
    source : ["source", "资源名"],
    fillAlpha : ["fillAlpha", "透明度"],
}
//每个组件都有的属性
export const common = [properties.id];
export const components = {
    "Button" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "e:Button"
    },
    "Label" : {
        "property" : [
        ],
        "head" : "e:Label",
        "fix" : true
    },
    "Image" : {
        "property" : [
            properties.source,
        ],
        "head" : "e:Image",
        "fix" : true
    },
    "Group" : {
        "property" : [
        ],
        "head" : "e:Group",
        "child" : true
    },
    "Rect" : {
        "property" : [
            properties.fillAlpha,
        ],
        "head" : "e:Rect",
        "fix" : true
    },
    "Scroller" : {
        "property" : [
        ],
        "head" : "e:Scroller",
        "child" : true
    },
    "List" : {
        "property" : [
        ],
        "head" : "e:List",
    },
    "RadioButton" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "e:RadioButton"
    },
    "ProgressBar" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "e:ProgressBar"
    },
    "FirstPanel" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "e:FirstPanel",
        "child" : true
    },
    "SecondPanel" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "e:SecondPanel",
        "child" : true
    },
    "ConsumeWidget" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "euiex:ConsumeWidget"
    },
    "FightPowerWidget" : {
        "property" : [
            properties.skinname,
        ],
        "head" : "euiex:FightPowerWidget"
    },
    "ItemGrid" : {
        "property" : [
        ],
        "head" : "euiex:ItemGrid"
    },
    "ItemGrid80x" : {
        "property" : [
        ],
        "head" : "euiex:ItemGrid80x"
    },
    "RoleHead" : {
        "property" : [
        ],
        "head" : "euiex:RoleHead"
    }
};