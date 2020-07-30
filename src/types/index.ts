export interface UserEvent {
  /** 用户唯一id，在用户没用登录的时候，移动端使用用户唯一设备id代替，web端使用session_id代替，微信端建议使用open_id代替，用户登录了，使用注册的id(觉晓号); */
  distinct_id: string
  /** 事件产生的时间，使用13位的时间戳表示(精确到毫秒) */
  time: number
  /** 事件上报的接口 */
  type: string
  /** 事件名称，在明确上报信息是用户信息的时候没有这个字段 */
  event?: string
  /** 是否登录 */
  $is_login: boolean
  /** 事件属性，基于这条上报事件的属性，包含预置属性和自定义属性 */
  properties: PresetProperties
}
export type CustomProperties<T = any> = any
export type OSType = 'Android' | 'IOS' | 'Windows' | 'Mac'
export type NetworkType = 'wifi' | '2G' | '3G' | '4G' | '5G'
export type LibrayType = 'js' | 'miniprogram'

/**
 * 预置属性
 *
 * @type PresetProperties
 */
export type PresetProperties = {
  $brand: string
  $manufacturer: string
  $device_mode: string
  $os: OSType
  $os_version: string
  $device_id?: string
  $screen_height: number
  $screen_width: number
  $network_type: NetworkType
  $browser: string
  $browser_version: string
  $lib: LibrayType
  $lib_version: string
  $is_login: boolean
}
