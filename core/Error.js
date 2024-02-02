export class Error {
	#description = "";
	#parameters  = {};

	constructor(description, parameters = {}) {
		this.#description = description;
		this.#parameters  = parameters;
	}

	toString() {
		return `<error${Object.keys(this.#parameters).map(k => ` ${k}="${this.#parameters[k]}"`)}>${this.#description}</error>`;
	}
}
