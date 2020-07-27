import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testid'
    console.info(this.options)
  }
}
