import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer();

describe("Renderer", () => {
	it("exposes a compileData method", () => {
		keikan.compileData.should.be.of.type("function");
	});

	it("compileData returns a Promise", () => {
		const view = keikan.compileData("hello world");

		view.should.be.instanceOf(Promise);
	});

	it("exposes a compilePath method", () => {
		keikan.compilePath.should.be.of.type("function");
	});

	it("compilePath returns a Promise", () => {
		const view = keikan.compilePath("views/simple");

		view.should.be.instanceOf(Promise);
	});

	it("compilePath returns null if file is not found", async () => {
		const view = await keikan.compilePath("notfound");

		should(view).be.null();
	});

	it("compilePath returns a view that can then be renderer", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/simple");

		view({ name: "world" }).should.equal("<h3>Hello world</h3>");
	});
});

describe("Features", () => {
	it("<% include %> can be used to load another view", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/complex");

		view({ name: "world" }).should.equal("<h3>Hello world\n</h3>");
	});
});
