import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer({ debug: true });

describe("Filters", () => {
	it("nl", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/filter-nl");

		view().should.equal("text<br>with<br>newlines");
	});
});
