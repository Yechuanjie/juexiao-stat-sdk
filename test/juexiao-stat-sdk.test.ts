import { BrowserStatSDK } from '../src/juexiao-stat-sdk'
/**
 * BrowserStatSDK test
 */
describe('BrowserStatSDK test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('BrowserStatSDK Class is instantiable', () => {
    const stat = new BrowserStatSDK()
    expect(stat).toBeInstanceOf(BrowserStatSDK)
  })
})
