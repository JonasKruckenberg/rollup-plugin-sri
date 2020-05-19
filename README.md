# rollup-plugin-sri

> Because web security should not be difficult.
> This plugin adds [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) attributes to all resources imported by your html files.

## Installation

Use the Yarn package manager to install the plugin

```
yarn add -D rollup-plugin-sri
```

or npm

```
npm install --save-dev rollup-plugin-sri
```

## Usage

```javascript
import sri from 'rollup-plugin-sri'
export default {
  input: 'index.js',
  outupt: {
    file: 'out.js',
    format: 'es'
  },
  plugins: [sri()]
}
```

## Example

You might use a script tag to include a javascript file like this:

```html
<script src="mymmodule.js"></script>
```

Which then gets turned into this:

```html
<script
  src="mymodule.js"
  integrity="sha256-CF972E3D7A5D3AAD1599AE78F076652067AA30A7AC719F55A37A8DCD9F7901B1"
  crossorigin="anonymous"
></script>
```

## Contributing

I generally dont't think one has to change much, but if you're unhappy with something open an issue,
or create a pull request, it's greatly appreciated!

## License

[MIT](https://choosealicense.com/licenses/mit/)
