import { resolve } from "path";

export function Resolver(extension) {
	return (path, base = null) => {
		if (!path.endsWith(`.${extension}`)) {
			path += `.${extension}`;
		}

		if (base) {
			return resolve(base, path);
		}

		return resolve(path);
	};
}
