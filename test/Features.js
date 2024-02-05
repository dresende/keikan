import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer();

describe("Features", () => {
	it("<% include %> can be used to load another view", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view({ name: "world" }).should.equal("<h3>Hello world\n</h3>");
	});

	it("<%= %>, <%- %> and <%# %>", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/escaping");

		view().should.equal("<ul><li>This is a &quot;quoted&quot; string</li><li>This is not a \"quoted\" string</li><li></li></ul>");
	});
});
