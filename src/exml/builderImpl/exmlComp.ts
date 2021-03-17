// export const parse = (
//     node: SceneNode,
// ) => {
//     let name = node.getPluginData("name")
//     console.log(node.name+name)
// };

// let properties = {
//     id: ["id","string"],
//     skinname:["skinName", "string"],
// };
export const component =["btn","fp"];
export const components = {
    //Button
    "btn" : {
        "property" : [
            "id",
            "skinName"
        ],
        "name" : "e:Button"
    },
    //FirstPanel
    "fp" : {
        "property" : [
            "id",
            "skinName"
        ],
        "name" : "e:FirstPanel"
    },
    //SecondPanel
    "sp" : {
        "property" : [
            "id",
            "skinName"
        ],
        "name" : "e:SecondPanel"
    },
    //Group
    "grp" : {
        "property" : [
            "id",
        ],
        "name" : "e:Group"
    },
    //Scroller
    "src" : {
        "property" : [
            "id",
        ],
        "name" : "e:Scroller"
    },
    //List
    "lst" : {
        "property" : [
            "id",
        ],
        "name" : "e:List"
    },
    //Image
    "img" : {
        "property" : [
            "id",
            "source",
        ],
        "name" : "e:Image"
    },
    //Rect
    "rect" : {
        "property" : [
            "id",
            "fillAlpha",
        ],
        "name" : "e:Rect"
    },
};