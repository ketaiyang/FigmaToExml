import { exmlColor } from "./exmlColor";
import { AltBlendMixin } from "../../altNodes/altMixins";
import { format } from "../../common/parse";

export const exmlShadow = (node: BlendMixin): string => {
  let property = ""
  // [when testing] node.effects can be undefined
  if (node.effects && node.effects.length > 0) {
    const dropShadow = node.effects.filter(
      (d): d is ShadowEffect =>
        (d.type === "DROP_SHADOW" || d.type === "INNER_SHADOW") &&
        d.visible !== false
    );
    // simple shadow from tailwind
    if (dropShadow.length > 0) {
      const shadow = dropShadow[0];
      const x = shadow.offset.x;
      const y = shadow.offset.y;
      const color = exmlColor(shadow.color, shadow.color.a);
      const blur = shadow.radius;
      const spread = shadow.spread ? `${shadow.spread}px ` : "";
      const inner = shadow.type === "INNER_SHADOW" ? " inset" : "";

      property += format("shadow", "true")
      property += format("shadowBlur", blur)
      property += format("shadowColor", color)
      property += format("shadowOffsetX", x)
      property += format("shadowOffsetY", y)
    }
  }
  return property;
};
