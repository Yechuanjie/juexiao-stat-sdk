import { OSType, Constants } from '../types'

/**
 * 格式化操作系统
 *
 * @export
 * @param {*} system
 * @returns
 */
export function formatSystem(system: string): OSType {
  var _system = system.toLowerCase()
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
 * @param {object} data
 */
export function sendData(id: string, url: string, data: object) {
  const URL = `${url}?data=${encodeURIComponent(JSON.stringify(data))}&project_id=${id}&type=${
    Constants.LIBRARY_MINI
  }`
  wx.request({
    url: URL,
    method: 'GET'
  })
}
