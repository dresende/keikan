// eslint-disable-next-line no-unused-vars
import should                from "should";
import { Filters, Renderer } from "../index.js";

const keikan = new Renderer({ debug: true });

describe("Filters", () => {
	it("are exposed in Renderer", async () => {
		Filters.nl.should.be.of.type("function");
		Filters.quote.should.be.of.type("function");
	});

	it("nl", async () => {
		const view = await keikan.compileData("<%-: \"text\\nwith\\nnewlines\" | nl %>");

		view().should.equal("text<br>with<br>newlines");
	});

	it("quote", async () => {
		const view = await keikan.compileData("<%-: \"<b>bold</b>\" | quote %>");

		view().should.equal("&lt;b&gt;bold&lt;/b&gt;");
	});

	it("json", async () => {
		const view = await keikan.compileData("<%-: { x: 2 } | json %>");

		view().should.equal(JSON.stringify({ x: 2 }, null, 8));
	});
});
