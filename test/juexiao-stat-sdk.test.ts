import { BrowserStatSDK } from '../src/juexiao-stat-sdk'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new BrowserStatSDK()).toBeInstanceOf(BrowserStatSDK)
  })
})
