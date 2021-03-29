import {
	gradientAngle
} from "../../common/color";
import {
	retrieveTopFill
} from "../../common/retrieveFill";
import {
	rgbTo6hex
} from "../../common/color";

export const exmlColorFromFills = (
	fills: ReadonlyArray < Paint > | PluginAPI["mixed"]
): string => {
	// kind can be text, bg, border...
	// [when testing] fills can be undefined

	const fill = retrieveTopFill(fills);
	if (fill.type === "SOLID") {
		// if fill isn't visible, it shouldn't be painted.
		return exmlColor(fill.color, fill.opacity);
	}

	return "";
};

export const exmlColor = (color: RGB, alpha: number = 1): string => {
	const hex = rgbTo6hex(color)

	return `0x${hex}`
};

export const exmlGradientFromFills = (
	fills: ReadonlyArray < Paint > | PluginAPI["mixed"]
): string => {
	const fill = retrieveTopFill(fills);
	if (fill.type === "GRADIENT_LINEAR") {
		return exmlGradient(fill);
	}
	return "";
};

// This was separated from exmlGradient because it is going to be used in the plugin UI and it wants all gradients, not only the top one.
export const exmlGradient = (fill: GradientPaint): string => {
	// add 90 to be correct in HTML.
	const angle = (gradientAngle(fill) + 90).toFixed(0);

	const mappedFill = fill.gradientStops
		.map((d) => {
			// only add position to fractional
			const position =
				d.position > 0 && d.position < 1 ?
				" " + (100 * d.position).toFixed(0) + "%" :
				"";

			return `${exmlColor(d.color, d.color.a)}${position}`;
		})
		.join(", ");

	return `linear-gradient(${angle}deg, ${mappedFill})`;
};
