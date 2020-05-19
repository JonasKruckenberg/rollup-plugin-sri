import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'

const production = process.env.NODE_ENV === 'production'

export default {
  input: 'index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: production,
      compact: production,
      banner: `/* rollup-plugin-sri\nv${pkg.version}\nBy ${
        pkg.author
      }\n${new Date().toISOString()}*/`
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: production,
      compact: production
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
