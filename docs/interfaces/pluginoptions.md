[rollup-plugin-sri](../README.md) / PluginOptions

# Interface: PluginOptions

## Table of contents

### Properties

- [active](pluginoptions.md#active)
- [algorithms](pluginoptions.md#algorithms)
- [crossorigin](pluginoptions.md#crossorigin)
- [publicPath](pluginoptions.md#publicpath)
- [selectors](pluginoptions.md#selectors)

## Properties

### active

• `Optional` **active**: *boolean*

Can be used to disable the plugin, as subresource integrities might cause issues with hot module reloading.

**`default`** true

Defined in: [index.ts:40](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/3aefbed/index.ts#L40)

___

### algorithms

• `Optional` **algorithms**: *string*[] \| *sha256*[] \| *sha384*[] \| *sha512*[]

A list of hashing algorithms to use when computing the integrity attribute.
The hashing algorithm has to be supported by the nodejs version you're running on and by the Browser you're targeting.
Browsers will ignore unknown hashing functions.
Standard hash functions as defined in the [subresource integrity specification](https://w3c.github.io/webappsec-subresource-integrity/#hash-functions) are: `sha256`, `sha384` and `sha512`.

> NOTE: While browser vendors are free to support more algorithms than those stated above,
> they generally do not accept `sha1` and `md5` hashes.

**`default`** ["sha384"]

Defined in: [index.ts:26](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/3aefbed/index.ts#L26)

___

### crossorigin

• `Optional` **crossorigin**: *anonymous* \| *use-credentials*

Specifies the value for the crossorigin attribute.
This attribute has to be set on the generated html tags to prevent cross-origin data leakage.
The default value `anonymous` should be okay for normal use.
see: [the W3C spec](https://www.w3.org/TR/SRI/#cross-origin-data-leakage) for details.

**`default`** "anonymous"

Defined in: [index.ts:34](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/3aefbed/index.ts#L34)

___

### publicPath

• `Optional` **publicPath**: *string*

Commonly assets will be prefixed with a public path, such as "/" or "/assets".
Setting this option to the public path allows plugin-sri to resolve those imports.

**`default`** ""

Defined in: [index.ts:47](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/3aefbed/index.ts#L47)

___

### selectors

• `Optional` **selectors**: *string*[]

A list of strings you can provide that the plugin will use to match html tags with.
It will then try to compute an integrity attribute for the matched tag.
Currently it only matches script tags and link with rel=stylesheet as per specification.
see [the W3C spec](https://www.w3.org/TR/SRI/#elements) for more information.
The selector syntax is the same as jQuery's.

**`default`** ["script","link[rel=stylesheet]"]

Defined in: [index.ts:15](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/3aefbed/index.ts#L15)
