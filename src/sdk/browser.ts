import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testid'
    this.options.time = new Date().getTime()
    this.options.type = '_trackevent'
    console.info(this.options)
  }
}
