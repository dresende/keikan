// eslint-disable-next-line no-unused-vars
import should       from "should";
import { Renderer } from "../index.js";

const keikan = new Renderer();

describe("Renderer", () => {
	it("exposes a compileData method", () => {
		keikan.compileData.should.be.of.type("function");
	});

	it("compileData returns a Promise", () => {
		const view = keikan.compileData("hello world");

		view.should.be.instanceOf(Promise);
	});

	it("compileData handles code", async () => {
		const view = await keikan.compileData("<h3><% if (true) { %>hello world<% } %></h3>");

		view().should.be.equal("<h3>hello world</h3>");
	});

	it("exposes a compilePath method", () => {
		keikan.compilePath.should.be.of.type("function");
	});

	it("compilePath returns a Promise", () => {
		const view = keikan.compilePath("views/simple");

		view.should.be.instanceOf(Promise);
	});

	it("compilePath returns a view that can then be renderer", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/simple");

		view({ name: "world" }).should.equal("<h3>Hello world</h3>");
	});

	it("compilePath will use process cwd when base is explicitly passed as null", async () => {
		const view = await keikan.compilePath("test/views/simple", null);

		view({ name: "world" }).should.equal("<h3>Hello world</h3>");
	});
});
