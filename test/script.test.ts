import { getHtml, emitAsset } from './util'
import { rollup } from 'rollup'
import { join } from 'path'
import sri from '../index'

process.chdir(join(__dirname, 'fixtures'));

describe('script', () => {
  test('basic', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
              <script src="1.js"></script>
          </body>
        </html>`),
        sri()
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('inactive', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
              <script src="1.js"></script>
          </body>
        </html>`),
        sri({ active: false })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })

  test('no src', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
              <script></script>
          </body>
        </html>`),
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
              <script src="https://raw.githubusercontent.com/JonasKruckenberg/rollup-plugin-sri/master/test/fixtures/1.js"></script>
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
              <script src="1.js"></script>
          </body>
        </html>`),
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
              <script src="1.js"></script>
          </body>
        </html>`),
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
              <script src="1.js"></script>
          </body>
        </html>`),
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
              <script src="1.js"></script>
          </body>
        </html>`),
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
              <script src="invalid.js"></script>
          </body>
        </html>`),
        sri({ crossorigin: 'use-credentials' })
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
    expect(onwarn.mock.calls).toHaveLength(1)
    expect(onwarn.mock.calls[0][0]).toHaveProperty('message','could not resolve resource "invalid.js"!')  
  })

  test('nointegrity attribute', async () => {
    const bundle = await rollup({
      input: '1.js',
      plugins: [
        emitAsset('index.html', `
        <!DOCTYPE html>
          <html lang="en">
          <body>
              <script data-nointegrity="" src="1.js"></script>
          </body>
        </html>`),
        sri()
      ]
    })

    const source = await getHtml(bundle)
    expect(source).toMatchSnapshot()
  })
})