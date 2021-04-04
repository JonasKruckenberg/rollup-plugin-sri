import { getHtml } from './util'
import { join } from 'path'
import { rollup } from 'rollup'
import html from '@rollup/plugin-html'
import sri from '../index'

process.chdir(join(__dirname, 'fixtures'));

describe('@rollup/plugin-html', () => {
    test('basic', async () => {
        const bundle = await rollup({
            input: '1.js',
            plugins: [
                html({}),
                sri()
            ]
        })

        const source = await getHtml(bundle)
        expect(source).toMatchSnapshot()
    })
    test('public path', async () => {
        const bundle = await rollup({
            input: '1.js',
            plugins: [
                html({
                    publicPath: '/assets'
                }),
                sri({ 
                    publicPath:'/assets' 
                })
            ]
        })

        const source = await getHtml(bundle)
        expect(source).toMatchSnapshot()
    })
})