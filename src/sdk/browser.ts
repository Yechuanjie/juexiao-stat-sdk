import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testidwwwww'
    this.options.time = new Date().getTime()
    this.options.type = '_trackevent'
    this.options.event = 'click'
    console.info(this.options)
  }
}
