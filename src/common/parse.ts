import { numToAutoFixed } from "./numToAutoFixed";

export const format = (
  property: string,
  value: number | string
): string => {
  
  if (typeof value === "number") {
    return ` ${property}="${numToAutoFixed(value)}"`;
  } else {
    return ` ${property}="${value}"`;
  }
};
