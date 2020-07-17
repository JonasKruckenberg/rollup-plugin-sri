import { expect } from 'chai'
import sri from '../index'

describe('sri-plugin', () => {
	it('is a function', () => {
		expect(sri).to.be.a('function')
	})
	it('returns an object', () => {
		expect(sri()).to.be.an('object')
		expect(sri()).to.have.property('name').which.equals('rollup-plugin-sri')
		expect(sri()).to.have.property('generateBundle').which.is.a('function')
	})
})
