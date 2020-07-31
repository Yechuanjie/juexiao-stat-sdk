import { BrowserStatSDK } from '../dist/juexiao-stat-sdk.umd'

const stat = new BrowserStatSDK()

console.info(stat.login('testid'))
