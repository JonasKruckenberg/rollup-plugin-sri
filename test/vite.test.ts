import { build } from 'vite'
import { join } from 'path'
import sri from '../index'
import { OutputAsset, RollupOutput } from 'rollup';

process.chdir(join(__dirname, 'fixtures'));

describe('vite', () => {
    test('basic', async () => {
        const output = await build({
            logLevel: 'warn',
            plugins: [{
                enforce: 'post',
                ...sri({ publicPath: '/' })
            }]
        }) as RollupOutput

        const source = (Array.isArray(output) ? output[0].output : output.output)
            .filter((file): file is OutputAsset => file.type === 'asset')
            .map(({ fileName, source }) => ({ fileName, source }))
            .find(file => file.fileName.endsWith('.html'))

        expect(source).toMatchSnapshot()
    })
})