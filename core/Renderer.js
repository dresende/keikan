import { readFile }       from "node:fs/promises";
import { Resolver }       from "./Resolver.js";
import { RenderingError } from "./RenderingError.js";
import { Filters }        from "./Filters.js";
import { dirname }        from "path";

const START_BLOCK = "<%";
const END_BLOCK   = "%>";

export class Renderer {
	#resolver    = null;
	#debug       = false;
	#empty_lines = false;

	constructor(options = {}) {
		this.#resolver    = options.resolver ?? Resolver("extension" in options ? options.extension : "html");
		this.#debug       = (options.debug === true);
		this.#empty_lines = (options.empty_lines === true);
	}

	async compilePath(path, ...args) {
		let options = {};
		let base    = ""; // empty means default (process.cwd), if null is passed it means no base
		let level   = 0;

		for (const arg of args) {
			switch (typeof arg) {
				case "string":
					base = arg;
					break;
				case "number":
					level = arg;
					break;
				default:
					if (arg === null && !base.length) {
						base = arg;
					} else if (Object.keys(arg).length) {
						options = arg;
					}
			}
		}

		if (base !== null && !base.length) {
			base = process.cwd();
		}

		const filename = await this.#resolver(path, base);
		const data     = (filename == "empty://" ? "" : await readFile(filename));

		options.filename = filename;

		if (!("debug" in options)) {
			options.debug = this.#debug;
		}

		if (!("empty_lines" in options)) {
			options.empty_lines = this.#empty_lines;
		}

		return await this.compileData(data, options, level);
	}

	async compileData(data, options = {}, level = 0) {
		const indent = (n = 1) => {
			if (!options.debug) return "";

			return "\t".repeat(level + n);
		};

		const text_level = level;
		const lines      = this.#dataToLines(data);
		let code         = "";

		if (options.debug && options.filename) {
			code += `${indent(0)}// ${options.filename}\n`;
		}

		code += `${indent(0)}let __output = "";\n`;
		code += `${indent(0)}try { with (this) {\n`;

		for (const line of lines) {
			switch (line[0]) {
				case "text":
					if (!options.debug) {
						line[1] = line[1].toString().replace(/\n\s+/mg, "\n");
					}
					code += `${indent()}__output += "${escape(line[1], text_level)}";\n`;
					break;
				case "code": {
					// comment
					if (line[1][0] == "#") {
						break;
					}

					// quoted data
					if (line[1][0] == "=") {
						code += `${indent()}__output += __filters.quote(${line[1].substr(1).trim()});\n`;
						break;
					}

					// unquoted data
					if (line[1][0] == "-") {
						if (line[1][1] == ":") {
							// unquoted data with filters
							const line_code = line[1].substr(2).trim();
							const p         = line_code.lastIndexOf("|");
							const filters   = line_code.substr(p + 1).split(/\s*\|\s*/).map(name => name.trim()).filter(name => name.length);

							code += `${indent()}__output += ${filters.reduce((code_line, name) => (`__filters.${name}(${code_line})`), line_code.substr(0, p).trim())};\n`;
						} else {
							// unquoted data, no filters
							code += `${indent()}__output += ${line[1].substr(1).trim()};\n`;
						}
						break;
					}

					const command_code = await this.#checkCommands(line[1], options, indent, text_level);

					if (command_code !== false) {
						code += command_code;
						continue;
					}

					const level_diff = this.#levelChange(line[1], options.debug);

					if (level_diff < 0) {
						level += level_diff;
					}

					code += `${indent()}${line[1]}\n`;

					if (level_diff > 0) {
						level += level_diff;
					}
				}
			}
		}

		code += `${indent(0)}} } catch (err) { __output += err; }\n`;
		code += `${indent(0)}return __output;\n`;

		const funct = new Function("__filters", code);

		const ret = (env) => {
			if (options.debug) {
				if (options.empty_lines) {
					return funct.call(env, Filters).trim();
				}
				return funct.call(env, Filters).replace(/\n\s*\n/g, "\n").trim();
			}
			return funct.call(env, Filters).replace(/\n\s*\n/g, "\n").replace(/\x3e\n/g, ">").trim();
		};

		ret.code = code;

		return ret;
	}

	async #checkCommands(line, options, indent, text_level) {
		const match = line.match(/^(?<command>\w+)\s+(?<method>[^\(]+)(\((?<parameters>.*)\))?$/);

		if (!match) return false;

		const command = match.groups.command;

		if ([ "var", "let", "const", "function", "if", "else", "switch", "case", "for" ].includes(command)) return false;

		let code = "";

		switch (command) {
			case "include": {
				try {
					const view = await this.compilePath(match.groups.method, options, options.filename ? dirname(options.filename) : null, options.debug ? text_level + 2 : text_level);

					if (options.debug) {
						code += `\n${indent()}// include ${match.groups.method}\n`;
					}

					code += `${indent()}__output += ((self) => {\n`;
					code += view.code;
					code += `${indent()}})(${match.groups.parameters?.length ? match.groups.parameters : "{}"});\n\n`;
				} catch (err) {
					code += `${indent()}__output += "${escape(new RenderingError(`Include ${match.groups.method} error: ${err.code || err.message}`))}";\n`;
				}
				break;
			}
			default:
				code += `${indent()}${line};\n`;
		}

		return code;
	}

	#dataToLines(data) {
		const lines = [];
		let i       = 0;

		while (i < data.length) {
			let j = data.indexOf(START_BLOCK, i);

			if (j == -1) {
				lines.push([ "text", data.slice(i, data.length).toString() ]);
				break;
			}

			lines.push([ "text", data.slice(i, j).toString() ]);

			i = j + START_BLOCK.length;

			j = data.indexOf(END_BLOCK, i);

			if (j == -1) {
				lines.push([ "text", new RenderingError("Invalid block") ]);
				break;
			}

			lines.push([ "code", data.slice(i, j).toString().trim() ]);

			i = j + END_BLOCK.length;
		}

		return lines;
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
