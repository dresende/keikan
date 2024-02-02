import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { Renderer } from "./index.js"

const renderer = new Renderer({
	debug : true,
});
const view     = await renderer.compile("examples/test");


console.log("------------------->8 CODE -----------------------");
console.log(view.code);
console.log("------------------->8 CODE -----------------------");

console.log("------------------->8 VIEW -----------------------");
console.log(view({ variable: 1 }));
console.log("------------------->8 VIEW -----------------------");
