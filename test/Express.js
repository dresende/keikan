// eslint-disable-next-line no-unused-vars
import should      from "should";
import * as Keikan from "../index.js";
import http        from "http";
import express     from "express";
import { resolve } from "path";

describe("Express", () => {
	it("should expose a renderPath to render files to express", async () => {
		const app    = express();
		const server = http.createServer(app);

		app.engine("html", Keikan.renderPath);
		app.set("view engine", "html");
		app.set("views", resolve(import.meta.dirname, "views"));

		app.get("/", (req, res) => {
			res.render("simple", { name: "Diogo" });
		});

		await server.listen(0);

		const response = await request(`http://localhost:${server.address().port}/`);

		response.should.equal("<h3>Hello Diogo</h3>");

		await server.close();
	});
});

const request = async (url) => {
	return new Promise((resolve, reject) => {
		const req = http.request(url, (res) => {
			let buf = "";

			res.on("data", (data) => {
				buf += data;
			});

			res.on("end", () => {
				return resolve(buf);
			});
		});

		req.on("error", reject);

		req.end();
	});
};
