import {
  PresetProperties,
  UserEvent,
  LibrayType,
  OSType,
  TRACK_TYPE,
  InitOption,
  Constants,
  version
} from '../types'
import { formatSystem, sendData } from '../utils/mini'
import { generateUUID } from '../utils'

export default class JueXiaoMiniStatSDK {
  private sdkVersion: string = version
  private sdkType: LibrayType = Constants.LIBRARY_MINI
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
  private async init() {
    this.trackData.distinct_id = this.initUserId()
    this.trackData.is_login = false
    this.trackData.properties = await this.registerPresetProperties()
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
    let uuid = wx.getStorageSync(Constants.JUEXIAO_STAT_UUID)
    if (!uuid) {
      uuid = generateUUID(Constants.LIBRARY_MINI)
      wx.setStorageSync(Constants.JUEXIAO_STAT_UUID, uuid)
    }
    return uuid
  }

  private _trackEvent(trackType: TRACK_TYPE = 'track', data?: PresetProperties) {
    this.trackData.type = trackType
    this.trackData.time = new Date().getTime()
    if (data) this.trackData.properties = data
    // todo api
    sendData(this.projectId, Constants.FETCH_URL, this.trackData)
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
  private async registerPresetProperties(): Promise<PresetProperties> {
    const preset = {} as PresetProperties
    preset.jx_lib = this.sdkType
    preset.jx_lib_version = this.sdkVersion

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
      this.trackData.distinct_id = loginId
    } else {
      throw new Error('please make sure the login id is correct!')
    }
  }
  /**
   * 上传opendid
   *
   * 为了提高数据的准确性，小程序需要在运行时从服务端获取 openid，并主动调用 sdk 提供的 setOpenid 方法。
   * 在 app.js 文件 onLaunch 周期中调用 stat.sendOpenid() 方法上传从后端获取的 OpenID。
   *
   * @param {string} openid
   * @memberof JueXiaoMiniStatSDK
   */
  setOpenid(openid: string) {
    // 传入openid 且 当前没有登录时才设置openid
    // 已登录用户无需再设置 openid
    if (openid && !this.trackData.is_login) {
      this.trackData.distinct_id = openid
      // 把本地的uuid替换为openid
      wx.setStorageSync(Constants.JUEXIAO_STAT_UUID, openid)
    }
  }
}
