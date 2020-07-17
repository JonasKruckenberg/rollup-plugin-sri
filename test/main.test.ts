import { expect } from 'chai'
import cheerio from 'cheerio'
import sri from '../index'
import fs from 'fs-extra'
import { resolve } from 'path'

describe('sri-plugin', () => {
	beforeEach(async () => {
		await fs.copy(resolve(__dirname, 'templates'), resolve(__dirname, 'files'))
	})
	afterEach(async () => {
		await fs.remove(resolve(__dirname, 'files'))
	})
	it('is a function', () => {
		expect(sri).to.be.a('function')
	})
	it('returns an object', () => {
		expect(sri()).to.be.an('object')
		expect(sri()).to.have.property('name').which.equals('plugin-sri')
		expect(sri()).to.have.property('writeBundle').which.is.a('function')
	})

	it('generates integrity and crossorigin attributes', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head></head>
					<body>
						<script src="index.js"></script>
					</body>
				</html>`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('script').attr('integrity')).to.equal(
			'sha384-xmG3hQa37t6kEKr06OiaPcpeYwUQPXOK3tiyKzoqlzvYb2Ehc6qCel8Z+V0QiKeE'
		)
		expect($('script').attr('crossorigin')).to.equal('anonymous')
	})

	it('can be disabled', async () => {
		const plugin = sri({
			active: false
		})

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head></head>
					<body>
						<script src="index.js"></script>
					</body>
				</html>`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('script').attr('integrity')).to.be.undefined
		expect($('script').attr('crossorigin')).to.be.undefined
	})

	it('takes multiple hashing algorithms', async () => {
		const plugin = sri({
			algorithms: ['sha1', 'sha256', 'sha384', 'sha512']
		})

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head></head>
					<body>
						<script src="index.js"></script>
					</body>
				</html>`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('script').attr('integrity')).to.equal(
			'sha1-B6my0pNn5anBDZ3ujJirm1VGgPs= sha256-SojU/IOdT+mEkVVsrIdXHc2+9JVg5VpB90Zl1VlPO2Y= sha384-xmG3hQa37t6kEKr06OiaPcpeYwUQPXOK3tiyKzoqlzvYb2Ehc6qCel8Z+V0QiKeE sha512-cLUmp3OGI/4XtGVOtO3k8rwpmMfltKX7DR9qqAHLwAcnRSUFrAQdbCKunaqfYQlgGA/YtB/ZPegsb6m1thcS4A=='
		)
		expect($('script').attr('crossorigin')).to.equal('anonymous')
	})

	it('fetches resource when external', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head></head>
					<link
						rel="stylesheet"
						href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
					/>
					<body></body>
				</html>`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('link').attr('integrity')).to.equal(
			'sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk'
		)
		expect($('link').attr('crossorigin')).to.equal('anonymous')
	})

	it('can change the crossorigin attribute', async () => {
		const plugin = sri({
			crossorigin: 'use-credentials'
		})

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head></head>
					<body>
						<script src="index.js"></script>
					</body>
				</html>
				`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('script').attr('integrity')).to.equal(
			'sha384-xmG3hQa37t6kEKr06OiaPcpeYwUQPXOK3tiyKzoqlzvYb2Ehc6qCel8Z+V0QiKeE'
		)
		expect($('script').attr('crossorigin')).to.equal('use-credentials')
	})

	it('can handle link rel="stylesheet" tags as well', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head>
						<link rel="stylesheet" href="index.js"></link>
					</head>
					<body>
					</body>
				</html>
				`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('link').attr('integrity')).to.equal(
			'sha384-xmG3hQa37t6kEKr06OiaPcpeYwUQPXOK3tiyKzoqlzvYb2Ehc6qCel8Z+V0QiKeE'
		)
		expect($('link').attr('crossorigin')).to.equal('anonymous')
	})

	it('ignores non rel="stylesheet" link tags', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head>
						<link rel="font" href="index.js"></link>
					</head>
					<body>
					</body>
				</html>
				`
				},
				'index.js': {}
			}
		)
		const $ = cheerio.load(await fs.readFile('test/files/index.html', 'utf8'))
		expect($('link').attr('integrity')).to.be.undefined
		expect($('link').attr('crossorigin')).to.be.undefined
	})

	it('escapes when source could not be found', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head>
					</head>
					<body>
						<script src="404.js"></script>
					</body>
				</html>
				`
				},
				'index.js': {}
			}
		)
	})

	it('escapes when html tag has no href or src attribute', async () => {
		const plugin = sri()

		await plugin.writeBundle(
			{ dir: 'test/files' },
			{
				'index.html': {
					source: `<!DOCTYPE html>
				<html lang="en">
					<head>
					</head>
					<body>
						<script></script>
						<link />
					</body>
				</html>
				`
				},
				'index.js': {}
			}
		)
	})
})
