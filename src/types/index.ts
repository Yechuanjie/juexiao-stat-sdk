interface CustomProperties<T> {}

export interface UserEvent {
  /** 用户唯一id，在用户没用登录的时候，移动端使用用户唯一设备id代替，web端使用session_id代替，微信端建议使用open_id代替，用户登录了，使用注册的id(觉晓号); */
  distinct_id: string
  /** 事件产生的时间，使用13位的时间戳表示(精确到毫秒) */
  time: string
  /** 事件上报的接口 */
  type: string
  /** 事件名称，在明确上报信息是用户信息的时候没有这个字段 */
  event?: string
  /** 是否登录 */
  $is_login: boolean
  /** 事件属性，基于这条上报事件的属性，包含预置属性和自定义属性 */
  properties: PresetProperties & CustomProperties<any>
}
export type OSType = 'Android' | 'IOS' | 'Windows' | 'Mac'
export type NetworkType = 'wifi' | '2G' | '3G' | '4G' | '5G'
export type LibrayType = 'js' | 'miniprogram'

/**
 * 预置属性
 *
 * @type PresetProperties
 */
export type PresetProperties = {
  /** 操作系统 */
  $os: OSType
  /** 操作系统版本 */
  $os_version: string
  /** 屏幕高度 */
  $screen_height: number
  /** 屏幕宽度 */
  $screen_width: number
  /** 网络类型 */
  $network_type: NetworkType
  /** SDK类型 */
  $lib: LibrayType
  /** SDK版本 */
  $lib_version: string

  /** 设备品牌 */
  $brand?: string
  /** 设备制造商 */
  $manufacturer?: string
  /** 设备ID,IOS取用户的IDFA或UUID，安卓取AndroidID */
  $device_id?: string
  /** 设备型号 */
  $device_mode?: string
  /** 浏览器名称 */
  $browser?: string
  /** 浏览器版本 */
  $browser_version?: string
}
