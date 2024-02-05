import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer({ debug: true });

describe("Filters", () => {
	it("nl", async () => {
		const view = await keikan.compileData("<%-: \"text\\nwith\\nnewlines\" | nl %>");

		view().should.equal("text<br>with<br>newlines");
	});

	it("quote", async () => {
		const view = await keikan.compileData("<%-: \"<b>bold</b>\" | quote %>");

		view().should.equal("&lt;b&gt;bold&lt;/b&gt;");
	});
});
