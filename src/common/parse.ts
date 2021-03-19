import { numToAutoFixed } from "./numToAutoFixed";

export const format = (
  property: string,
  value: number | string
): string => {
  const jsx_property = property
    .split("-")
    .map((d, i) => (i > 0 ? d.charAt(0).toUpperCase() + d.slice(1) : d))
    .join("");

  if (typeof value === "number") {
    return ` ${property}="${numToAutoFixed(value)}"`;
  } else {
    return ` ${property}="${value}"`;
  }
};