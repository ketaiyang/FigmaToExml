export function writeFile(fileName, content, callback) {
	doSave(content, fileName)
}

function doSave(value, name) {
	var blob;
	if (typeof window.Blob == "function") {
		blob = new Blob([value]);
	} else {
		var BlobBuilder = window.MSBlobBuilder;
		var bb = new BlobBuilder();
		bb.append(value);
		blob = bb.getBlob();
	}
	var URL = window.URL || window.webkitURL;
	var bloburl = URL.createObjectURL(blob);
	var anchor = document.createElement("a");
	if ('download' in anchor) {
		anchor.style.visibility = "hidden";
		anchor.href = bloburl;
		anchor.download = name;
		document.body.appendChild(anchor);
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("click", true, true);
		anchor.dispatchEvent(evt);
		document.body.removeChild(anchor);
	} else if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, name);
	} else {
		location.href = bloburl;
	}
}
