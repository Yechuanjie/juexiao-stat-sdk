export interface CustomProperties<T> {}

export interface UserEvent {
  /** 用户唯一id，在用户没用登录的时候，移动端使用用户唯一设备id代替，web端使用UUID代替，微信端建议使用open_id代替，用户登录了，使用注册的id(觉晓号); */
  distinct_id: string
  /** 事件产生的时间，使用13位的时间戳表示(精确到毫秒) */
  time: number
  /** 事件上报的类型 */
  type: TRACK_TYPE
  /** 项目唯一标识 */
  project: string
  /** 事件名称，在明确上报信息是用户信息的时候没有这个字段 */
  event?: string
  /** 是否登录 */
  $is_login: boolean
  /** 事件属性，基于这条上报事件的属性，包含预置属性和自定义属性 */
  properties: PresetProperties
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
  /** 其他自定义属性 */
  [propName: string]: any
}

/** 事件上报的类型
 *  @var track 普通 track 事件
 *  @var trackSignUp 用户注册 - 用于绑定登录id和匿名id之间的操作
 *  @var profileSet 设置用户资料
 *  @var profileSetOnce 设置用户首次属性，与 profileSet 不同的是，如果被设置的用户属性已存在，则这条记录会被忽略，如果属性不存在则会自动创建
 */
export type TRACK_TYPE = 'track' | 'trackSignUp' | 'profileSet' | 'profileSetOnce'

export enum LOCAL_KEYS {
  JUEXIAO_STAT_UUID = 'JUEXIAO_STAT_UUID',
  LIBRARY_JS = 'js',
  LIBRARY_MINI = 'miniprogram'
}
