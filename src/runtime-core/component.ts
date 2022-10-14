import { proxyRefs } from "../index"
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    next: null,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {}
  }

  component.emit = emit.bind(null, component) as any

  return component
}

export function setupComponent(instance) {
  // TODO
  // initProps
  initProps(instance, instance.vnode.props)
  // initSlots
  initSlots(instance, instance.vnode.children)
  // 初始化一个有状态的component
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type
 
  // ctx
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandles)

  const { setup } = Component

  if (setup) {
    // 每个组件对应的自己的实例对象 调用setup的时候赋值
    // currentInstance = instance  优化为函数的赋值方式
    setCurrentInstance(instance)
    // return function | object    如果返回的是function就可以认为是组件的render函数，如果返回的object,把对象注入到组件的上下文中
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    // currentInstance = null
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  //  function Object
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type

  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }

  instance.render = Component.render
}

let currentInstance = null

// 此方法vue3文档不在公开，自己学习一下
export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  // 好处：全局跟踪的时候，在这里打断点即可
  currentInstance = instance
}

let compiler
export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}