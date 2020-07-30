import { UserEvent } from '../types/index'
export default class JueXiaoBrowserStatSDK {
  constructor(props: Object) {
    console.info(props)
  }
  options = {} as UserEvent
  init() {
    this.options.distinct_id = 'testidwwwww'
    this.options.time = new Date().getTime()
    this.options.type = '_trackevent'
    this.options.event = 'click'
    this.options.$is_login = true
    console.info(this.options)
  }
}
