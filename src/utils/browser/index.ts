/**
 * 获取操作系统信息
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
  let os = ''
  let ver = ''
  if (isAndroid) {
    os = 'Android'
    const index = ua.indexOf('android')
    ver = String(parseFloat(ua.slice(index + 8)))
  } else if (isIos || isMac) {
    os = isIos ? 'IOS' : 'Mac'
    const info = ua.match(/cpu iphone os (.*?) like mac os/) || []
    ver = String(info.length && info[1].replace(/_/g, '.'))
  } else if (isWindows) {
    os = 'Windows'
    const index = ua.indexOf('windows')
    ver = String(parseFloat(ua.slice(index + 11)))
  } else {
    os = 'unkown'
    ver = '0'
  }
  return {
    os,
    ver
  }
}
