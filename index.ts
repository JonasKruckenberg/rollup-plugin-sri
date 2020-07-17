import cheerio from 'cheerio'
import { createHash } from 'crypto'
import { OutputAsset } from 'rollup'
import { debuglog } from 'util'
import fetch from 'node-fetch'
import { join, basename } from 'path'
import fs from 'fs-extra'

interface PluginOptions {
  /**
   * A list of strings you can provide that the plugin will use to match html tags with.
   * It will then try to compute an integrity attribute for the matched tag.
   * Currently it only matches script tags and link with rel=stylesheet as per specification.
   * see [the W3C spec](https://www.w3.org/TR/SRI/#elements) for more information.
   * The selector syntax is the same as jQuery's.
   * @default ["script","link[rel=stylesheet]"]
   */
  selectors?: string[]
  /**
   * A list of hashing algorithms to use when computing the integrity attribute.
   * The hashing algorithm has to be supported by the nodejs version you're running on and by the Browser you're targeting.
   * Browsers will ignore unknown hashing functions.
   * Standard hash functions as defined in the [subresource integrity specification](https://w3c.github.io/webappsec-subresource-integrity/#hash-functions) are: `sha256`, `sha384` and `sha512`.
   *
   * > NOTE: While browser vendors are free to support more algorithms than those stated above,
   * > they generally do not accept `sha1` and `md5` hashes.
   * @default ["sha384"]
   */
  algorithms?: string[]
  /**
   * Specifies the value for the crossorigin attribute.
   * This attribute has to be set on the generated html tags to prevent cross-origin data leakage.
   * The default value `anonymous` should be okay for normal use.
   * see: [the W3C spec](https://www.w3.org/TR/SRI/#cross-origin-data-leakage) for details.
   * @default "anonymous"
   */
  crossorigin?: 'anonymous' | 'use-credentials'

  /**
   * Can be used to disable the plugin, for example when used together with hot-module-reloading.
   * @default true
   */
  active?: boolean
}

export default (options?: PluginOptions) => {
  const selectors = options?.selectors || ['script', 'link[rel=stylesheet]']
  const hashAlgorithms = options?.algorithms || ['sha384']
  const crossorigin = options?.crossorigin || 'anonymous'
  const active = options?.active ?? true

  return {
    name: 'plugin-sri',

    async writeBundle(options, bundle) {
      if (!active) return
      for (const name in bundle) {
        if (name.endsWith('html')) {
          const chunk = bundle[name] as OutputAsset
          const $ = cheerio.load(chunk.source.toString())
          const elements = $(selectors.join()).get()
          for (const el of elements) {
            const url = $(el).attr('href') || $(el).attr('src')
            if (!url) return
            const id = basename(url)

            let buf: Buffer
            if (bundle[id]) {
              buf = await fs.readFile(join(options.dir, id))
            } else if (url.startsWith('http')) {
              buf = await (await fetch(url)).buffer()
            } else {
              return
            }

            const hashes = hashAlgorithms.map((algorithm) => generateIdentity(buf, algorithm))

            $(el).attr('integrity', hashes.join(' '))
            $(el).attr('crossorigin', crossorigin)
          }
          await fs.writeFile(join(options.dir, name), $.html())
        }
      }
    }
  }
}

function generateIdentity(source: Buffer, alg: string) {
  const hash = createHash(alg).update(source).digest().toString('base64')
  return `${alg}-${hash}`
}
