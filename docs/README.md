[rollup-plugin-sri](README.md)

# rollup-plugin-sri

## Index

### Interfaces

* [PluginOptions](interfaces/pluginoptions.md)

### Variables

* [debug](README.md#const-debug)

### Functions

* [generateIdentity](README.md#generateidentity)

## Variables

### `Const` debug

• **debug**: *function* = debuglog('rollup-plugin-sri')

*Defined in [index.ts:7](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/ad7bcb7/index.ts#L7)*

#### Type declaration:

▸ (`msg`: string, ...`param`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`...param` | any[] |

## Functions

###  generateIdentity

▸ **generateIdentity**(`source`: string, `alg`: string): *string*

*Defined in [index.ts:86](https://github.com/JonasKruckenberg/rollup-plugin-sri/blob/ad7bcb7/index.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | string |
`alg` | string |

**Returns:** *string*
