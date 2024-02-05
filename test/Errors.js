import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer();

describe("Errors", () => {
	it("should handle incomplete view", async () => {
		const view = await keikan.compileData("<h3>Hello <%= name");

		view().should.equal("<h3>Hello <error>Invalid block</error>");
	});

	it("should handle incomplete commands", async () => {
		const view = await keikan.compileData("<% unknown_command something %>");

		view().should.equal("<error>Unknown command: unknown_command</error>");
	});
});
