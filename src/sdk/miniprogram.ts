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
import { formatSystem, sendData } from '../utils/mini'
import { generateUUID } from '../utils'

export default class JueXiaoMiniStatSDK {
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
   * Creates an instance of JueXiaoMiniStatSDK.
   * @param {InitOption} options
   * @memberof JueXiaoMiniStatSDK
   */
  constructor(options: InitOption) {
    this.projectId = options.id
    this.source = options.source
    this.isDebug = typeof options.debug === 'boolean' ? options.debug : false
    this.init()
  }
  private async init() {
    this.trackData.distinct_id = this.initUserId()
    this.trackData.is_login = false
    this.initProperties = await this.registerPresetProperties()
    this.trackData.properties = this.initProperties
    console.info('USER_EVENT_MODAL', this.trackData)
  }
  /**
   * 初始化UUID
   *
   * @private
   * @returns {string}
   * @memberof JueXiaoMiniStatSDK
   */
  private initUserId(): string {
    let uuid = wx.getStorageSync(Constants.JUEXIAO_STAT_UUID)
    if (!uuid) {
      uuid = generateUUID(Constants.LIBRARY_JS)
      wx.setStorageSync(Constants.JUEXIAO_STAT_UUID, uuid)
    }
    return uuid
  }

  private async _trackEvent(trackType: TRACK_TYPE = 'track', data?: any) {
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
    sendData(this.projectId, Constants.FETCH_IMAGE_URL, this.trackData, this.isDebug)
  }
  track(eventName: string, data = {}) {
    this.trackData.event = eventName
    this._trackEvent('track', data)
  }
  /**
   * 设置预置属性 已存在的字段则覆盖，不存在则自动创建
   *
   * @param {*} [options={}]
   * @memberof JueXiaoMiniStatSDK
   */
  profileSet(options: object = {}) {
    this._trackEvent('profileSet', options)
  }
  /**
   * 设置用户首次属性，与 profileSet 不同的是，如果被设置的用户属性已存在，则这条记录会被忽略，如果属性不存在则会自动创建
   *
   * @param {object} options
   * @memberof JueXiaoMiniStatSDK
   */
  profileSetOnce(options: object = {}) {
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
   * @memberof JueXiaoMiniStatSDK
   */
  private async registerPresetProperties(): Promise<PresetProperties> {
    const preset = {} as PresetProperties
    preset.jx_lib = this.sdkType
    preset.jx_lib_version = this.sdkVersion
    preset.jx_js_source = this.source
    preset.session_id = this.getSessionId()
    const network = await wx.getNetworkType()
    preset.jx_network_type = network.networkType
    const sys = wx.getSystemInfoSync()
    preset.jx_manufacturer = sys['brand']
    preset.jx_device_mode = sys['model']
    preset.jx_screen_width = Number(sys['screenWidth'])
    preset.jx_screen_height = Number(sys['screenHeight'])
    preset.jx_os = formatSystem(sys['platform'])
    preset.jx_os_version =
      sys['system'].indexOf(' ') > -1 ? sys['system'].split(' ')[1] : sys['system']

    console.info(`sdk-version: ${this.sdkVersion}`)
    return preset
  }
  /**
   * 用户注册-用于绑定登录id和匿名id之间的操作
   *
   * @param {string} loginId 用户注册成功后返回的userid
   * @memberof JueXiaoMiniStatSDK
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
   * @memberof JueXiaoMiniStatSDK
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
   * @memberof JueXiaoMiniStatSDK
   */
  async logout() {
    this.trackData.is_login = false
    this.trackData.user_id = ''
    this.trackData.properties = this.initProperties
  }
  /**
   * 上传opendid
   *
   * 为了提高数据的准确性，小程序需要在运行时从服务端获取 openid 和 unionid
   *
   * 注意：openid一定能获取到，unionid在用户从未登录授权过公众号时无法获取到
   * @param {string} openid
   * @memberof JueXiaoMiniStatSDK
   */
  setOpenid(openid: string) {
    // 传入openid 且 当前没有登录时才设置openid
    // 已登录用户无需再设置 openid
    if (openid && !this.trackData.is_login) {
      this.trackData.distinct_id = String(openid)
      // 把本地的uuid替换为openid
      wx.setStorageSync(Constants.JUEXIAO_STAT_UUID, openid)
    }
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
