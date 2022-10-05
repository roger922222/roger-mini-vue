import { isObject } from "../shared/index"
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"
// import { track, trigger } from "./effect"

// 利用高阶函数判断是否是readonly
// function createGetter(isReadonly = false) {
//   return function get(target, key) {
//     const res = Reflect.get(target, key)
//     if (!isReadonly) {
//       track(target, key)
//     }
//     return res
//   }
// }

// function createSetter() {
//   return function set(target, key, value) {
//     const res = Reflect.set(target, key, value)
//     // TODO 触发依赖 
//     trigger(target, key)
//     return res
//   }
// }

// function get(target, key) {
//   // target { foo: 1 }
//   // key foo
//   const res = Reflect.get(target, key)
//   // TODO 依赖收集
//   track(target, key)
//   return res
// }

// function set(target, key, value) {
//   const res = Reflect.set(target, key, value)
//   // TODO 触发依赖 
//   trigger(target, key)
//   return res
// }

// export function reactive (raw) {
//   return new Proxy(raw, {
//     get: createGetter(),
//     set: createSetter()
//   })
// }

// export function readonly(raw) {
//   return new Proxy(raw, {
//     get: createGetter(true),
//     set(target, key, value) {
//       return true
//     }
//   })
// }

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

function createActiveObject(raw, baseHandlers) {
  if (!isObject(raw)) {
    console.warn(`raw ${raw} 必须是一个对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}