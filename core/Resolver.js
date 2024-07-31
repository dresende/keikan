import { resolve } from "path";

export function Resolver(extension) {
	return (path, base = null) => {
		if (path == "empty://") {
			return path;
		}

		if (extension !== null && !path.includes(".") && !path.endsWith(`.${extension}`)) {
			path += `.${extension}`;
		}

		if (base) {
			return resolve(base, path);
		}

		return resolve(path);
	};
}
