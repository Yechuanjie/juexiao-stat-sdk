import { PresetProperties, UserEvent, LibrayType, OSType } from '../types'
import { getOsInfo, generateUUID } from '../utils/browser/index'

export default class JueXiaoBrowserStatSDK {
  sdkVersion: string = process.env.npm_package_version || ''
  sdkType: LibrayType = 'js'
  private userTrackEvent = {} as UserEvent
  constructor() {
    this.userTrackEvent.$is_login = false
    this.userTrackEvent.distinct_id = generateUUID()
    this.userTrackEvent.type = ''
    this.userTrackEvent.time = ''
    this.userTrackEvent.properties = this.registerPresetProperties()
    console.info('USER_EVENT_MODAL', this.userTrackEvent)
  }
  /**
   * 注册预置属性
   *
   * @protected
   * @param {Object} params
   * @memberof JueXiaoBrowserStatSDK
   */
  protected registerPresetProperties(): PresetProperties {
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
   * 设置登录
   *
   * @param {string} [loginId='']
   * @memberof JueXiaoBrowserStatSDK
   */
  login(loginId: string): void {
    if (loginId) {
      this.userTrackEvent.$is_login = true
      this.userTrackEvent.distinct_id = loginId
    } else {
      throw new Error('please make sure the login id is correct!')
    }
  }
}
