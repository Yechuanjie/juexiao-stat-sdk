import { LibrayType } from '../types'
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

/**
 * 校验数据格式是否正确
 *
 * @export
 * @param {object} data
 * @returns {boolean} 是否通过校验
 */
export function checkPropertyKey(data: object): boolean {
  // 非对象直接抛出错误
  if (Object.prototype.toString.call(data) === '[object Object]') {
    console.warn(`请检查自定义属性是否为 object 类型`)
    return false
  }
  const reg = /^([a-zA-Z][a-zA-Z_0-9]{0,49}$)/
  let isPass = true
  Object.keys(data).forEach(key => {
    if (!reg.test(key)) {
      isPass = false
      throw new Error(
        `数据格式校验失败，属性 ${key} 不符合规则：以字母开头，可包含字母、数值、下划线，且长度不超过50`
      )
    }
  })
  return isPass
}
