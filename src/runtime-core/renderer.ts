import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {

  // TODO 判读vnode 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component

  // patch 后面的递归处理
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断 是不是 element
  // 去处理组件
  processComponent(vnode, container) 
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  // vnode 树  ---> patch
  // vnode ---> element ---> mountElement
  patch(subTree, container)
}

