## Keikan (景観)

This is a node.js template module. It's based on EJS, written in ES6 with
simplicity in mind.

### Install

```sh
npm i keikan
```

### Usage

First, assume we have a file named `path/to/file.html` with the following contents:

```html
<h3>
	Hello
	<strong><%= name %></strong>
</h3>
```

Then, you could compile and render this file with the following code:

```js
import { Renderer } from "keikan"

const keikan = new Renderer({ debug : true });
const view   = await keikan.compilePath("path/to/file");

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
