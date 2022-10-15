import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance: any = getCurrentInstance()

  // 必须要在setup函数的作用下使用，做个判断
  if (currentInstance) {
    let { provides } = currentInstance

    const parentProvides = currentInstance.parent?.provides

    // 当组件自己有提供provides的时候，使用自己的，否则把它的父级组件的实例的provides设置在原型链上
    if (provides === parentProvides) { // init的时候，默认设置当前的组件provides与父级的provides一样的，当初始化只需要一次
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  // 取  从父级组件里的实例里面取provides

  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}