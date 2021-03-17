import { numToAutoFixed } from "../common/numToAutoFixed";
import { exmlTextSize as exmlTextSizeBox } from "./builderImpl/exmlTextSize";
import { AltTextNode } from "../altNodes/altMixins";
import { ExmlDefaultBuilder } from "./exmlDefaultBuilder";
import { commonLetterSpacing } from "../common/commonTextHeightSpacing";
import { format } from "../common/parse";
import { convertFontWeight } from "../common/convertFontWeight";

export class ExmlTextBuilder extends ExmlDefaultBuilder {
  constructor(node: TextNode) {
    super(node);
  }

  // must be called before Position method
  textAutoSize(node: TextNode): this {
    if (node.textAutoResize === "NONE") {
      // going to be used for position
      this.hasFixedSize = true;
    }

    this.style += exmlTextSizeBox(node);
    return this;
  }

  // todo fontFamily
  //  fontFamily(node: AltTextNode): this {
  //    return this;
  //  }

  /**
   * https://tailwindcss.com/docs/font-size/
   * example: text-md
   */
  fontSize(node: AltTextNode): this {
    // example: text-md
    if (node.fontSize !== figma.mixed) {
      const value = node.fontSize;
      this.style += format("size", value);
    }

    return this;
  }

  /**
   * https://tailwindcss.com/docs/font-style/
   * example: font-extrabold
   * example: italic
   */
  fontStyle(node: AltTextNode): this {
    if (node.fontName !== figma.mixed) {
      const lowercaseStyle = node.fontName.style.toLowerCase();

      if (lowercaseStyle.match("italic")) {
        this.style += format("font-style", this.isJSX, "italic");
      }

      if (lowercaseStyle.match("regular")) {
        // ignore the font-style when regular (default)
        return this;
      }

      const value = node.fontName.style
        .replace("italic", "")
        .replace(" ", "")
        .toLowerCase();

      const weight = convertFontWeight(value);

      if (weight !== null && weight !== "400") {
        this.style += format("font-weight", this.isJSX, weight);
      }
    }
    return this;
  }

  /**
   * https://tailwindcss.com/docs/letter-spacing/
   * example: tracking-widest
   */
  letterSpacing(node: AltTextNode): this {
    const letterSpacing = commonLetterSpacing(node);
    if (letterSpacing > 0) {
      this.style += format("letter-spacing", this.isJSX, letterSpacing);
    }

    return this;
  }

  /**
   * Since Figma is built on top of HTML + CSS, lineHeight properties are easy to map.
   */
  lineHeight(node: AltTextNode): this {
    if (node.lineHeight !== figma.mixed) {
      switch (node.lineHeight.unit) {
        case "AUTO":
          this.style += format("line-height", this.isJSX, "100%");
          break;
        case "PERCENT":
          this.style += format(
            "line-height",
            this.isJSX,
            `${numToAutoFixed(node.lineHeight.value)}%`
          );
          break;
        case "PIXELS":
          this.style += format(
            "line-height",
            this.isJSX,
            node.lineHeight.value
          );
          break;
      }
    }

    return this;
  }

  /**
   * https://tailwindcss.com/docs/text-align/
   * example: text-justify
   */
  textAlign(node: AltTextNode): this {
    // if alignHorizontal is LEFT, don't do anything because that is native

    // only undefined in testing
    if (node.textAlignHorizontal && node.textAlignHorizontal !== "LEFT") {
      // todo when node.textAutoResize === "WIDTH_AND_HEIGHT" and there is no \n in the text, this can be ignored.
      switch (node.textAlignHorizontal) {
        case "CENTER":
          this.style += format("text-align", this.isJSX, "center");
          break;
        case "RIGHT":
          this.style += format("text-align", this.isJSX, "right");
          break;
        case "JUSTIFIED":
          this.style += format("text-align", this.isJSX, "justify");
          break;
      }
    }

    return this;
  }

  /**
   * https://tailwindcss.com/docs/text-transform/
   * example: uppercase
   */
  textTransform(node: AltTextNode): this {
    if (node.textCase === "LOWER") {
      this.style += format("text-transform", this.isJSX, "lowercase");
    } else if (node.textCase === "TITLE") {
      this.style += format("text-transform", this.isJSX, "capitalize");
    } else if (node.textCase === "UPPER") {
      this.style += format("text-transform", this.isJSX, "uppercase");
    } else if (node.textCase === "ORIGINAL") {
      // default, ignore
    }

    return this;
  }

  /**
   * https://tailwindcss.com/docs/text-decoration/
   * example: underline
   */
  textDecoration(node: AltTextNode): this {
    if (node.textDecoration === "UNDERLINE") {
      this.style += format("text-decoration", this.isJSX, "underline");
    } else if (node.textDecoration === "STRIKETHROUGH") {
      this.style += format(
        "text-decoration",
        this.isJSX,
        "line-through"
      );
    }

    return this;
  }
}
