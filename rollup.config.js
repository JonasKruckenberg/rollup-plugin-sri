import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'

const production = process.env.NODE_ENV === 'production'
const banner = `/* ${pkg.name}
v${pkg.version}
By ${pkg.author.name} <${pkg.author.email}> (${pkg.author.url})
${new Date().toISOString()}
*/`

export default {
  input: 'index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: production,
      compact: production,
      banner
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: production,
      compact: production,
      banner
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
