import {
  PresetProperties,
  UserEvent,
  LibrayType,
  TRACK_TYPE,
  InitOption,
  Constants,
  version
} from '../types'
import { getOsInfo, sendDataWithImg } from '../utils/browser'
import { generateUUID } from '../utils'

export default class JueXiaoBrowserStatSDK {
  private sdkVersion: string = version
  private sdkType: LibrayType = Constants.LIBRARY_JS
  /** 项目唯一标识 */
  private projectId = ''
  private trackData = {} as UserEvent
  /**
   * Creates an instance of JueXiaoBrowserStatSDK.
   * @param {InitOption} options
   * @memberof JueXiaoBrowserStatSDK
   */
  constructor(options: InitOption) {
    this.projectId = options.id
    this.init()
  }
  private init() {
    this.trackData.distinct_id = this.initUserId()
    this.trackData.is_login = false
    this.trackData.properties = this.registerPresetProperties()
    console.info('USER_EVENT_MODAL', this.trackData)
  }
  /**
   * 初始化UUID
   *
   * @private
   * @returns {string}
   * @memberof JueXiaoBrowserStatSDK
   */
  private initUserId(): string {
    let uuid = window.localStorage.getItem(Constants.JUEXIAO_STAT_UUID)
    if (!uuid) {
      uuid = generateUUID()
      window.localStorage.setItem(Constants.JUEXIAO_STAT_UUID, uuid)
    }
    return uuid
  }

  private _trackEvent(trackType: TRACK_TYPE = 'track', data?: PresetProperties) {
    this.trackData.type = trackType
    this.trackData.time = new Date().getTime()
    if (trackType === 'profileSet' || trackType === 'profileSetOnce') {
      if (data) {
        this.trackData.properties = data
      }
      sendDataWithImg(this.projectId, Constants.FETCH_IMAGE_URL, this.trackData)
    } else {
      let nowTrackData = Object.assign({}, this.trackData)
      if (data) {
        nowTrackData.properties = data
      }
      sendDataWithImg(this.projectId, Constants.FETCH_IMAGE_URL, nowTrackData)
    }
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
    preset.jx_lib = this.sdkType
    preset.jx_lib_version = this.sdkVersion
    // preset.jx_network_type = navigator['connection'].effectiveType
    if (navigator['connection']) {
      preset.jx_network_type = navigator['connection'].effectiveType
    } else {
      preset.jx_network_type = '4g'
    }
    preset.jx_screen_height = window.innerHeight
    preset.jx_screen_width = window.innerWidth
    preset.jx_os = osInfo.os
    preset.jx_os_version = osInfo.osVersion
    if (!osInfo.isMobile) {
      preset.jx_browser = osInfo.browser
      preset.jx_browser_version = osInfo.browserVersion
    }
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
      this.trackData.is_login = true
      this.trackData.distinct_id = String(loginId)
    } else {
      throw new Error('please make sure the login id is correct!')
    }
  }
}
