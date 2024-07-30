import should       from "should";
import { Renderer } from "../index.js";

const keikan = new Renderer({ debug: true });

describe("Debug", () => {
	it("outputs compiler in a more or less readable way", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		should(view.code.includes("\t")).be.true;
	});

	it("outputs view keeping all whitespace and use include indent", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view({ name: "Diogo" }).should.equal("<h3>\n\tHello Diogo\n</h3>");
	});
});
