import md5 from 'js-md5'
import {
  PresetProperties,
  UserEvent,
  LibrayType,
  TRACK_TYPE,
  InitOption,
  Constants,
  version,
  SourceType
} from '../types'
import { getLocation, getOsInfo, sendDataWithImg } from '../utils/browser'
import { compareVersion, generateUUID } from '../utils'

export default class JueXiaoBrowserStatSDK {
  private sdkVersion: string = version
  private sdkType: LibrayType = Constants.LIBRARY_JS
  /** 项目唯一标识 */
  private projectId = ''
  private source: SourceType
  private isDebug = false
  private trackTimes = 1
  private trackData = {} as UserEvent
  private initProperties = {} as PresetProperties
  /**
   * Creates an instance of JueXiaoBrowserStatSDK.
   * @param {InitOption} options
   * @memberof JueXiaoBrowserStatSDK
   */
  constructor(options: InitOption) {
    this.projectId = options.id
    this.source = options.source
    this.isDebug = typeof options.debug === 'boolean' ? options.debug : false
    this.init(options)
  }
  private async init(options: InitOption) {
    this.trackData.distinct_id = this.initUserId()
    this.trackData.is_login = false
    this.initProperties = this.registerPresetProperties(options.appSource)
    this.trackData.properties = this.initProperties
    if (options.userId) {
      this.login(options.userId)
    }

    this.initActiveTimeout()
    // 兼容版本 version > 1.3.13
    if (compareVersion(this.sdkVersion, '1.3.13')) {
      // 自动触发启动事件
      this.track('$startApp')
    }

    // 获取位置并设置预置属性
    const locationInfo = await getLocation()
    this.initProperties.jx_longitude = locationInfo.longitude
    this.initProperties.jx_latitude = locationInfo.latitude
    // 如果获取位置成功 上报一次jx_location
    locationInfo.latitude && this.track('jx_location')
  }
  /**
   * 初始化活跃状态定时器
   * 当用户初始化sdk后，一直挂起到第二天，会被认为是非活跃状态，需要主动 track 一次 $startApp 事件
   * @private
   * @memberof JueXiaoBrowserStatSDK
   */
  private initActiveTimeout() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    // ios 日期不能使用"-" 使用"/"代替
    const date = `${year}/${month}/${day}`
    const startTime = now.getTime()
    // 结束时间为第二天的0点过1秒
    const endTime = new Date(date).getTime() + 24 * 60 * 60 * 1000 + 1000
    setTimeout(() => {
      this.track('$startApp')
      this.initActiveTimeout()
    }, endTime - startTime)
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

  private _trackEvent(trackType: TRACK_TYPE = 'track', data?: any) {
    this.trackData.type = trackType
    this.trackData.time = new Date().getTime()
    if (trackType !== 'track') {
      delete this.trackData['event']
    }
    this.trackData.properties = Object.assign({}, this.initProperties, data || {})
    if (trackType === 'track') {
      this.trackData.properties.jx_track_id = this.trackTimes
      this.trackTimes += 1
    }
    sendDataWithImg(this.projectId, Constants.FETCH_IMAGE_URL, this.trackData, this.isDebug)
  }

  track(eventName: string, data = {}) {
    this.trackData.event = eventName
    this._trackEvent('track', data)
  }
  /**
   * 设置预置属性 已存在的字段则覆盖，不存在则自动创建
   *
   * @param {*} [options={}]
   * @memberof JueXiaoBrowserStatSDK
   */
  profileSet(options: object = {}) {
    // const data = Object.assign({}, this.trackData.properties, options)
    this._trackEvent('profileSet', options)
    this.track('$startApp')
  }
  /**
   * 设置用户首次属性，与 profileSet 不同的是，如果被设置的用户属性已存在，则这条记录会被忽略，如果属性不存在则会自动创建
   *
   * @param {object} options
   * @memberof JueXiaoBrowserStatSDK
   */
  profileSetOnce(options: object = {}) {
    // const data = Object.assign({}, options, this.trackData.properties)
    this._trackEvent('profileSetOnce', options)
  }
  /**
   * 获取session_id
   *
   * @private
   * @returns {string}
   * @memberof JueXiaoBrowserStatSDK
   */
  private getSessionId(): string {
    return `${md5(this.trackData.distinct_id)}_${new Date().getTime()}`
  }
  /**
   * 注册预置属性
   *
   * @private
   * @param {Object} params
   * @memberof JueXiaoBrowserStatSDK
   */
  private registerPresetProperties(appSource?: string): PresetProperties {
    const preset = {} as PresetProperties
    const osInfo = getOsInfo()
    preset.app_source = appSource
    preset.session_id = this.getSessionId()
    preset.jx_lib = this.sdkType
    preset.jx_js_source = this.source
    preset.jx_lib_version = this.sdkVersion
    if (navigator['connection']) {
      preset.jx_network_type = navigator['connection'].effectiveType
    } else {
      preset.jx_network_type = 'unknown'
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
    if (!loginId) {
      throw new Error('please make sure the login id is correct!')
    }
    this.trackData.properties.anonymous_id = this.initUserId()
    this.trackData.properties.register_id = loginId
    this._trackEvent('trackSignUp')
    delete this.trackData.properties['anonymous_id']
    delete this.trackData.properties['register_id']
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
      this.trackData.user_id = String(loginId)
    } else {
      throw new Error('please make sure the login id is correct!')
    }
  }
  /**
   * 退出登录
   *
   * @memberof JueXiaoBrowserStatSDK
   */
  logout(): void {
    this.trackData.is_login = false
    this.trackData.user_id = ''
    this.trackData.properties = this.initProperties
  }
  /**
   * 设置公共属性，设置后每次上报都会带有设置的属性
   *
   * @param {*} [params={}]
   * @memberof JueXiaoBrowserStatSDK
   */
  setPublicProperties(params: object = {}) {
    this.initProperties = Object.assign({}, params, this.initProperties)
  }
  /**
   * 上传unionid
   *
   * 为了提高数据的准确性，小程序需要在运行时从服务端获取 openid 和 unionid
   *
   * 注意：openid一定能获取到，unionid在用户从未登录授权过公众号时无法获取到
   * @param {string} unionid
   * @memberof JueXiaoMiniStatSDK
   */
  setUnionid(unionid: string) {
    if (unionid) {
      this.initProperties.unionid = unionid
    }
  }
}
