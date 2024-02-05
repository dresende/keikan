import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer();

describe("Errors", () => {
	it("should handle incomplete view", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/incomplete");

		view().should.equal("<h3>Hello <error>Invalid block</error>");
	});
});
