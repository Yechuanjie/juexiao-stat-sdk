import { OSType, Constants, UserEvent } from '../types'
import { checkPropertyKey } from './index'

/**
 * 格式化操作系统
 *
 * @export
 * @param {*} system
 * @returns
 */
export function formatSystem(system: string): OSType {
  const _system = system.toLowerCase()
  if (_system === 'ios') {
    return 'IOS'
  } else if (_system === 'android') {
    return 'Android'
  } else {
    return system
  }
}

/**
 * 发送数据
 *
 * @export
 * @param {string} id
 * @param {string} url
 * @param {UserEvent} data
 */
export function sendData(id: string, url: string, data: UserEvent, debug: boolean = false) {
  if (checkPropertyKey(data.properties)) {
    let URL = `${url}?data=${encodeURIComponent(JSON.stringify(data))}&project_id=${id}&type=${
      Constants.LIBRARY_JS
    }`
    // 开启调试时传入
    if (debug) {
      URL += '&debug=true'
    }
    // 根据环境不同使用 wx,my,qq
    if (wx) {
      wx.request({
        url: URL,
        method: 'GET'
      })
    } else if (my) {
      my.request({
        url: URL,
        method: 'GET'
      })
    } else if (qq) {
      qq.request({
        url: URL,
        method: 'GET'
      })
    }
  }
}
