// convert \n to <br>
export const nl = (text) => {
	return text.replaceAll("\n", "<br>");
};

// quote html special characters
export const quote = (html) => {
	return String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
};

// print indented JSON
export const json = (json) => {
	return `<pre>${JSON.stringify(json, null, 4)}</pre>`;
};
