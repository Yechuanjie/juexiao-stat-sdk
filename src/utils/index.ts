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

/**
 * 版本号比较
 *
 * @param {string} curV 当前版本号
 * @param {string} reqV 比较版本号
 * @returns curV > reqV
 */
export const compareVersion = (curV: string, reqV: string) => {
  if (curV && reqV) {
    //将两个版本号拆成数字
    let arr1 = curV.split('.'),
      arr2 = reqV.split('.')
    let minLength = Math.min(arr1.length, arr2.length),
      position = 0,
      diff = 0
    //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
    while (
      position < minLength &&
      (diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
    ) {
      position++
    }
    diff = diff != 0 ? diff : arr1.length - arr2.length
    //若curV大于reqV，则返回true
    return diff > 0
  } else {
    //输入为空
    console.warn('版本号不能为空')
    return false
  }
}
