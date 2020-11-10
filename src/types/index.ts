export interface CustomProperties<T> {}

export interface UserEvent {
  /** 用户唯一id，在用户没用登录的时候，移动端使用用户唯一设备id代替，web端使用UUID代替，微信端建议使用open_id代替 */
  distinct_id: string
  /** 用户登录的id(觉晓号) */
  user_id: string
  /** 事件产生的时间，使用13位的时间戳表示(精确到毫秒) */
  time: number
  /** 事件上报的类型 */
  type: TRACK_TYPE
  /** 事件名称，在明确上报信息是用户信息的时候没有这个字段 */
  event?: string
  /** 是否登录 */
  is_login: boolean
  /** 事件属性，基于这条上报事件的属性，包含预置属性和自定义属性 */
  properties: PresetProperties
}
export type OSType = 'Android' | 'IOS' | 'Windows' | 'Mac' | string
export type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none'
export type LibrayType = 'js' | 'wechat'
export type SourceType = 'wechat' | 'pc' | 'h5'
export type InitOption = {
  id: string
  source: SourceType
  debug?: boolean
}

/**
 * 预置属性
 *
 * @type PresetProperties
 */
export type PresetProperties = {
  /** 操作系统 */
  jx_os: OSType
  /** 操作系统版本 */
  jx_os_version: string
  /** 屏幕高度 */
  jx_screen_height: number
  /** 屏幕宽度 */
  jx_screen_width: number
  /** 网络类型 */
  jx_network_type: NetworkType
  /** SDK类型 */
  jx_lib: LibrayType
  /** SDK版本 */
  jx_lib_version: string
  /** 渠道 */
  jx_js_source: SourceType
  /** 设备品牌 */
  jx_brand?: string
  /** 设备制造商 */
  jx_manufacturer?: string
  /** 设备ID,IOS取用户的IDFA或UUID，安卓取AndroidID */
  jx_device_id?: string
  /** 设备型号 */
  jx_device_mode?: string
  /** 浏览器名称 */
  jx_browser?: string
  /** 浏览器版本 */
  jx_browser_version?: string
  /** 注册成功前使用的distinct_id */
  anonymous_id?: string
  /** 注册成功后获得的user id */
  register_id?: string
  /** 自增事件id 每一次产生数据的时候 +1 只在track接口增加，用户信息接口不增加 自增从1开始 */
  jx_track_id: number
  /** 每次启动app（全端）的时候生成全新的session_id，退出的时候清除session_id */
  session_id: string
  /** 用户唯一微信标识 */
  unionid?: string
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

export enum Constants {
  FETCH_URL = 'https://sdk.juexiaotime.com/sdk_js',
  FETCH_IMAGE_URL = 'https://sdk.juexiaotime.com/sdk_js.gif',
  JUEXIAO_STAT_UUID = 'JUEXIAO_STAT_UUID',
  LIBRARY_JS = 'js'
  // LIBRARY_MINI = 'wechat'
}

export const version = '__VERSION__'
