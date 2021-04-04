import { getHtml, emitAsset } from './util'
import { rollup } from 'rollup'
import { join } from 'path'
import { readFile } from 'fs/promises'
import sri from '../index'

process.chdir(join(__dirname, 'fixtures'));

describe('stylesheet', () => {
  test('basic', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
              <link rel="stylesheet" href="1.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri()
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('remote', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="https://raw.githubusercontent.com/JonasKruckenberg/rollup-plugin-sri/master/test/fixtures/1.css"></link>
          </body>
        </html>`),
        sri()
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('multiple hash algorithms', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="1.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri({ algorithms: ['sha256', 'sha384', 'sha512', 'whirlpool'] })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('uppercase hash algorithms', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="1.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri({ algorithms: ['SHA256', 'SHA384', 'SHA512'] })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('invalid hash algorithm', async () => {
    const onwarn = jest.fn()

    const bundle = await rollup({
      input: '1.js',
      onwarn,
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="1.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri({ algorithms: ['sha1'] })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
    expect(onwarn.mock.calls).toHaveLength(1)
    expect(onwarn.mock.calls[0][0]).toHaveProperty('message','Insecure hashing algorithm "sha1" will be rejected by browsers!')
  })

  test('crossorigin attribute', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="1.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri({ crossorigin: 'use-credentials' })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('invalid link', async () => {
    const onwarn = jest.fn()

    const bundle = await rollup({
      input: '1.js',
      onwarn,
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
            <link rel="stylesheet" href="invalid.css"></link>
          </body>
        </html>`),
        emitAsset('1.css', await readFile('1.css', 'utf-8')),
        sri({ crossorigin: 'use-credentials' })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
    expect(onwarn.mock.calls).toHaveLength(1)
    expect(onwarn.mock.calls[0][0]).toHaveProperty('message','could not resolve resource "invalid.css"!')  
  })
})