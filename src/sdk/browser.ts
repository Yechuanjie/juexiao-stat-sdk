import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testid'
    this.options.time = new Date().getTime()
    this.options.type = 'track'
    console.info(this.options)
  }
}
