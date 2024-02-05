import { Renderer } from "../index.js"
import should       from "should"

const keikan = new Renderer({ debug: true });

describe("Features", () => {
	it("<% include %> can be used to load another view", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view({ name: "world" }).should.equal("<h3>\n\tHello world\n</h3>");
	});

	it("<% include %> will return an <error/> if not found", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-bad-include");

		view().should.equal("<h3>\n\t<error>Include not found: notfound</error>\n</h3>");
	});

	it("<% include %> used in compileData will use process cwd", async () => {
		const view = await keikan.compileData("<% include label() %>");

		view().should.equal("<error>Include not found: label</error>");
	});

	it("<%= %>, <%- %> and <%# %>", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/escaping");

		view().should.equal("<ul>\n\t<li>This is a &quot;quoted&quot; string</li>\n\t<li>This is not a \"quoted\" string</li>\n\t<li></li>\n</ul>");
	});

	it("supports code like conditions, loops, ..", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/condition");

		view({ condition: true }).should.equal("<h3>\n\tHello\n</h3>");
		view({ condition: false }).should.equal("<h3>\n</h3>");
	});

	it("removes unnecessary whitespace", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/long");

		view().should.equal("<h3>\n\t<strong>\n\t\tHello\n\t</strong>\n</h3>");
	});

	it("handles more complex views", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/complex");

		view().should.equal("<ul>\n\t<li>(odd) 1. 1</li>\n\t<li>(even) 2. 2</li>\n\t<li>(odd) 3. 3</li>\n</ul>");
	});
});
