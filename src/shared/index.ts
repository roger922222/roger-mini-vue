export const extend = Object.assign

export const EMPTY_OBJ = {}

export const isString = value => typeof value === 'string'

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal)
}

export const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

// 串联形式变为驼峰命名的方式
export const camelize = (str: string) => {
  // 第一个参数获取的是-(\w)  第二个参数获取的是括号里面的   replace回调函数的return 值 把第一个参数替换
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

//  获取首字母 charAt(0) 转为大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


// 处理on的行为
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}