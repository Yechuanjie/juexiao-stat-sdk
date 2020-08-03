import { LibrayType } from '../../types'

/**
 * 获取操作系统 和 浏览器 信息
 *
 * @export
 * @returns os 操作系统名字 ver 操作系统版本号
 */
export function getOsInfo() {
  const ua = window.navigator.userAgent.toLowerCase()
  const isAndroid = ua.match(/android/gi)
  const isIos = ua.match(/iphone|ipod|ipad/gi)
  const isWindows = ua.match(/windows/gi)
  const isMac = ua.match(/macintosh|mac os x/i)
  const isMobile = isAndroid || isIos
  let os = ''
  let osVersion = ''
  if (isAndroid) {
    os = 'Android'
    const index = ua.indexOf('android')
    osVersion = String(parseFloat(ua.slice(index + 8)))
  } else if (isIos || isMac) {
    os = isIos ? 'IOS' : 'Mac'
    const info = ua.match(/cpu iphone os (.*?) like mac os/) || []
    osVersion = String(info.length && info[1].replace(/_/g, '.'))
  } else if (isWindows) {
    os = 'Windows'
    const index = ua.indexOf('windows')
    osVersion = String(parseFloat(ua.slice(index + 11)))
  } else {
    os = 'unkown'
    osVersion = '0'
  }
  // PC需要返回浏览器信息
  let browser = ''
  let browserVersion = ''
  if (!isMobile) {
    const info = {
      IE: /tablet|msie/.test(ua) && !/opera/.test(ua), // 匹配IE浏览器
      Opera: /opera/.test(ua), // 匹配Opera浏览器
      Safari: /version.*safari/.test(ua), // 匹配Safari浏览器
      Chrome: /chrome/.test(ua), // 匹配Chrome浏览器
      Firefox: /gecko/.test(ua) && !/webkit/.test(ua) // 匹配Firefox浏览器
    }
    const browserInfo = Object.keys(info).filter(browser => info[browser])
    if (browserInfo.length) {
      browser = browserInfo[0]
      if (browser === 'IE') {
        if (ua.indexOf('msie') > -1) {
          const index = ua.indexOf('msie')
          browserVersion = String(parseFloat(ua.substring(index + 5, ua.indexOf(';', index))))
        } else {
          const index = ua.indexOf('rv:')
          browserVersion = String(parseFloat(ua.substring(index + 3)))
        }
      } else {
        const index = ua.indexOf(`${browser.toLowerCase()}/`)
        console.info(ua, index)
        browserVersion = String(parseFloat(ua.slice(index + browser.length + 1))) || ''
      }
    }
  }

  return {
    os,
    osVersion,
    browser,
    browserVersion
  }
}

/**
 * 生成UUID
 *
 * @export
 * @param {LibrayType} [sdkType='js']
 * @returns {string}
 */
export function generateUUID(sdkType: LibrayType = 'js'): string {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return `${sdkType}_${uuid}`
}
