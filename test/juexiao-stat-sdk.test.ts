import { BrowserStatSDK, MiniStatSDK } from '../src/juexiao-stat-sdk'
/**
 * BrowserStatSDK test
 */
describe('BrowserStatSDK test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('BrowserStatSDK Class is instantiable', () => {
    const stat = new BrowserStatSDK({
      id: 'test_1',
      source: 'h5'
    })
    const ministat = new MiniStatSDK({
      id: 'test_1',
      source: 'pc'
    })
    expect(stat).toBeInstanceOf(BrowserStatSDK)
    expect(ministat).toBeInstanceOf(MiniStatSDK)
  })
})
