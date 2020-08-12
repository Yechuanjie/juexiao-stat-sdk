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
export function sendData(id: string, url: string, data: UserEvent) {
  if (checkPropertyKey(data.properties)) {
    const URL = `${url}?data=${encodeURIComponent(JSON.stringify(data))}&project_id=${id}&type=${
      Constants.LIBRARY_MINI
    }`
    wx.request({
      url: URL,
      method: 'GET'
    })
  }
}
