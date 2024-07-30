export const Filters = {};

// convert \n to <br>
Filters.nl = (text) => {
	return text.replaceAll("\n", "<br>");
};

// quote html special characters
Filters.quote = (html) => {
	return String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
};

// print indented JSON
Filters.json = (json, indent = 8) => {
	return JSON.stringify(json, null, indent);
};

// print query string encoded object
Filters.qs = (obj, sep = "&", eq = "=") => {
	return require("querystring").stringify(obj, sep, eq);
};
