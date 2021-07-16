import { Constants, UserEvent } from '../types'
import { checkPropertyKey } from './index'
import { wgs84tobd09 } from './location'
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
  } else if (isIos) {
    os = 'IOS'
    const info = ua.match(/cpu iphone os (.*?) like mac os/) || []
    osVersion = String(info.length && info[1].replace(/_/g, '.'))
  } else if (isMac) {
    os = 'Mac'
    const info = ua.split('mac os x ')[1].split(' ')[0]
    osVersion = info
      .substr(0, 8)
      .replace(')', '')
      .replace(/_/g, '.')
  } else if (isWindows) {
    os = 'Windows'
    const index = ua.indexOf('windows')
    osVersion = String(parseFloat(ua.slice(index + 11)))
  } else {
    os = 'unknow'
    osVersion = 'unknow'
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
    } else {
      browser = 'unknow'
      browserVersion = 'unknow'
    }
  }

  const obj = {
    isMobile,
    os,
    osVersion,
    browser,
    browserVersion
  }
  return obj
}

/**
 * 使用图片的请求方式
 *
 * @export
 * @param {string} id
 * @param {string} url
 * @param {UserEvent} data
 */
export function sendDataWithImg(id: string, url: string, data: UserEvent, debug: boolean = false) {
  if (checkPropertyKey(data.properties)) {
    let img: any = new Image()
    img.crossOrigin = 'anonymous'
    const key = 'img_log_' + Math.floor(Math.random() * 2147483648).toString(36) // 为本次数据请求创建一个唯一id
    window[key] = img
    img.onload = img.onerror = img.onabort = () => {
      img.onload = img.onerror = img.onabort = null // 清除img元素
      window[key] = null
      img = null
    }
    let fetchUrl = `${url}?data=${encodeURIComponent(JSON.stringify(data))}&project_id=${id}&type=${
      Constants.LIBRARY_JS
    }`
    // 开启调试时传入
    if (debug) {
      fetchUrl += '&debug=true'
    }
    img.src = fetchUrl
  }
}

interface PositionInfo {
  longitude?: number
  latitude?: number
}
/**
 * 获取经纬度
 *
 * @export
 * @returns {Promise<PositionInfo>}
 */
export function getLocation(): Promise<PositionInfo> {
  return new Promise(resolve => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const bdInfo = wgs84tobd09(position.coords.longitude, position.coords.latitude)
          resolve({
            longitude: bdInfo.longitude,
            latitude: bdInfo.latitude
          })
        },
        function(error) {
          console.warn(error.message)
          resolve({
            longitude: undefined,
            latitude: undefined
          })
        },
        options
      )
    } else {
      resolve({
        longitude: undefined,
        latitude: undefined
      })
    }
  })
}
