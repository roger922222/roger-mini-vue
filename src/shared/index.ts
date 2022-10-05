export const extend = Object.assign


export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal)
}

export const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)