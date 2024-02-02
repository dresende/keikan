import { Renderer } from "./index.js"

const renderer = new Renderer({ debug : true });
const view     = await renderer.compile("examples/readme");

console.log("------------------->8 CODE -----------------------");
console.log(view.code);
console.log("------------------->8 CODE -----------------------");

console.log("------------------->8 HTML -----------------------");
console.log(view({ name: "Diogo" }));
console.log("------------------->8 HTML -----------------------");
