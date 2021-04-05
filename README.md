# rollup-plugin-sri

> Because web security should not be difficult.
 
[![Codecov Coverage](https://img.shields.io/codecov/c/github/JonasKruckenberg/rollup-plugin-sri/master.svg?style=flat-square)](https://codecov.io/gh/JonasKruckenberg/rollup-plugin-sri/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
![npm](https://img.shields.io/npm/v/rollup-plugin-sri?style=flat-square)

This plugin adds [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) attributes to all resources imported by your html files.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Simple](#simple)
  - [External resources](#external-resources)
  - [Multiple hashing algorithms](#multiple-hashing-algorithms)
  - [Usage with Vite](#usage-with-vite)
- [Options](#options)
- [Contributing](#contributing)
- [License](#license)

## Install

via npm:
```
npm install --save-dev rollup-plugin-sri
```

or via yarn:
```
yarn add -D rollup-plugin-sri
```

## Usage

Just use this plugin together with another plugin that outputs an html file, like [@rollup/plugin-html](https://github.com/rollup/plugins/tree/master/packages/html). <br />
It will then generate `integrity` and `crossorigin` attributes for all script tags and all link rel="stylesheet" tags.

```js
import html from '@rollup/plugin-html' // or any other html-plugin
import sri from 'rollup-plugin-sri'

export default {
  input: 'index.js',
  output: {
    file: 'out.js',
    format: 'es'
  },
  plugins: [html(), sri()]
}
```

## Examples

### Simple

You might have a script tag in your html to include a javascript file like this:

```html
<script src="index.js"></script>
```

Which then gets turned into this:

```html
<script
  src="index.js"
  integrity="sha512-nbecVo2rGsF6Q3d4sK/sF4AmMv3eIxXpjk6Larv6iDUWeaRjjYL44RyK45vPO3Aav/ep6qTgbUAebC20uEGq8g== sha384-zFyvltviTuMi40r9uTjP6Cc/kdJy3hboH2SbOT2Q7UaXK8c4+DtTEAG16VM0H4tP"
  crossorigin="anonymous"
></script>
```

### External resources

Let's say you're using Bootstrap on your page, but it get dynamically injected so you can't set the integrity attribute yourself. <br />
The html will then look something like this:

```html
<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
/>
```

This plugin will turn it into the following:

```html
<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
  crossorigin="anonymous"
/>
```

### Multiple hashing algorithms

You can also specify any number of hashing algorithms to be used by the plugin as long as they are supported by your current version of nodejs.

```js
import html from '@rollup/plugin-html' // @rollup/plugin-html for example
import sri from 'rollup-plugin-sri'

export default {
  input: 'index.js',
  output: {
    file: 'out.js',
    format: 'es'
  },
  plugins: [
    html(),
    sri({
      algorithms: ['sha1', 'md5', 'sha512']
    })
  ]
}
```

This config will generate an output like this:

```html
<script
  src="index.js"
  integrity="sha1-uwq/zzhXJzUJKIrPcWeL6RkTC8I= md5-illu96GKKoep5d+RUptcBw== sha512-k2VO1XnXo7MN/pqEHWCJYyn4D2d5z0FSDRvIrz4WPmw4VTPNhnSMJRvAwz2Llaij45VU35+eO3eQjydVhGggLg=="
  crossorigin="anonymous"
></script>
```

> There are a few things to note though:
>
> 1. You can in theory use any hashing algorithm you want, however most browser only support the sha family of hashing algorithms like sha256, sha384 and sha512
> 2. Browser vendors are actively discouraged from using `md5` and `sha1` as they are not considered to be secure enough.
>    Most modern browser won't accept them at all.

### Usage with Vite

To use this plugin together with [vite](https://vitejs.dev) use the configuration below.

```js
import { defineConfig } from "vite"
import sri from "rollup-plugin-sri"

export default defineConfig({
  plugins: [
    {
      enforce: "post",
      ...sri({ publicPath: "/" })
    }
  ]
})
```

> NOTE: Becuase of the way vite works, this plugin only applies SRIs when building for production. To get the same experience in development mode, check out [vite-plugin-sri](https://github.com/small-tech/vite-plugin-sri)!

## Options

> For the most up-to-date version of the options see the autogenerated [docs](./docs/README.md).

### `Optional` active

Type: _boolean_ <br/>
**`default`** `true`

Can be used to disable the plugin, as subresource integrities might cause issues with hot module reloading.

---

### `Optional` algorithms

Type: _Array[*string* \| *sha256* \| *sha384* \| *sha512*]_ <br/>
**`default`** `["sha384"]`

A list of hashing algorithms to use when computing the integrity attribute.
The hashing algorithm has to be supported by the nodejs version you're running on and by the Browser you're targeting.
Browsers will ignore unknown hashing functions.
Standard hash functions as defined in the [subresource integrity specification](https://w3c.github.io/webappsec-subresource-integrity/#hash-functions) are: `sha256`, `sha384` and `sha512`.

> NOTE: While browser vendors are free to support more algorithms than those stated above,
> they generally do not accept `sha1` and `md5` hashes.

---

### `Optional` crossorigin

Type: _"anonymous" | "use-credentials"_ <br/>
**`default`** `"anonymous"`

Specifies the value for the crossorigin attribute.
This attribute has to be set to prevent cross-origin data leakage.
The default value `anonymous` should be okay for normal use.
see: [the W3C spec](https://www.w3.org/TR/SRI/#cross-origin-data-leakage) for details.

---

### `Optional` selectors

Type: _Array[string]_ <br/>
**`default`** ` ["script","link[rel=stylesheet]"]`

A list of strings you can provide that the plugin will use to match html tags with.
It will then try to compute an integrity attribute for the matched tag.
Currently it only matches script tags and link with rel=stylesheet as per specification.
see [the W3C spec](https://www.w3.org/TR/SRI/#elements) for more information.
The selector syntax is the same as jQuery's.


### `Optional` publicPath

Type: _string_
**`default`** `""`

Commonly assets will be prefixed with a public path, such as "/" or "/assets".
Setting this option to the public path allows plugin-sri to resolve those imports.

## Contributing

For bug reports or feature requests please create an issue on github.
When working on a feature contribution, please ensure the following things:

- Keep you code clear and readable.
- Write unit tests for your feature (run `yarn test`).
- Use the convetional-commits style when writing commit messages.
- Use appropriate commit types, When adding tests use `test:` when adding a feature use `feat:` etc.
- Split up the files you commit logically not by workday or something else, for example all test belonging to a new feature should be in their own commit and not bunched together with other changes or tests for other features.

## License

[MIT © Jonas Kruckenberg.](LICENSE)
