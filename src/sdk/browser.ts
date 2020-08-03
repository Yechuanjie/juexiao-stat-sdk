import { PresetProperties, UserEvent, LibrayType, OSType, TRACK_TYPE, LOCAL_KEYS } from '../types'
import { getOsInfo, generateUUID } from '../utils/browser/index'

export default class JueXiaoBrowserStatSDK {
  sdkVersion: string = process.env.npm_package_version || ''
  sdkType: LibrayType = LOCAL_KEYS.LIBRARY_JS
  private trackData = {} as UserEvent
  /**
   * Creates an instance of JueXiaoBrowserStatSDK.
   * @param {string} project 项目唯一标识
   * @memberof JueXiaoBrowserStatSDK
   */
  constructor(project: string) {
    this.init(project)
  }
  private init(project: string) {
    this.trackData.project = project
    this.trackData.distinct_id = this.initUserId()
    this.trackData.$is_login = false
    this.trackData.properties = this.registerPresetProperties()
    // 移除为空的属性
    // const props = Object.assign({}, this.trackData.properties)
    // Object.keys(props).forEach(key => {
    //   if (props[key] === '') {
    //     delete this.trackData.properties[key]
    //   }
    // })
    console.info('USER_EVENT_MODAL', this.trackData)
  }
  /**
   *初始化UUID
   *
   * @private
   * @returns {string}
   * @memberof JueXiaoBrowserStatSDK
   */
  private initUserId(): string {
    let uuid = window.localStorage.getItem(LOCAL_KEYS.JUEXIAO_STAT_UUID)
    if (!uuid) {
      uuid = generateUUID()
      window.localStorage.setItem(LOCAL_KEYS.JUEXIAO_STAT_UUID, uuid)
    }
    return uuid
  }

  protected _trackEvent(trackType: TRACK_TYPE = 'track', data?: PresetProperties) {
    this.trackData.type = trackType
    this.trackData.time = new Date().getTime()
    if (data) this.trackData.properties = data
    // todo api上报数据
  }

  track(eventName: string, data = {}) {
    this.trackData.event = eventName
    let props = Object.assign({}, this.trackData.properties, data)
    this._trackEvent('track', props)
  }
  /**
   * 设置预置属性 已存在的字段则覆盖，不存在则自动创建
   *
   * @param {*} [options={}]
   * @memberof JueXiaoBrowserStatSDK
   */
  profileSet(options: object = {}) {
    const data = Object.assign({}, this.trackData.properties, options)
    this._trackEvent('profileSet', data)
  }
  /**
   * 设置用户首次属性，与 profileSet 不同的是，如果被设置的用户属性已存在，则这条记录会被忽略，如果属性不存在则会自动创建
   *
   * @param {object} options
   * @memberof JueXiaoBrowserStatSDK
   */
  profileSetOnce(options: object = {}) {
    const data = Object.assign({}, options, this.trackData.properties)
    this._trackEvent('profileSetOnce', data)
  }
  /**
   * 注册预置属性
   *
   * @private
   * @param {Object} params
   * @memberof JueXiaoBrowserStatSDK
   */
  private registerPresetProperties(): PresetProperties {
    const preset = {} as PresetProperties
    const osInfo = getOsInfo()
    preset.$browser = osInfo.browser
    preset.$browser_version = osInfo.browserVersion
    preset.$lib = this.sdkType
    preset.$lib_version = this.sdkVersion
    if (navigator.hasOwnProperty('connection')) {
      preset.$network_type = navigator['connection'].effectiveType
    } else {
      preset.$network_type = '4G'
    }
    preset.$os = osInfo.os as OSType
    preset.$os_version = osInfo.osVersion
    preset.$screen_height = window.innerHeight
    preset.$screen_width = window.innerWidth
    // 下面四个属性，在 web/h5 端无法获取，默认不需要
    // preset.$brand = ''
    // preset.$manufacturer = ''
    // preset.$device_id = ''
    // preset.$device_mode = ''
    console.info(`sdk-version: ${this.sdkVersion}`)
    return preset
  }
  /**
   * 用户注册-用于绑定登录id和匿名id之间的操作
   *
   * @param {string}
   * @memberof JueXiaoBrowserStatSDK
   */
  trackSignUp(loginId: string): void {
    // 调用 login() 更新用户id
    this.login(loginId)
    // 上报
    this._trackEvent('trackSignUp')
  }
  /**
   * 用户登录 - 用于更新用户id
   *
   * @param {string}
   * @memberof JueXiaoBrowserStatSDK
   */
  login(loginId: string): void {
    if (loginId) {
      this.trackData.$is_login = true
      this.trackData.distinct_id = loginId
    } else {
      throw new Error('please make sure the login id is correct!')
    }
  }
}
