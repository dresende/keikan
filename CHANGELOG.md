## 0.4.4 - 18 Sep 2024

- renderer:
  - fixes using more than one filter for good (hope so)
- ci:
  - filters: adds more complex test to validate multiple filters

## 0.4.3 - 18 Sep 2024

- renderer:
  - fixes using more than one filter
- ci:
  - adds test using 2 filters at once
- deps:
  - [express@4.21.0](https://www.npmjs.com/package/express)

## 0.4.2 - 22 Aug 2024

- renderer:
  - ensure we do not clear necessary whitespace with a new line

## 0.4.1 - 16 Aug 2024

- filters:
  - fixes querystring
- renderer:
  - fixes default options not being used in compileData
- ci:
  - fixes empty lines test
  - fixes features eslint disable flag
  - updates coverage

## 0.4.0 - 16 Aug 2024

- renderer:
  - adds one space to avoid removing all spaces between tags and screwing the layout
  - improves list of reserved words to ignore

## 0.3.0 - 31 Jul 2024

- core:
  - renderer: adds support for <% include view(data, param2,. ... ) %>

## 0.2.3 - 31 Jul 2024

- core:
  - renderer: removes unknown command error and passes code directly to code

## 0.2.2 - 31 Jul 2024

- core:
  - resolver: fixes not adding an extension if there's one already
  - renderer: adds empty_lines option to avoid removing them from output

## 0.2.1 - 31 Jul 2024

- core:
  - resolver: adds support for null extension

## 0.2.0 - 31 Jul 2024

- core:
  - filters: adds query string encoding filter
  - filters: fixes json encoding wrongly adding html code
  - refactors code to try and reduce complexity in functions
  - adds options to compilePath
  - adds support for custom extension (defaults to html)
  - adds support for empty:// filename
  - adds try/catch to includes to avoid throwing in the middle
  - changes how filters are exposed to allow for expansion
  - removes try/catch from renderer so users can catch errors
  - fixes filters not supporting | inside code
  - fixes support for variable declarations and control structures
- ci:
  - adds code climate badge to readme
- deps:
  - mocha@10.4.0
  - eslint-parser@7.24.5
  - express@4.19.2

## 0.1.1 - 5 Feb 2024

- Adds Express support

## 0.1.0 - Initial version

Usable initial version, not yet ready to include automatically in Express.
