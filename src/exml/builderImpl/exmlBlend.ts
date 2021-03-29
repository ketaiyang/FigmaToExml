import {
	numToAutoFixed
} from "../../common/numToAutoFixed";
import {
	format
} from "../../common/parse";

export const exmlAlpha = (node: SceneNode): string => {
	if ("opacity" in node && node.opacity !== undefined && node.opacity !== 1) {
		return format("alpha", numToAutoFixed(node.opacity))
	}
	return "";
};

export const exmlVisibility = (node: SceneNode): string => {
	if (node.visible !== undefined && !node.visible) {
		return format("visible", "false");
	}
	return "";
};

export const exmlRotation = (node: SceneNode): string => {
	if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
		return format("rotation", node.rotation);
	}
	return "";
};
