import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testid'
    const map = new Map()
    console.info(map)
  }
}
