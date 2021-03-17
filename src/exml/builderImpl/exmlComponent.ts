export const parse = (
    node: SceneNode,
) : Array<[string, string]> => {

    let arr : Array<[string, string]>
    let name = node.getPluginData("name")
    console.log("name"+node.name+name)

    if (name in components){
        let comp = components[name]
        arr.push(["name", name])

        comp.property.forEach(key => {
            let value = node.getPluginData(key)
            arr.push([key, value])
        });
    }

    return arr
};

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
