// eslint-disable-next-line no-unused-vars
import { resolve }  from "path";
import should       from "should";
import { Renderer } from "../index.js";

const keikan = new Renderer({ debug: true });

describe("Features", () => {
	it("<% include %> can be used to load another view", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view({ name: "world" }).should.equal("<h3>\n\tHello world\n</h3>");
	});

	it("<% include %> can have another default extension", async () => {
		const keikan = new Renderer({ extension: "ejs" });
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view().should.equal("<h3>Hello world</h3>");
	});

	it("<% include %> can be called with no arguments", async () => {
		const view1 = await keikan.compileData("<% include test/views/label() %>");
		const view2 = await keikan.compileData("<% include test/views/label() %>", { debug: false });

		view1().should.equal("Hello undefined");
		view2().should.equal("Hello undefined");
	});

	it("<% include %> will return an <error/> if not found", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-notfound-include");

		view().should.equal("<h3>\n\t<error>Include notfound error: ENOENT</error>\n</h3>");
	});

	it("<% include %> will return an <error/> if an error occurs inside include", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-bad-include");

		view().should.equal("<h3>\n\tReferenceError: bad is not defined\n</h3>");
	});

	it("<% include %> used in compileData will use process cwd", async () => {
		const view = await keikan.compileData("<% include label() %>");

		view().should.equal("<error>Include label error: ENOENT</error>");
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

	it("keeps empty lines", async () => {
		const keikan = new Renderer({ debug: true, empty_lines: true });
		const view   = await keikan.compileData("<b>this is\n\nan example</b>");

		view().should.equal("<b>this is\n\nan example</b>");
	});

	it("handles more complex views", async () => {
		const view = await keikan.compilePath(import.meta.dirname + "/views/complex");

		view().should.equal("<ul>\n\t<li>(odd) 1. 1 bar</li>\n\t<li>(even) 2. 2 foo</li>\n\t<li>(odd) 3. 3 bar</li>\n</ul>");
	});

	it("supports custom resolver", async () => {
		const keikan = new Renderer({
			debug    : false,
			resolver : (path, base = null) => {
				return resolve(base, path + ".html");
			},
		});
		const view = await keikan.compilePath(import.meta.dirname + "/views/has-include");

		view({ name: "world" }).should.equal("<h3> \nHello world \n</h3>");
	});
});
