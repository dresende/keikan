import { Renderer } from "./core/Renderer.js";

export { Renderer } from "./core/Renderer.js";
export * as Filters from "./core/Filters.js";

export const renderPath = async (filename, options, next) => {
	// express checks file before passing to renderer, so view
	// will never be null except there's an actual bug
	const renderer = new Renderer();
	const view     = await renderer.compilePath(filename);

	return next(null, view(options));
};
