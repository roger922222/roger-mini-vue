import { extend, isObject } from "@roger-mini-vue/shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

// 缓存机制的优化，没有必要每次都调用createGetter,createSetter
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

// 利用高阶函数判断是否是readonly
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    // 看看res是不是object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // TODO 触发依赖 
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  // get: createGetter(),
  // set: createSetter()
  get,
  set
}

export const readonlyHandlers = {
  // get: createGetter(),
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} set 失败 因为 target 是 readonly`, target)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})