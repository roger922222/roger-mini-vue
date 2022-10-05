import { hasOwn } from "../shared/index"

const publicPropertiesMap = {
  $el: i => i.vnode.el
}

export const PublicInstanceProxyHandles = {
  get({_: instance}, key) {
    // setupState
    const { setupState, props } = instance
    // if (key in setupState) {
    //   return setupState[key]
    // }

    // if (key in props) {
    //   return props[key]
    // }

    // const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

    // 上面的形式一样，实现函数
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    // key ---> $el
    // if (key === '$el') return instance.vnode.el
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }

  },
}