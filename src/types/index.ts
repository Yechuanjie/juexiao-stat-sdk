/**
 * 基础属性
 *
 * @type BaseProperties
 */
export type BaseProperties = {
  /** User Agent */
  user_agent: string
  /** 页面名称 */
  page_name: string
  /** 页面地址 */
  url: string
  /** http Header中的 referer 字段，表示来源网页 */
  referer: string
  /** 操作系统 */
  $os: 'Android' | 'IOS' | 'Windows' | 'Mac'
  /** 操作系统版本 */
  $os_version: string
}

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
  properties: BaseProperties
}
