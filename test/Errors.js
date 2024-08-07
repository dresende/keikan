// eslint-disable-next-line no-unused-vars
import should       from "should";
import { Renderer } from "../index.js";

const keikan = new Renderer();

describe("Errors", () => {
	it("should handle incomplete view", async () => {
		const view = await keikan.compileData("<h3>Hello <%= name");

		view().should.equal("<h3>Hello <error>Invalid block</error>");
	});
});
