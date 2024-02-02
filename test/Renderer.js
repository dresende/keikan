import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer();

describe("Renderer", () => {
	it("exposes a compileData method", () => {
		keikan.compileData.should.be.of.type("function");
	});

	it("compileData returns a Promise", () => {
		const p = keikan.compileData("hello world");

		p.should.be.instanceOf(Promise);
	});

	it("exposes a compilePath method", () => {
		keikan.compilePath.should.be.of.type("function");
	});
});
