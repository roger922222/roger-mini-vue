import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
  }

  return component
}

export function setupComponent(instance) {
  // TODO
  // initProps
  initProps(instance, instance.vnode.props)
  // initSlots
  
  // 初始化一个有状态的component
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type
 
  // ctx
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandles)

  const { setup } = Component

  if (setup) {
    // return function | object    如果返回的是function就可以认为是组件的render函数，如果返回的object,把对象注入到组件的上下文中
    const setupResult = setup(shallowReadonly(instance.props))

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  //  function Object
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type

  instance.render = Component.render
}