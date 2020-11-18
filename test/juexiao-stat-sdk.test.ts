import { BrowserStatSDK, MiniStatSDK } from '../src/juexiao-stat-sdk'
/**
 * SDK test
 */
describe('SDK test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('SDK Class is instantiable', () => {
    const stat = new BrowserStatSDK({
      id: 'test_1',
      source: 'h5'
    })
    expect(stat).toBeInstanceOf(BrowserStatSDK)
  })
})
