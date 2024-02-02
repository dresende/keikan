import { dirname, resolve } from "path";

export function Resolver(path, base = null) {
	if (!path.endsWith(".html")) {
		path += ".html";
	}

	if (base) {
		return resolve(dirname(base), path);
	}

	return resolve(path);
}
