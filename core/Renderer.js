import { readFile }       from "node:fs/promises";
import { Resolver }       from "./Resolver.js";
import { RenderingError } from "./RenderingError.js";
import * as Filters       from "./Filters.js";
import { dirname }        from "path";

const START_BLOCK = "<%";
const END_BLOCK   = "%>";

export class Renderer {
	#resolver = null;
	#debug    = false;

	constructor(options = {}) {
		this.#resolver = options.resolver ?? Resolver;
		this.#debug    = (options.debug  === true);
	}

	async compilePath(path, base = process.argv[1], level = 0) {
		const filename = await this.#resolver(path, base);

		try {
			const data = await readFile(filename);

			return await this.compileData(data, { filename }, level);
		} catch (err) {
			return null;
		}
	}

	async compileData(data, options = {}, level = 0) {
		const debug  = ("debug" in options ? options.debug : this.#debug);
		const indent = (n = 1) => {
			if (!debug) return "";

			return "\t".repeat(level + n);
		};

		let i = 0, text_level = level, code = "", lines = [];

		if (debug && options.filename) {
			code += `${indent(0)}// ${options.filename}\n`;
		}

		code += `${indent(0)}let __output = "";\n`;
		code += `${indent(0)}try { with (this) {\n`;

		while (true) {
			let j = data.indexOf(START_BLOCK, i);

			if (j == -1) {
				lines.push({ text: data.slice(i, data.length).toString() });
				break;
			}

			lines.push({ text: data.slice(i, j).toString() });

			i = j + START_BLOCK.length;

			j = data.indexOf(END_BLOCK, i);

			if (j == -1) {
				lines.push({ text: new RenderingError("Invalid block") });
				break;
			}

			lines.push({ code: data.slice(i, j).toString().trim() });

			i = j + END_BLOCK.length;
		}

		for (const line of lines) {
			if ("text" in line) {
				if (!debug) {
					line.text = line.text.toString().replace(/\n\s+/mg, "\n");
				}
				code += `${indent()}__output += "${escape(line.text, text_level)}";\n`;
				continue;
			}

			if ("code" in line) {
				if (line.code[0] == "#") {
					// comment
					continue;
				}

				if (line.code[0] == "=") {
					// quoted data
					code += `${indent()}__output += __filters.quote(${line.code.substr(1).trim()});\n`;
					continue;
				}

				if (line.code[0] == "-") {
					if (line.code[1] == ":") {
						// unquoted data with filters
						const line_code = line.code.substr(2).trim();
						const p         = line_code.indexOf("|");
						const filters   = line_code.substr(p + 1).split(/\s*\|\s*/).map(name => name.trim()).filter(name => name.length);

						code += `${indent()}__output += ${filters.reduce((code_line, name) => (`__filters.${name}(${code_line})`), line_code.substr(0, p).trim())};\n`;
					} else {
						// unquoted data
						code += `${indent()}__output += ${line.code.substr(1).trim()};\n`;
					}
					continue;
				}

				const match = line.code.match(/^(?<command>\w+)\s+(?<method>[^\(]+)(\((?<parameters>.*)\))?$/);

				if (match) {
					const command = match.groups.command;

					switch (command) {
						case "include":
							const view = await this.compilePath(match.groups.method, options.filename ? dirname(options.filename) : null, debug ? text_level + 2 : text_level);

							if (view !== null) {
								if (debug) {
									code += `\n${indent()}// include ${match.groups.method}\n`;
								}

								code += `${indent()}__output += ((self) => {\n`;
								code += view.code;
								code += `${indent()}})(${match.groups.parameters?.length ? match.groups.parameters : "{}"});\n\n`;
							} else {
								code += `${indent()}__output += "${escape(new RenderingError(`Include not found: ${match.groups.method}`))}";\n`;
							}
							break;
						default:
							code += `${indent()}__output += "${escape(new RenderingError(`Unknown command: ${command}`))}";\n`;
					}
					continue;
				}

				const level_diff = this.#levelChange(line.code, debug);

				if (level_diff < 0) {
					level += level_diff;
				}

				code += `${indent()}${line.code}\n`;

				if (level_diff > 0) {
					level += level_diff;
				}
			}
		}

		code += `${indent(0)}} } catch (err) { __output += err; }\n`;
		code += `${indent(0)}return __output;\n`;

		const funct = new Function("__filters", code);

		const ret = (env) => {
			if (debug) {
				return funct.call(env, Filters).replace(/\n\s*\n/g, "\n").trim();
			}
			return funct.call(env, Filters).replace(/\n\s*\n/g, "\n").replace(/\x3e\n/g, ">").trim();
		};

		ret.code = code;

		return ret;
	}

	#levelChange(code, debug) {
		if (!debug) return 0;

		return (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length;
	}
}

function escape(js, l) {
	return String(js)
		.replace(/\\/g, "\\\\")
		.replace(/\"/g, "\\\"")
		.replace(/\n/g, `\\n${"\t".repeat(l)}`)
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t")
		.replace(/\\b/g, "\\b")
		.replace(/\f/g, "\\f");
}
