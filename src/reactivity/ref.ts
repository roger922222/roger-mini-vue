import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'


// 1 true '1' 等
// 怎么样知道get set 
// proxy ---> object  这个值针对的对象
// {} ---》 通过对象来进行包裹，这个对象就是ref类   这个类里面有value值，就可以有get set   这就是ref为什么有.value的程序设计
class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    // value ---> reactive
    // 1. 看看value是不是对象
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    // newValue ---> this._value
    // hasChanged
    // if (Object.is(newValue, this._value)) return
    // 如果是对象的时候，对比的普通对象，而不是响应式对象
    if (hasChanged(newValue, this._rawValue)) {
      // 先修改了value值，在通知
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue (ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  // 先判断是不是ref对象，是 返回 ref.value  否则返回 ref
  return isRef(ref) ? ref.value : ref
}