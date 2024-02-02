## Keikan (景観)

This is a node.js template module. It's based on EJS, written in ES6 with
simplicity in mind.

### Install

```sh
npm i keikan
```

### Usage

```js
import { Renderer } from "keikan"

const keikan = new Renderer({ debug : false });
const view   = await keikan.compile("examples/readme"); // check examples folder

console.log(view({ name: "Diogo" }));
```

The example will print:

```html
<h3>
	Hello
	<strong>Diogo</strong>
</h3>
```

If `debug` flag is disabled or not present, it would instead print:

```html
<h3>Hello
<strong>Diogo</strong></h3>
```

It will try to remove spaces where it know they're not needed.
